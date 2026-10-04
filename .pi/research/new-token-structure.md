# Proposed token structure

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
│  └─ 050, 100, 200, 300, 400, 600, 800, 1000, 1200, 1600, 2000, 2400 ← n / 100 × 4px × density
├─ size/
│  └─ 200, 300, 400, 600, 800, 1000, 1200, 1600, 2000, 2400        ← n / 100 × 4px × density
├─ radius/
│  └─ none, sm, base, lg, xl, full               ← 0 ,  ½r ,  r ,  1½r ,  2r ,  ∞
├─ border/
│  └─ none, thin, medium, thick                ← 0/1/2/4px spine (constant, not driver-derived)
├─ type/
│  ├─ scale/    1, 2, 3, 4, 5, 6, 7, 8, 9           ← baseSize × ratio^(n−3); 3 = body
│  ├─ leading/  tight·snug·normal·relaxed   ← 1.1 · 1.25 · 1.5 · 1.65
│  ├─ tracking/ tight·normal·wide           ← −0.02em · 0 · 0.02em
│  ├─ weight/   regular·medium·semibold·bold ← 400/500/600/700
│  └─ family/   heading·body                ← copied verbatim from drivers
└─ shadow/
   └─ level-0·level-1·level-2·level-3       ← strength-scaled y/blur/alpha triples
```

---

## Layer 3 — Sym (`hds/sem/*`) — application by category

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