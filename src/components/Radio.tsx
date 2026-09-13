import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { part } from './part.ts';
import './base.css';
import './Checkbox.css';

/** Input/Field category, `checked` state. Always inside a RadioGroup. */
export const Radio = {
  ...BaseRadio,
  Root: part(BaseRadio.Root, 'hds-radio'),
  Indicator: part(BaseRadio.Indicator, 'hds-radio__indicator'),
};

export const RadioGroup = part(BaseRadioGroup, 'hds-choice-group');
