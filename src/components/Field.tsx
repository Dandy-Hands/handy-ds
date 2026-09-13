import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { Form as BaseForm } from '@base-ui/react/form';
import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentProps } from 'react';
import { cx, part } from './part.ts';
import './base.css';
import './control.css';
import './Field.css';

/** Input/Field category size axis. */
export type Size = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<ComponentProps<typeof BaseInput>, 'size'> {
  size?: Size;
}

/** Text input, themed by `hds/sem/input/*`. Inside Field.Root prefer Field.Control (same look). */
export function Input({ size = 'md', className, ...props }: InputProps) {
  return <BaseInput data-size={size} {...props} className={cx('hds-control', className)} />;
}

/** Label, control, description and error for one form value. Size a control with `data-size`. */
export const Field = {
  ...BaseField,
  Root: part(BaseField.Root, 'hds-field'),
  Label: part(BaseField.Label, 'hds-field__label'),
  Control: part(BaseField.Control, 'hds-control', { 'data-size': 'md' }),
  Description: part(BaseField.Description, 'hds-field__description'),
  Error: part(BaseField.Error, 'hds-field__error'),
  Item: part(BaseField.Item, 'hds-field__item'),
};

export const Fieldset = {
  ...BaseFieldset,
  Root: part(BaseFieldset.Root, 'hds-fieldset'),
  Legend: part(BaseFieldset.Legend, 'hds-fieldset__legend'),
};

export const Form = part(BaseForm, 'hds-form');
