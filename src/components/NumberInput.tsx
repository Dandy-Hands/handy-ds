// Base UI: @base-ui/react 1.8.0 (number-field).
// Spec: docs/component-specs/number-field/spec.md
import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import type { ComponentProps, PointerEvent, ReactNode } from 'react';
import { MinusIcon, PlusIcon } from './icons.tsx';
import './base.css';
import './control.css';
import './TextInput.css';
import './NumberInput.css';

/** Control height: a `measure/size` step. */
export type NumberInputSize = '800' | '1000' | '1200';

// Props that belong to `Root`. Every other prop goes to the `<input>`.
const ROOT_KEYS = [
  'value', 'defaultValue', 'onValueChange', 'onValueCommitted',
  'min', 'max', 'step', 'smallStep', 'largeStep', 'snapOnStep', 'allowOutOfRange',
  'format', 'locale', 'name', 'form', 'id', 'required', 'disabled', 'readOnly',
] as const;

type RootProps = Pick<BaseNumberField.Root.Props, (typeof ROOT_KEYS)[number]>;
type InputAttributes = Omit<ComponentProps<typeof BaseNumberField.Input>, keyof RootProps | 'type' | 'size' | 'style' | 'className' | 'render' | 'children'>;

export interface NumberInputProps extends RootProps, InputAttributes {
  size?: NumberInputSize;
  /** Shows the − button at the start edge and the + button at the end edge. */
  steppers?: boolean;
  /** Content before the number, inside the frame. */
  start?: ReactNode;
  /** Content after the number, inside the frame. */
  end?: ReactNode;
  /** Class for the outer frame. */
  className?: string;
}

// A press on the frame or on plain slot content focuses the input; a button or link keeps its own press.
const focusInput = (e: PointerEvent<HTMLDivElement>) => {
  const target = e.target as HTMLElement;
  if (target.closest('input, button, a, [role="button"]')) return;
  e.preventDefault();
  e.currentTarget.querySelector('input')?.focus();
};

/** Single-line number field, themed by `hds/sem/color/field/*`. Arrow keys step the value; `steppers` adds buttons. */
export function NumberInput({ size = '1000', steppers = false, start, end, className, ...props }: NumberInputProps) {
  const root: Record<string, unknown> = {};
  const input: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    ((ROOT_KEYS as readonly string[]).includes(key) ? root : input)[key] = value;
  }
  return (
    <BaseNumberField.Root {...root} className="hds-number-input">
      <BaseNumberField.Group
        className={className ? `hds-control hds-text-input ${className}` : 'hds-control hds-text-input'}
        data-size={size}
        data-steppers={steppers ? '' : undefined}
        onPointerDown={focusInput}
      >
        {steppers && (
          <BaseNumberField.Decrement className="hds-control__button hds-number-input__stepper" aria-label="Decrease">
            <MinusIcon />
          </BaseNumberField.Decrement>
        )}
        {start != null && <span className="hds-text-input__start">{start}</span>}
        <BaseNumberField.Input {...input} className="hds-control__input" />
        {end != null && <span className="hds-text-input__end">{end}</span>}
        {steppers && (
          <BaseNumberField.Increment className="hds-control__button hds-number-input__stepper" aria-label="Increase">
            <PlusIcon />
          </BaseNumberField.Increment>
        )}
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}
