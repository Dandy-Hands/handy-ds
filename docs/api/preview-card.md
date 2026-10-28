# PreviewCard

## Usage

PreviewCard shows a preview of a link's destination when the pointer rests on the link or the link gets keyboard focus. Use it for a summary of a linked page, profile, or item. Don't put content in it that the user needs, because touch users do not see it. Don't wrap a control that is not a link; use Tooltip or Popover.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactElement` | — | Required. The link: an `<a href>` or a router link. One element. It gets the link color and an underline. |
| `content` | `ReactNode` | — | Required. The preview, such as an image, a name, and a short summary. |
| `side` | `'top' \| 'bottom' \| 'inline-start' \| 'inline-end'` | `'bottom'` | The side of the link the preview opens on. `inline-start` and `inline-end` follow the text direction. It flips when it does not fit. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | How the preview lines up along the link. `start`: with the start edge. `center`: centered. `end`: with the end edge. |
| `width` | `'auto' \| '6400' \| '8000' \| '9600' \| '12800'` | `'auto'` | Width of the preview. `auto`: the content sets it, up to `maxWidth`. `6400`: narrow. `8000`: medium. `9600`: wide. `12800`: extra wide. |
| `maxWidth` | `'6400' \| '8000' \| '9600' \| '12800'` | `'9600'` | Largest width of the preview. Same steps as `width`. |

The preview opens after a short rest on the link and closes shortly after the pointer leaves. PreviewCard accepts no other props.

## Examples

```tsx
<p>
  Written by{' '}
  <PreviewCard
    width="8000"
    content={
      <Stack gap="200">
        <Avatar.Root><Avatar.Image src="/ana.jpg" alt="" /></Avatar.Root>
        <Text variant="label">Ana Ruiz</Text>
        <Text size="sm">Head of design. Writes about type and color.</Text>
      </Stack>
    }
  >
    <a href="/team/ana">Ana Ruiz</a>
  </PreviewCard>
</p>
```

## Contexts

The preview shows at the end of the page, outside the content around the link. It uses the page colors and mode. The link itself follows its ancestors.
