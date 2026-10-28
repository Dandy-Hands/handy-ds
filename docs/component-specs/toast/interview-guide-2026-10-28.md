# Toast — Spec Interview Guide (2026-10-28)

Re-interview (`[re]` in `.claude/component-interview-todo.md`). Last of the Tier 4 overlay set. The dry-run
spec (`spec.md`, 2026-09-23) and code (`src/components/Toast.tsx`: the `Toast` namespace and `<Toaster />`)
exist. Wraps `Toast` from `@base-ui/react/toast`.

Base UI version documented from: `@base-ui/react` 1.8.0.

Base UI facts:
- Parts: `Provider` (`timeout` 5000, `limit` 3, `toastManager`), `Portal`, `Viewport`, `Positioner`, `Root`,
  `Content`, `Title`, `Description`, `Action`, `Close`, `Arrow`, plus `useToastManager()` and
  `createToastManager()`.
- `useToastManager()` returns `toasts`, `add(options)`, `close(id)`, `update(id, options)`, `promise(...)`.
- `add` options: `id`, `title`, `description`, `type`, `timeout`, `priority` (`low` default, `high` is read at
  once), `actionProps`, `onClose`, `onRemove`, `data`, `positionerProps`, `anchor`.

## Format

Claude decided the API (the user leans on Claude for props) and showed it for confirmation.

## Decisions

- [x] Q1: The API (Claude's decision).
  > `<ToastProvider>` once at the app root, no props; it also draws the toast area (removes `<Toaster />`).
  > `const toast = useToast()`, `toast({ title, tone?, action? })`. `tone`: `info | success | warning |
  > danger`, default `info`. `action`: `{ label, onClick }`. Built in: 5 s timeout, 10 s with an action, pause
  > on hover, X button, 3 at a time. Omitted: `description`, custom timeout and position, `close`, `update`,
  > `promise`. "Looks good to me."

## Token mapping

Claude calls (token interview scope), listed in `spec.md` for review.

- [x] Q2: Toast look (revision 2026-10-28).
  > From the inverse mode talk (see the Tooltip guide): always dark, `data-mode="dark"` in both page modes.
  > Neutral surface ground; `tone` sets the icon and its color only. "Oh, brilliant. So toast is always dark
  > mode!?" ... "I like it. Continue."
