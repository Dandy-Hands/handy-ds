Status:
- spec: reviewed
- code: built
- figma: built
- docs: pending

# Internal Spec: Toast

- Date: 2026-10-28 (re-interview; replaces the 2026-09-23 dry-run spec)
- Interview: `interview-guide-2026-10-28.md`
- Base UI version documented from: `@base-ui/react` 1.8.0 (`@base-ui/react/toast`)

## Description

Toast is a short message in the bottom end corner of the screen that closes by itself, such as "Saved". The API has two members: `<ToastProvider>`, placed once around the app, which also draws the toast area; and `useToast()`, a hook that returns one function, `toast(options)`. Each toast is always dark (`data-mode="dark"` in both page modes), with an icon in its tone color, an X button, and at most one action button.

## Usage

- Do use Toast to confirm that an action finished: saved, sent, deleted.
- Do add an `action` for a quick reversal, such as Undo.
- Do use `tone="danger"` for a failure the user must notice, and write what to do next in the title.
- Don't use Toast for a message that must stay readable. Use Alert.
- Don't use Toast to ask a question. Use Alert Dialog.

## Base UI API

Wrapped: `Provider`, `Portal`, `Viewport`, `Root`, `Content`, `Title`, `Action`, `Close`, and `useToastManager`, all used inside `ToastProvider` and `useToast`. None is exported. The `Toast` namespace and `<Toaster />` are removed.

| Base UI member | Decision |
| --- | --- |
| `Provider` `children` | Exposed on `ToastProvider`. |
| `Provider` `timeout`, `limit`, `toastManager` | Omitted. `limit` fixed at 3. Timeout set per toast (below). |
| `createToastManager` | Omitted (a toast from outside React). |
| `Portal`, `Viewport`, `Root`, `Content`, `Title`, `Action`, `Close` | Rendered inside `ToastProvider`. |
| `Description` | Omitted. The title holds the whole sentence. |
| `Positioner`, `Arrow`, `add` `anchor`, `positionerProps` | Omitted (a toast attached to an element). |
| `useToastManager` `add` | Wrapped as `toast(options)`. Returns nothing. |
| `useToastManager` `toasts`, `close`, `update`, `promise` | Omitted. One method: call `toast()` when the work is done. |
| `add` `title` | Exposed as `title`. |
| `add` `type` | Exposed as `tone` (Feedback axis name, API conventions section 6). Maps to `type`. |
| `add` `priority` | Not exposed. `tone: 'danger'` sets `high`; other tones set `low`. |
| `add` `timeout` | Not exposed. 5000 ms; 10000 ms when `action` is set. |
| `add` `actionProps` | Built from `action`: `{ children: label, onClick }`. |
| `add` `id`, `description`, `onClose`, `onRemove`, `data` | Omitted. |
| Pause on hover and focus, swipe to close | Base UI default, kept. |

## Extension API

`ToastProvider`

| Prop | Type | Default | Decision |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The app. Place one provider at the root. |

`useToast(): (options: ToastOptions) => void`

| Option | Type | Default | Decision |
| --- | --- | --- | --- |
| `title` | `ReactNode` | required | The message. One short sentence. |
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Sets the icon and its color only: `info`, `check_circle`, `warning`, `error` (Icon glyph names) in `feedback/{tone}/icon`. The ground stays neutral. Set as `data-tone`. |
| `action` | `{ label: ReactNode; onClick: () => void }` | — | One button after the title. A click runs `onClick` and closes the toast. |

Layout rules:

- Toast area: fixed in the bottom end corner, `measure/space/400` from the edges, newest toast at the bottom. On a narrow screen, full width minus the gap.
- Toast: row of icon, title, action button, X button. Max width `measure/width/9600`.
- Action: secondary Button, size `800`. X: tertiary Button, size `800`, `XIcon`, `aria-label="Close"`.
- The toast sets `data-mode="dark"` in both page modes (decided 2026-10-28). Its buttons re-resolve to their dark-mode colors through the mode scope.

## Token mapping

Claude calls (token interview scope). Surface ground under `data-mode="dark"`; only the icon reads Feedback.

| Part | Tokens |
| --- | --- |
| Toast ground | `hds/sem/color/surface/floating/bg`, `hds/sem/color/surface/floating/border`, `hds/sem/border/container`, `hds/sem/radius/container`, `hds/sem/elevation/floating` |
| Title | `hds/sem/color/content/default/fg`, `hds/sem/typography/body/*`, `hds/sem/typography/body/size/md` |
| Icon | `hds/sem/color/feedback/{tone}/icon`, `hds/sem/measure/size/500` |
| Padding | `hds/sem/measure/space/400` |
| Gap inside the row | `hds/sem/measure/space/300` |
| Gap between toasts, gap to the screen edge | `hds/sem/measure/space/400`, `hds/sem/measure/space/400` |
| Max width | `hds/sem/measure/width/9600` |
| Action button | `hds/sem/color/action/secondary/*` (Button) |
| X button | `hds/sem/color/action/tertiary/*` (Button) |
| Focus ring | `hds/sem/color/focus/ring`, `hds/sem/border/focus` |

Notes:

- Toast no longer uses the Feedback ground in `Feedback.css`; that stays with Alert.
- Contrast: the buttons and text sit on `surface/floating/bg` (dark), already checked pairs. The icon needs 3:1 for `feedback/{tone}/icon` on dark `surface/floating/bg`; add the pair if the checker lacks it.
- No primitive or driver references.
