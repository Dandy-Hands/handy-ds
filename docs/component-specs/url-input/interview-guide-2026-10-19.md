# UrlInput — Spec Interview Guide (2026-10-19)

New component. Built on the internal `Input` base (`src/components/Input.tsx`), like the other typed inputs.
Read `docs/component-specs/email-input/interview-guide-2026-10-19.md` first.

Base UI version documented from: `@base-ui/react` 1.8.0.

No interview was held. The user asked Claude to choose every decision and review them after the build (2026-10-19). Each answer below is a Claude call, open to review.

Facts:
- Base UI has no URL component. `UrlInput` is the `Input` base with `type="url"`.
- A native `type="url"` input requires a scheme, so `example.com` reports `validity.typeMismatch`. It accepts any scheme, such as `javascript:` and `ftp:`. It trims leading and trailing whitespace.
- Inside a `Field.Root`, Base UI validates on blur.

## Decisions (Claude calls)

- [x] Q1: Include now? Yes. The user asked for it (2026-10-19). Earlier it was undecided.
- [x] Q2: Slots. The link icon owns `start`. The caller keeps `end`. The props type is `TextInputProps` without `start`. Same as `EmailInput` and `PhoneInput`.
- [x] Q3: Missing scheme. On blur, the component adds `https://` when the text is not empty and has no scheme (`^[a-z][a-z\d+.-]*:`). It sets the value through a native `input` event, so a controlled and an uncontrolled field both run `onValueChange`. It does nothing when the field is read-only. Reason: users type `example.com`, and the native check would reject it. Rejected: no change (the user sees an error for a normal address); adding the scheme while the user types (the user fights the text). Limit: `localhost:3000` has a scheme-like start and stays as typed.
- [x] Q4: Which schemes? `http` and `https` only. The component sets `pattern="https?://\S+"`. A `javascript:` or `data:` value fails the pattern. Reason: a client app often puts the value in an `href`. A caller overrides `pattern` to allow another scheme. Rejected: native only (accepts `javascript:`).
- [x] Q5: No dot rule. `https://intranet` is valid. Unlike `EmailInput`, a missed dot in a URL is rare and a local address is common. Native `type="url"` and the pattern are the only checks.
- [x] Q6: Defaults. `type="url"`, `inputMode="url"`, `autoComplete="url"`, `autoCapitalize="off"`, `spellCheck={false}`, plus the Q4 `pattern`. A native attribute from the caller overrides each default except `type`. `multiple` is omitted.
- [x] Q7: Extension props and members. No new props. `size` and `end` from `TextInput`. Omitted: `start`, `type`, `multiple`, `style`. `className` goes to the frame.
- [x] Q8: Extras. No reachability check, no preview, no typo hint. The caller reads the value with `onValueChange`.

## Token mapping

Claude calls (token interview scope): reuses the `TextInput` mapping. No new tokens and no new CSS.

## Open items

- Field error text color (token spec section 9, item 4).
