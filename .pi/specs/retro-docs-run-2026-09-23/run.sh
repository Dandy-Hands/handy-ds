#!/bin/bash
# Retroactive component docs run — one pi agent per component group.
# Usage: bash .pi/specs/retro-docs-run-2026-09-23/run.sh [group...] (default: all)
set -u
cd "$(dirname "$0")/../../.."
ROOT="$(pwd)"
RUN="$ROOT/.pi/specs/retro-docs-run-2026-09-23"
LOG="$RUN/logs"; mkdir -p "$LOG"

# group-slug|families(file basenames, comma)|branch
GROUPS=(
  "input|Field,NumberField,Checkbox,Radio|docs/input-controls"
  "select-combobox|Select,Combobox|docs/select-combobox"
  "menus|Menu,NavigationMenu,Toolbar|docs/menus"
  "overlays|Dialog,Popover,Accordion|docs/overlays"
  "feedback|Alert,Toast,Meter|docs/feedback"
  "toggles|Switch,Toggle,Tabs|docs/toggles"
  "surfaces|Card,Table,Separator,Icon|docs/surfaces"
)
# Filter to requested groups if args given
if [ $# -gt 0 ]; then
  WANT=("$@")
  FILTERED=()
  for g in "${GROUPS[@]}"; do
    slug="${g%%|*}"
    for w in "${WANT[@]}"; do
      [ "$slug" = "$w" ] && FILTERED+=("$g")
    done
  done
  GROUPS=("${FILTERED[@]}")
fi

PIDS=()
parse() { slug="${1%%|*}"; rest="${1#*|}"; families="${rest%%|*}"; branch="${rest#*|}"; }
for entry in "${GROUPS[@]}"; do
  parse "$entry"
  echo "=== launching $slug -> $branch ==="
  (
    # worktree
    git -C "$ROOT" worktree add -b "$branch" "$RUN/wt-$slug" origin/main 2>"$LOG/$slug.add.err" \
      || git -C "$ROOT" worktree add "$RUN/wt-$slug" "$branch" 2>>"$LOG/$slug.add.err"
    cd "$RUN/wt-$slug" || exit 1
    ln -sfn "$ROOT/node_modules" node_modules
    ln -sfn "$ROOT/docs-site/node_modules" docs-site/node_modules
    pi -p --no-session \
      --skill /Users/ryan/.pi/agent/projects-memory/handy-ds/skills/hds-component-spec-interview \
      --skill /Users/ryan/.pi/agent/projects-memory/handy-ds/skills/hds-component-docs \
      -nc \
      "You are the agent for group '$slug' (component families: $families).
FIRST read $RUN/BRIEF.md in full and follow it exactly. The owner is absent; do not ask questions.
Your component families: $families. One spec dir + API doc + MDX per family.
When finished, push branch '$branch' and print the DONE report block from the brief as your final output." \
      >"$LOG/$slug.out" 2>"$LOG/$slug.err"
    echo "$slug exit=$? $(git -C "$RUN/wt-$slug" log --oneline -1 2>/dev/null)"
  ) &
  PIDS+=($!)
done

echo "launched ${#PIDS[@]} agents: ${PIDS[*]}"
wait
echo "=== all agents finished ==="
for entry in "${GROUPS[@]}"; do
  parse "$entry"
  echo "--- $slug ---"
  tail -20 "$LOG/$slug.out" 2>/dev/null
done
