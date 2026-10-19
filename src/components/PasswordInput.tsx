// Spec: docs/component-specs/password-input/spec.md
import { useState } from 'react';
import { Icon } from './Icon.tsx';
import { Input, type InputProps, type InputSize } from './Input.tsx';
import './PasswordInput.css';

/** Control height: a `measure/size` step. */
export type PasswordInputSize = InputSize;
export type PasswordInputProps = Omit<InputProps, 'type' | 'end'>;

/** Password field with a show/hide button. Starts hidden. Pass `autoComplete="new-password"` for a new password. */
export function PasswordInput({
  autoComplete = 'current-password',
  autoCapitalize = 'off',
  spellCheck = false,
  ...props
}: PasswordInputProps) {
  const [shown, setShown] = useState(false);
  return (
    <Input
      autoComplete={autoComplete}
      autoCapitalize={autoCapitalize}
      spellCheck={spellCheck}
      {...props}
      type={shown ? 'text' : 'password'}
      end={
        <button
          type="button"
          className="hds-control__button hds-password-input__toggle"
          aria-label="Show password"
          aria-pressed={shown}
          disabled={props.disabled}
          // Keeps focus in the input on a pointer press.
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => setShown((s) => !s)}
        >
          <Icon>{shown ? 'visibility_off' : 'visibility'}</Icon>
        </button>
      }
    />
  );
}
