// Spec: docs/component-specs/email-input/spec.md
import { Icon } from './Icon.tsx';
import { Input, type InputProps, type InputSize } from './Input.tsx';

/** Control height: a `measure/size` step. */
export type EmailInputSize = InputSize;
export type EmailInputProps = Omit<InputProps, 'type' | 'start' | 'multiple'>;

/** Email field with a mail icon. Requires a dot in the domain; pass `pattern` to allow `user@intranet`. */
export function EmailInput({
  inputMode = 'email',
  autoComplete = 'email',
  autoCapitalize = 'off',
  spellCheck = false,
  pattern = '[^@\\s]+@[^@\\s]+\\.[^@\\s]+',
  ...props
}: EmailInputProps) {
  return (
    <Input
      inputMode={inputMode}
      autoComplete={autoComplete}
      autoCapitalize={autoCapitalize}
      spellCheck={spellCheck}
      pattern={pattern}
      {...props}
      type="email"
      start={<Icon>mail</Icon>}
    />
  );
}
