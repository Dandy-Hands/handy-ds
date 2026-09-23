# Interview Guide: Alert component (retroactive)

- Status: complete
- Started: 2026-09-23
- Component: Alert (`src/components/Alert.tsx` + shared `Feedback.css`)
- Note: Retroactive guide. Owner directed the interview be skipped for this run; every answer below is derived from the existing component code and `.claude/decisions.md` (cite which).
- Base UI version documented from: `@base-ui/react` 1.8.0

## 1. Existing surface (confirmations)

- [x] Q1: Keep the existing surface as-is — a single-part `Alert` with three extension props (`sentiment`, `heading`, `icon`) and nothing else?
  > Yes — `AlertProps` declares exactly those (`Alert.tsx` lines 11–15). docs/components.md lists the same three.
- [x] Q2: No Base UI primitive — Alert uses `useRender` + `mergeProps` so it takes the same `render` prop as Base UI parts?
  > Yes — the implementation calls `useRender({ defaultTagName: 'div', render, ... })` (lines 18–24). decisions.md Wave 5: "Card, Alert, Text use `useRender`." Base UI ships no alert component.

## 2. Extension props

- [x] Q3: `sentiment` is `'info' | 'success' | 'warning' | 'danger'`, default `'info'`, set as `data-sentiment`?
  > Yes — `sentiment = 'info'` default (line 17) and `'data-sentiment': sentiment` (line 21). token-system-spec section 4: Feedback axis is sentiment (danger/warning/success/info).
- [x] Q4: `heading` renders as a styled `<p>` inside the alert body (not a prop-driven heading level), and `icon` renders inside a token-colored span?
  > Yes — `{heading && <p className="hds-feedback__heading">{heading}</p>}` and `{icon && <span className="hds-feedback__icon">{icon}</span>}` (lines 23–25). `Feedback.css` colors the icon span with the sentiment's `icon-fg`.

## 3. Behavior and tokens

- [x] Q5: No live-region role by default; the caller passes `role="alert"` (urgent) or `role="status"` (polite) when the alert appears in response to an action?
  > Yes — doc comment on the component (lines 17–19) and docs/components.md: "Alert has no live-region role by default." decisions.md Wave 5: "no live-region role by default (static banners shouldn't announce)."
- [x] Q6: Alert reads only Feedback tokens — color per sentiment (`bg`, `fg`, `border`, `icon-fg`) plus shared measure (padding, radius, gap, border-width)?
  > Yes — `Feedback.css` maps `data-sentiment` to the four color tokens per sentiment and reads `hds/sem/feedback/measure/*`. token-system-spec section 7 Feedback definition.
- [x] Q7: Toast shares the same Feedback look, so Alert's sentiment styling stays in `Feedback.css` rather than an `Alert.css`?
  > Yes — `Feedback.css` header comment: "Feedback category: Alert and Toast." decisions.md Wave 4: shared category CSS maps an axis once.
