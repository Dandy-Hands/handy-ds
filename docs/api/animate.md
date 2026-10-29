# Animate

## Usage

Animate plays a one-time entrance animation on each of its children, when the child scrolls into view or when it first appears. It adds no box, so it never changes the layout. Use it around page sections, cards, or list items. Don't use it for hover, press, or open and close effects; the components do those themselves.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `effect` | `"fade" \| "fade-up" \| "scale"` | `"fade-up"` | How each child enters. `"fade"` — fades in. `"fade-up"` — fades in and moves up a short distance. `"scale"` — fades in and grows slightly to its full size. |
| `trigger` | `"view" \| "mount"` | `"view"` | When each child animates. `"view"` — when the child first scrolls into view; a child already in view when the page loads shows at once. `"mount"` — when the child is added to the page; use it for content that appears after the page loads, such as a lazy-loaded section. |
| `stagger` | `boolean` | `false` | Children that start at the same time start one after another. |
| `children` | `ReactNode` | — | The content. Each direct child element animates by itself. |

Each animation runs one time. A user who asks for reduced motion sees the content with no animation.

## Examples

```tsx
<Section>
  <Animate>
    <Text variant="headline" render={<h2 />}>Our services</Text>
    <Text>Everything you need to launch.</Text>
  </Animate>
</Section>
```

```tsx
<Grid cols={{ base: 1, md: 3 }}>
  <Animate effect="scale" stagger>
    {services.map((s) => <Card key={s.id}>{s.title}</Card>)}
  </Animate>
</Grid>
```

Put Animate inside a layout component: the children stay items of that layout.

```tsx
<Suspense fallback={null}>
  <Animate trigger="mount">
    <Reviews />
  </Animate>
</Suspense>
```
