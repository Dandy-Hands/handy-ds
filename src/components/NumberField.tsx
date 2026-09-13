import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { part } from './part.ts';
import { MinusIcon, PlusIcon } from './icons.tsx';
import './base.css';
import './control.css';

/** Input/Field category. Size the Group with `data-size`. */
export const NumberField = {
  ...BaseNumberField,
  Group: part(BaseNumberField.Group, 'hds-control', { 'data-size': 'md' }),
  Input: part(BaseNumberField.Input, 'hds-control__input'),
  Decrement: part(BaseNumberField.Decrement, 'hds-control__button', { children: <MinusIcon /> }),
  Increment: part(BaseNumberField.Increment, 'hds-control__button', { children: <PlusIcon /> }),
};
