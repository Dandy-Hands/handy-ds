# Interview Guide: Component Build Process (Spec & Document → Build)

- Status: complete
- Started: 2026-09-21

## 1. Problem & Goal
Goal: Establish what this process spec must achieve and why it exists.

- [x] Q1: What goes wrong today that this process fixes? What does the process need to produce at the end of one component's lifecycle?
  > The specs created are uncessarily verbose and not clean enough. No api documentation is produced. Too much is assumed by the agent. I want a little more input when specing the extensions/additional props for the exisitng components. When building a new component, we'll need a research phase probably, but we can cross that bridge later. Don't know if I love the location of the specs.
- [x] Q2: Who uses the outputs, and how? (Agents building client apps; designers; maintainers of this repo.)
  > Agents are the primary audience, building client applications and website. Most likely claude. Designers sometime, but not really a consideration.

## 2. Phase 1 — Spec & Document
Goal: Pin down what "spec and document" means concretely for one Base UI component.

- [x] Q3: What does the Phase 1 output look like for a single component? Which artifacts (spec doc, API doc, Figma file), and where do they live?
  > Spec doc and API doc. Specs are only for building the components. They are not outward facing. Spec should contain description and usage statement, API reference (props, I guess) and API extension (additional props we are adding), then token mapping. For API, there should be an API index docoument for all components containing their name and a short description containing usage statement (when to use, when not to use) and points to individual component API docs that contain a combined API table with prop and value descriptions.
- [x] Q4: What must the concise API documentation cover for an agent to build with the component correctly? What is deliberately left out?
  > A: [R] Deferred to research — user wants API doc conventions researched. Opinions captured: complex prop types likely get per-value definitions when needed (see Q14). Do NOT list omitted Base UI props — building agents are never told the component wraps Base UI, so they have no context to hunt for them. (My earlier proposal: purpose/usage, props table, extended props flagged, tokens consumed, contexts — keep as research starting point.)
- [x] Q5: How do we decide which Base UI props/behavior to expose, rename, wrap, or omit in our component?
  > A: Per-component discussion, not a blanket rule — decided in the component specing interview (each prop/behavior talked through).
- [x] Q15: Does Phase 1 run as an interview with you (like this one) per component? If so, what must the process spec define for that interview (structure, artifacts it produces)?
  > Yes, it does. That interview must decide what base ui props go in by the agent providing descriptions for each one at a time and then we discuss what props we will add on top. The agent can propose a list of addition and the user can opine on that adding and taking away as they see fit. Then we go into defining each prop in greater detail.
- [x] Q12: Where should component specs and docs live in the repo? (Current `.claude/specs/` location "not loved" per Q1 — what location is preferred and why?)
  > Split: specs/ + api/
- [x] Q13: What makes a spec "not verbose / clean enough"? What length and structure should a component spec target?
  > That it is complete and nothing more. It documents what the agent needs to build. My thinking is it contains description with a do and don't usage atatement (about 3 sentences), a base-ui api section (what props it already has), a extension api section (what props we add), and sections for each of the props when relevant and how they map tokens.
- [x] Q14: In API doc prop descriptions, do complex prop types get per-value definitions (e.g. each variant value described), or just the type?
  > Yes

## 3. Phase 2 — Build (Code & Figma)
Goal: Pin down the build phase: code and Figma, their order and acceptance.

- [x] Q6: What does the code build consume as input (Phase 1 docs? token names?) and what counts as "done"?
  > Phase 1 spec docs. Not the API docs.
- [x] Q7: What role does Figma play — is it generated, hand-built, or both? What must match between code and Figma?
  > I will likely handbuild from spec or have claude do it.

## 4. Scope & Ordering
Goal: Establish which components go first and what stays out of v1.

- [x] Q8: Which component(s) pilot this process first, and what defines success for the pilot?
  > button and card
- [x] Q9: What is explicitly out of scope for this process spec?
  > A: All four candidates confirmed out of scope: new-component research phase (parked below), client app build rules (docs/rules.md), token system changes, publishing/versioning.

## 5. Constraints & Acceptance
Goal: Establish hard constraints and how we verify the process works.

- [x] Q10: What constraints must the process respect (existing conventions, token rules, Base UI version, review gates)?
  > All four
- [x] Q11: How will we know the process works? What does a finished, accepted component prove?
  > It'll provide the agent with just enough context to build and not so much that it get's confused. The build will match the specs. I won't be able to test consumtion just yet.

## Parked for feature interviews

- New-component research phase: "When building a new component, we'll need a research phase probably, but we can cross that bridge later." (parked from Q1) — this process spec covers Base UI-derived components only.

## Closing notes (final pass, confirmed by user)

- Phase order per component: spec → API docs → code → Figma. No conflict between Q3/Q7.
- Per-component interview guides live alongside specs in `docs/component-specs/` (follows from Q12).
- Q4 is [R]: API doc conventions need research — the spec is NOT fully ready until that research lands. See TODO.md.
