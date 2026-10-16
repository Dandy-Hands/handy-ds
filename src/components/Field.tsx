import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { Form as BaseForm } from '@base-ui/react/form';
import { part } from './part.ts';
import './base.css';
import './control.css';
import './Field.css';

/** Label, control, description and error for one form value. Size a control with `data-size` (`800`, `1000`, `1200`). */
export const Field = {
  ...BaseField,
  Root: part(BaseField.Root, 'hds-field'),
  Label: part(BaseField.Label, 'hds-field__label'),
  Control: part(BaseField.Control, 'hds-control', { 'data-size': '1000' }),
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
