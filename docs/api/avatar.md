# Avatar

## Usage

Avatar shows a person's photo in a round frame, with initials or an icon when there is no photo or it fails to load. Use it to identify a person or an account next to a name, in lists, headers, and comments. Don't use it for content images or logos; use `<img>`.

## Props

### Avatar.Root

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'800' \| '1000' \| '1200' \| '1600'` | `'1000'` | Width and height. `800`: small, for dense lists and inline use. `1000`: the standard avatar. `1200`: large, for headers. `1600`: extra large, for profile cards. The initials size follows. |
| `children` | `ReactNode` | — | The parts: `Avatar.Image` and `Avatar.Fallback`. |

### Parts

| Part | Prop | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `Avatar.Image` | `src` | `string` | — | The photo URL. The image shows only after it loads. |
| `Avatar.Image` | `alt` | `string` | — | Text for screen readers. Use `""` when the person's name shows next to the avatar. |
| `Avatar.Image` | `srcSet`, `sizes` | `string` | — | Responsive image sources, as on `<img>`. |
| `Avatar.Image` | `loading` | `'eager' \| 'lazy'` | `'eager'` | `eager`: load now. `lazy`: load when near the screen; also set `keepMounted`. |
| `Avatar.Image` | `keepMounted` | `boolean` | `false` | Loads the image in place. Set it with `loading="lazy"` or an optimized image component. |
| `Avatar.Image` | `onLoadingStatusChange` | `(status: 'idle' \| 'loading' \| 'loaded' \| 'error') => void` | — | Called when the image load status changes. |
| `Avatar.Image` | `render` | `ReactElement` | — | Renders an optimized image component, such as `next/image`, in place of `<img>`. Set `keepMounted` with it. |
| `Avatar.Fallback` | `children` | `ReactNode` | — | Initials (one or two letters) or an `Icon`. Shows when there is no image or it fails. Always include it. |
| `Avatar.Fallback` | `delay` | `number` | `0` | Milliseconds to wait before the fallback shows. Stops a flash while a fast image loads. |

Avatar and its parts accept no other props.

## Examples

```tsx
<Avatar.Root>
  <Avatar.Image src={user.photoUrl} alt="" />
  <Avatar.Fallback delay={300}>RL</Avatar.Fallback>
</Avatar.Root>
```

```tsx
<Avatar.Root size="1600">
  <Avatar.Fallback><Icon>person</Icon></Avatar.Fallback>
</Avatar.Root>
```

## Contexts

All colors follow an ancestor's `data-context` (`on-primary`, `on-secondary`, `default`) and `data-section` overrides.
