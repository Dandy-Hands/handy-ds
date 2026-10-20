// Spec: docs/component-specs/url-input/spec.md
import { Icon } from './Icon.tsx';
import { Input, type InputProps, type InputSize } from './Input.tsx';

/** Control height: a `measure/size` step. */
export type UrlInputSize = InputSize;
export type UrlInputProps = Omit<InputProps, 'type' | 'start' | 'multiple'>;

const hasScheme = /^[a-z][a-z\d+.-]*:/i;

/** URL field with a link icon. On blur, adds `https://` when the text has no scheme. Accepts `http` and `https` only. */
export function UrlInput({
  inputMode = 'url',
  autoComplete = 'url',
  autoCapitalize = 'off',
  spellCheck = false,
  pattern = 'https?://\\S+',
  onBlur,
  ...props
}: UrlInputProps) {
  return (
    <Input
      inputMode={inputMode}
      autoComplete={autoComplete}
      autoCapitalize={autoCapitalize}
      spellCheck={spellCheck}
      pattern={pattern}
      {...props}
      onBlur={(e) => {
        onBlur?.(e);
        const el = e.currentTarget;
        if (props.readOnly || el.value === '' || hasScheme.test(el.value)) return;
        // Sets the value through a native input event, so a controlled and an uncontrolled field both run onValueChange.
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(el, `https://${el.value}`);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }}
      type="url"
      start={<Icon>link</Icon>}
    />
  );
}
