// Spec: docs/component-specs/input/spec.md
import { Input, type InputProps, type InputSize } from './Input.tsx';

/** Control height: a `measure/size` step. */
export type TextInputSize = InputSize;
export type TextInputProps = Omit<InputProps, 'type'>;

/** Single-line free-text field, themed by `hds/sem/color/field/*`. Always `type="text"`. */
export function TextInput(props: TextInputProps) {
  return <Input {...props} type="text" />;
}
