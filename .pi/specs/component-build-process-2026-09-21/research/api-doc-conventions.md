# API Doc Conventions Research

- Date: 2026-09-21
- Question: What format should the outward-facing component API docs follow so agents can build client apps with `handy-ds` without confusion?
- Decision: Adopt a closed-catalog format: one index plus one page per component, with strict sections and prop-table rules.
- Consequences: All component API docs must follow this shape. The internal component spec and the API doc are separate artifacts.

## Findings

Agent-friendly component documentation and established design-system docs converge on the same pattern:

- A **closed catalog** (index + per-component pages) prevents agents from inventing unsupported props or components.
- A **usage statement** (when to use / when not to use) reduces misuse better than a generic description.
- A **schema-bounded props table** (name, type, default, description) is the minimum contract an agent needs.
- For **union/enum props**, each allowed value must be defined so the agent knows what it means semantically, not just syntactically.
- **Examples** should be minimal and realistic; exhaustive prop matrices add noise.
- Internal implementation, raw token values, and references to the underlying library should not appear in the outward-facing doc.

Sources:
- AgentsKit Chat component catalog: index + contract matrix + per-key schema pages.
- StackBlitz design-system docs guidance: component docs need usage guidelines, do/don't examples, and consistent terminology.
- Create UI Button docs: usage statement + props table + concise examples.
- Carbon Svelte `Link` docs: prop table with type/default/description.

## Conventions

### `docs/api/index.md`

One index page listing every public component:

- **Component name**
- **One-line purpose**
- **Usage statement** (when to use / when not to use)
- **Link** to `docs/api/<component>.md`

### `docs/api/<component>.md`

Required sections, in order:

1. **Usage**
   - 2–3 sentences.
   - State when to use the component and when not to use it.

2. **Props**
   - Markdown table with columns: `Prop`, `Type`, `Default`, `Description`.
   - For union/enum types, the Description must list each allowed value and its meaning.
   - For callback props, include the signature and the event that triggers it.
   - Show a Default only when the component supplies one.

3. **Examples**
   - 1–2 short TSX snippets.
   - Use realistic, common prop combinations.
   - Do not exhaust every prop.

4. **Contexts** (optional)
   - List supported `data-context` values if the component honors context overrides.

### Rules

- Do not mention `Base UI`, `base-ui`, `@base-ui/react`, or any implementation detail.
- Do not list omitted Base UI props.
- Do not include raw token values, primitive references, or driver values.
- Keep descriptions one sentence. Use a second sentence only for value definitions or important constraints.
