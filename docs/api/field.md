# Field

## Usage

Field is one labelled form value: label, control, description, and error, wired to each other for assistive tech. Fieldset groups related fields; Form validates and submits. Use the full Field set for any labelled text entry, and bare Input only when a control has no visible label — then give it an `aria-label`.

## Props

### Field.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `invalid` | `boolean` | — | Marks the field and its control, description and error with `data-invalid`. |

### Input

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control size. `sm` — dense rows and compact layouts. `md` — default. `lg` — large or hero forms. `Field.Control` takes the same axis as `data-size`. |

### Field.Error

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `match` | `boolean \| ValidityState key` | — | Shows the error when the control's validity matches. `valueMissing` — empty required field. `typeMismatch` — wrong format, e.g. an email. `true` — always show. |

### Form

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onSubmit` | `(event: FormEvent) => void` | — | Fires when the form submits. |

`children` holds content on every part (label, control, description and error), and `render` (`ReactElement \| (props, state) => ReactElement`) replaces the rendered element on any part. All standard attributes (`id`, `aria-*`, `name`, `placeholder`, `required`, ...) are also accepted on the control parts.

## Examples

```tsx
<Form onSubmit={submit}>
  <Field.Root>
    <Field.Label>Name</Field.Label>
    <Field.Control placeholder="Jane Doe" required />
    <Field.Description>As it appears on your ID.</Field.Description>
    <Field.Error match="valueMissing">Enter your name.</Field.Error>
  </Field.Root>
</Form>
```

```tsx
<Input size="sm" placeholder="Compact" />
<Fieldset.Root>
  <Fieldset.Legend>Billing address</Fieldset.Legend>
  <Field.Root><Field.Label>City</Field.Label><Field.Control /></Field.Root>
</Fieldset.Root>
```

## Contexts

Field error text is contrast-checked in the default context only. Inside a colored section, put the form in a `data-context="default"` container. On normal pages no context handling is needed.
