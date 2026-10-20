// Spec: docs/component-specs/phone-input/spec.md
import { useLayoutEffect, useRef, useState, type Ref } from 'react';
import { Icon } from './Icon.tsx';
import { Input, type InputProps, type InputSize } from './Input.tsx';

/** Control height: a `measure/size` step. */
export type PhoneInputSize = InputSize;
/** Country that sets the mask. */
export type PhoneInputCountry = 'US';
export type PhoneInputProps = Omit<InputProps, 'type' | 'start' | 'multiple'> & {
  /** Sets the mask and the check. */
  country?: PhoneInputCountry;
};

// One entry per country: digit count, mask, the pattern that matches a complete masked number, and a placeholder that shows the format. The mask adds no trailing punctuation, so Backspace never stops on a symbol.
const COUNTRIES = {
  US: {
    length: 10,
    placeholder: '(555) 555-5555',
    pattern: '\\(\\d{3}\\) \\d{3}-\\d{4}',
    format: (d: string) =>
      d === '' ? '' : d.length <= 3 ? `(${d}` : d.length <= 6 ? `(${d.slice(0, 3)}) ${d.slice(3)}` : `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`,
  },
} satisfies Record<PhoneInputCountry, { length: number; placeholder: string; pattern: string; format: (digits: string) => string }>;

const digitsIn = (text: string) => text.replace(/\D/g, '');
const countDigits = (text: string) => digitsIn(text).length;

/** Phone field with a phone icon and a mask. The value is digits only; the text shown is masked. */
export function PhoneInput({
  country = 'US',
  inputMode = 'tel',
  autoComplete = 'tel-national',
  spellCheck = false,
  pattern,
  placeholder: placeholderProp,
  name,
  ref,
  value,
  defaultValue,
  onValueChange,
  ...props
}: PhoneInputProps) {
  const { length, placeholder, pattern: countryPattern, format } = COUNTRIES[country];
  // A paste such as "+1 202 555 0123" keeps the national digits only.
  const clean = (text: string) => {
    const d = digitsIn(text);
    return (d.length > length && d.startsWith('1') ? d.slice(1) : d).slice(0, length);
  };

  const input = useRef<HTMLInputElement | null>(null);
  const setRef: Ref<HTMLInputElement> = (el) => {
    input.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };
  // Tracks the digits for an uncontrolled field; a controlled field reads `value`.
  const [typed, setTyped] = useState(clean(String(defaultValue ?? '')));
  const digits = value !== undefined ? clean(String(value)) : typed;
  const shown = format(digits);

  // The caret follows the digit it was on, so an edit in the middle does not jump to the end.
  const caretDigits = useRef<number | null>(null);
  useLayoutEffect(() => {
    const el = input.current;
    if (el && caretDigits.current !== null && document.activeElement === el) {
      let seen = 0;
      let at = 0;
      while (at < shown.length && seen < caretDigits.current) if (/\d/.test(shown[at++])) seen++;
      el.setSelectionRange(at, at);
    }
    caretDigits.current = null;
  });

  return (
    <>
      <Input
        autoComplete={autoComplete}
        inputMode={inputMode}
        spellCheck={spellCheck}
        pattern={pattern ?? countryPattern}
        placeholder={placeholderProp ?? placeholder}
        {...props}
        value={shown}
        onValueChange={(text, details) => {
          const el = input.current;
          caretDigits.current = el && el.selectionStart !== null ? countDigits(text.slice(0, el.selectionStart)) : null;
          const next = clean(text);
          setTyped(next);
          if (next !== digits) onValueChange?.(next, details);
        }}
        ref={setRef}
        type="tel"
        start={<Icon>phone</Icon>}
      />
      {/* A native form posts the input text, which is masked. The hidden input posts the digits. */}
      {name != null && !props.disabled && <input type="hidden" name={name} value={digits} />}
    </>
  );
}
