# Token Trees by Layer

Companion to `current-token-structures.md`. Same system, expressed as trees. Terminology mapped to the rework discussion: **drivers** (hand-set), **ref** (`hds/prim` — the palettes), **map** (Theme Map selections), **sym** (`hds/sem` — application by category).

Sources: `.claude/specs/token-system-spec.md` §2/§7/§8, `src/tokens/drivers.ts`, `src/tokens/primitives.ts`.

---

## Layer 1 — Drivers (hand-set inputs)

```
Drivers
├─ color/                          ← any parseable CSS color
│  ├─ primary ──── #0069ca
│  ├─ accent ───── #d55c13
│  ├─ neutral ─────(optional; omit → tinted from primary hue)
│  ├─ danger ───── #cc272e
│  ├─ warning ──── #dc8900
│  ├─ success ──── #1b9247
│  └─ info ─────── #0081b1
├─ typography/
│  ├─ headingFamily ─ "Source Serif 4", Georgia, serif
│  ├─ bodyFamily ──── Inter, system-ui, sans-serif
│  ├─ baseSize ────── 16          (type scale step 3)
│  ├─ scaleRatio ──── 1.25        (per-step multiplier)
│  └─ headingWeight ─ bold
├─ density ──────── 1             (multiplies the 4px grid)
├─ radius ───────── 8             (the `base` step, px; others scale from it)
├─ style/                          ← per-category picks on shared scales
│  ├─ action/   radius: base   · border: thin
│  ├─ input/    radius: base   · border: thin
│  └─ surface/  radius: lg     · border: thin
├─ shadow/
│  └─ strength ──── 1             (0 = flat, >1 = heavier)
└─ sections/
   └─ hero ──────── on-primary    (data-section → context)
```

---

## Layer 2 — Ref (`hds/prim/*`) — the palettes

Frozen shape, derived values. No category segment.

```
hds/prim/
├─ color/
│  ├─ primary/ 50·100·200·300·400·500·600·700·800·900·950   ← 11-step OKLCH ramp
│  ├─ accent/   50…950              (same ramp shape)
│  ├─ neutral/  50…950              (tinted from primary hue if neutral driver omitted)
│  ├─ danger/   50…950
│  ├─ warning/  50…950
│  ├─ success/  50…950
│  ├─ info/     50…950
│  ├─ white
│  └─ black
├─ space/
│  └─ 0·1·2·3·4·5·6·8·10·12·16·20·24        ← n × 4px × density
├─ radius/
│  └─ none·sm·base·lg·xl·full               ← 0 · ½r · r · 1½r · 2r · ∞
├─ border/
│  └─ none·thin·medium·thick                ← 0/1/2/4px spine (constant, not driver-derived)
├─ type/
│  ├─ scale/    1·2·3·4·5·6·7·8·9           ← baseSize × ratio^(n−3); 3 = body
│  ├─ leading/  tight·snug·normal·relaxed   ← 1.1 · 1.25 · 1.5 · 1.65
│  ├─ tracking/ tight·normal·wide           ← −0.02em · 0 · 0.02em
│  ├─ weight/   regular·medium·semibold·bold ← 400/500/600/700
│  └─ family/   heading·body                ← copied verbatim from drivers
└─ shadow/
   └─ level-0·level-1·level-2·level-3       ← strength-scaled y/blur/alpha triples
```

Sample values (default drivers):

```
color/primary/500 ── oklch(62% 0.19 250)    space/4 ──── 16px
color/neutral/950 ── oklch(23% 0.01 250)    radius/lg ── 12px
type/scale/3 ─────── 1rem                   shadow/level-2 ── 0 4px 12px oklch(0% 0 0 / 0.10)
```

Not tokens: `breakpoints` (`sm 640 · md 768 · lg 1024 · xl 1280`) — build-time export, unusable in `@media` as a custom property.

---

## Layer 3 — Map (Theme Map selections)

Not tokens — the mapping rules. Category style drivers select ref steps; every sym token reads one ref slot through it.

```
ThemeMap
├─ action/  radius → hds/prim/radius/base     border → hds/prim/border/thin
├─ input/   radius → hds/prim/radius/base     border → hds/prim/border/thin
├─ surface/ radius → hds/prim/radius/lg       border → hds/prim/border/thin
└─ (everything else) contrast rules + fixed assignments, e.g.
   ├─ action/primary/bg      → color/primary/600 (default), /700 (hover)…
   ├─ surface/0/bg           → color/neutral/50
   ├─ type/heading/fg        → color/neutral/900
   └─ focus/stroke           → color/primary/600
```

---

## Layer 4 — Sym (`hds/sem/*`) — application by category

```
Category/type/[axis]/[state]/property
```

```
hds/sem/
├─ action/
│  ├─ color/
│  │  ├─ primary/  default·hover·active·focus·disabled·selected  × {bg·fg·border}
│  │  ├─ secondary/  …same states × same properties
│  │  └─ tertiary/   …same states × same properties
│  └─ measure/
│     └─ sm·md·lg  × {padding-x·padding-y·radius·gap·border-width}
│                    (only Button exposes size; all other Action parts read md)
├─ input/
│  ├─ color/  default·hover·focus·error·disabled·checked  × {bg·fg·border·placeholder-fg}
│  └─ measure/  sm·md  × {padding-x·padding-y·height·radius·border-width}
├─ surface/
│  ├─ color/   0·1·2·3  × {default·striped}  × {bg·border·shadow}
│  └─ measure/  {padding·radius·border-width}
├─ type/
│  ├─ color/    display·heading·body·label·caption  × {fg}
│  ├─ measure/  {role}/[{step 1·2·3}]  × {size·line-height·letter-spacing}
│  │              (step omitted/2 = role default; 1 smallest, 3 largest)
│  └─ other/    {role}  × {font-family·weight}
├─ icon/
│  └─ color/    default·secondary·accent  × {fg}
│               (no measure — size inherits or comes from a component prop)
├─ divider/
│  ├─ color/    {border}
│  └─ measure/  thin·medium·thick  × {thickness}
├─ feedback/
│  ├─ color/    danger·warning·success·info  × {bg·fg·border·icon-fg}
│  └─ measure/  {padding·radius·gap·border-width}
├─ overlay/
│  └─ color/    {bg}
└─ focus/
   ├─ color/    {stroke}
   └─ measure/  {stroke-width}
```

Sample values (default drivers, light ground):

```
action/color/primary/default/bg ── oklch(52% 0.18 250)     = prim color/primary/600
action/color/primary/hover/bg ─── oklch(46% 0.18 250)      = prim color/primary/700
action/color/primary/default/fg ─ oklch(98% 0.01 250)      = prim color/neutral/50
action/measure/md/padding-x ───── 16px
action/measure/md/radius ──────── 8px                      = prim radius/base (via map)
input/color/error/border ──────── oklch(55% 0.20 25)       = prim color/danger/600
surface/color/0/default/bg ────── oklch(98% 0.01 250)
surface/color/1/default/bg ────── oklch(100% 0 0)
type/measure/heading/size ─────── 28px
type/other/heading/font-family ── "Source Serif 4", serif
divider/color/border ──────────── oklch(90% 0.02 250)
overlay/color/bg ──────────────── oklch(0% 0 0 / 0.5)
focus/color/stroke ────────────── oklch(52% 0.18 250)
```

---

## Layer 5 — Context delta (`data-context="on-primary"`)

Same sym names, redefined inside the subtree. Only the changed subset is emitted:

```
[data-context="on-primary"]        (delta from :root)
├─ action/color/primary/default/{bg,fg}   ← swapped (white bg, primary fg)
├─ surface/color/0/default/{bg,border}
├─ type/color/{heading,body}/fg
├─ icon/color/default/fg
├─ divider/color/border
└─ focus/color/stroke
```

---

## Reading the stack end to end

```
driver color.primary #0069ca
  → ref  hds/prim/color/primary/600  = oklch(52% 0.18 250)
  → map  action primary bg → primary/600
  → sym  --hds-sem-action-color-primary-default-bg
  → component  Button { background: var(--hds-sem-action-color-primary-default-bg) }
```

Swap `color.primary` and only the ref values change; map and sym names, component CSS untouched.
