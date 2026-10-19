// Spec: docs/component-specs/search-input/spec.md
import { useRef, useState, type Ref } from 'react';
import { Icon } from './Icon.tsx';
import { Input, type InputProps, type InputSize } from './Input.tsx';
import './SearchInput.css';

/** Control height: a `measure/size` step. */
export type SearchInputSize = InputSize;
export type SearchInputProps = Omit<InputProps, 'type' | 'start' | 'end'>;
type KeyDownEvent = Parameters<NonNullable<SearchInputProps['onKeyDown']>>[0];

/** Search field with a search icon and a clear button. `Escape` clears the text. */
export function SearchInput({
  inputMode = 'search',
  enterKeyHint = 'search',
  autoComplete = 'off',
  autoCapitalize = 'off',
  spellCheck = false,
  className,
  ref,
  value,
  defaultValue,
  onValueChange,
  onKeyDown,
  ...props
}: SearchInputProps) {
  const input = useRef<HTMLInputElement | null>(null);
  const setRef: Ref<HTMLInputElement> = (el) => {
    input.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };
  // Tracks the text for an uncontrolled field; a controlled field reads `value`.
  const [typed, setTyped] = useState(String(defaultValue ?? ''));
  const text = value !== undefined ? String(value) : typed;

  // Clears through a native input event, so a controlled and an uncontrolled field both run onValueChange.
  const clear = () => {
    const el = input.current;
    if (!el || el.value === '') return;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const keyDown = (e: KeyDownEvent) => {
    onKeyDown?.(e);
    if (e.key === 'Escape' && !e.defaultPrevented && text !== '') {
      e.preventDefault();
      e.stopPropagation();
      clear();
    }
  };
  const canClear = text !== '' && !props.disabled && !props.readOnly;

  return (
    <Input
      inputMode={inputMode}
      enterKeyHint={enterKeyHint}
      autoComplete={autoComplete}
      autoCapitalize={autoCapitalize}
      spellCheck={spellCheck}
      {...props}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v, details) => {
        setTyped(v);
        onValueChange?.(v, details);
      }}
      onKeyDown={keyDown}
      ref={setRef}
      type="search"
      className={className ? `hds-search-input ${className}` : 'hds-search-input'}
      start={<Icon>search</Icon>}
      end={
        canClear ? (
          <button
            type="button"
            className="hds-control__button hds-search-input__clear"
            aria-label="Clear search"
            // Keeps focus in the input on a pointer press.
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => {
              clear();
              input.current?.focus();
            }}
          >
            <Icon>close</Icon>
          </button>
        ) : undefined
      }
    />
  );
}
