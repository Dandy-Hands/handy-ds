import { Select as BaseSelect } from '@base-ui/react/select';
import { part } from './part.ts';
import { CheckIcon, ChevronDownIcon } from './icons.tsx';
import './base.css';
import './action.css';
import './control.css';
import './surface.css';
import './Separator.css';
import './Select.css';

const tertiary = { 'data-priority': 'tertiary' };

/** Trigger: Input/Field. Popup: Surface (elevation 2). Items: Action tertiary (token spec section 9). */
export const Select = {
  ...BaseSelect,
  Label: part(BaseSelect.Label, 'hds-field__label'),
  Trigger: part(BaseSelect.Trigger, 'hds-control hds-select__trigger', { 'data-size': 'md' }),
  Icon: part(BaseSelect.Icon, 'hds-select__icon', { children: <ChevronDownIcon /> }),
  Positioner: part(BaseSelect.Positioner, 'hds-positioner'),
  Popup: part(BaseSelect.Popup, 'hds-surface hds-popup hds-list', { 'data-elevation': '2' }),
  List: part(BaseSelect.List, 'hds-list__items'),
  Item: part(BaseSelect.Item, 'hds-action hds-item', tertiary),
  ItemIndicator: part(BaseSelect.ItemIndicator, 'hds-item__indicator', { children: <CheckIcon /> }),
  GroupLabel: part(BaseSelect.GroupLabel, 'hds-list__label'),
  Separator: part(BaseSelect.Separator, 'hds-separator'),
  Backdrop: part(BaseSelect.Backdrop, 'hds-backdrop'),
};
