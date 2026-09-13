import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { part } from './part.ts';
import { CheckIcon, MinusIcon } from './icons.tsx';
import './base.css';
import './Checkbox.css';

/** Input/Field category, `checked` state (token spec gap 12). Label it with Field.Label or a <label>. */
export const Checkbox = {
  ...BaseCheckbox,
  Root: part(BaseCheckbox.Root, 'hds-checkbox'),
  Indicator: part(BaseCheckbox.Indicator, 'hds-checkbox__indicator', {
    children: [<CheckIcon key="c" className="hds-checkbox__check" />, <MinusIcon key="m" className="hds-checkbox__dash" />],
  }),
};

export const CheckboxGroup = part(BaseCheckboxGroup, 'hds-choice-group');
