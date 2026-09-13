import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { part } from './part.ts';
import { CheckIcon, ChevronDownIcon, XIcon } from './icons.tsx';
import './base.css';
import './action.css';
import './control.css';
import './surface.css';
import './Separator.css';
import './Combobox.css';

const tertiary = { 'data-priority': 'tertiary' };

/** Input group: Input/Field. Popup: Surface. Options: Action tertiary (token spec section 9). */
export const Combobox = {
  ...BaseCombobox,
  Label: part(BaseCombobox.Label, 'hds-field__label'),
  InputGroup: part(BaseCombobox.InputGroup, 'hds-control', { 'data-size': 'md' }),
  Input: part(BaseCombobox.Input, 'hds-control__input'),
  Trigger: part(BaseCombobox.Trigger, 'hds-control__button', { children: <ChevronDownIcon /> }),
  Clear: part(BaseCombobox.Clear, 'hds-control__button', { children: <XIcon />, 'aria-label': 'Clear' }),
  Chips: part(BaseCombobox.Chips, 'hds-combobox__chips'),
  Chip: part(BaseCombobox.Chip, 'hds-action hds-combobox__chip'),
  ChipRemove: part(BaseCombobox.ChipRemove, 'hds-control__button', { children: <XIcon /> }),
  Positioner: part(BaseCombobox.Positioner, 'hds-positioner'),
  Popup: part(BaseCombobox.Popup, 'hds-surface hds-popup hds-list', { 'data-elevation': '2' }),
  List: part(BaseCombobox.List, 'hds-list__items'),
  Item: part(BaseCombobox.Item, 'hds-action hds-item', tertiary),
  ItemIndicator: part(BaseCombobox.ItemIndicator, 'hds-item__indicator', { children: <CheckIcon /> }),
  GroupLabel: part(BaseCombobox.GroupLabel, 'hds-list__label'),
  Separator: part(BaseCombobox.Separator, 'hds-separator'),
  Empty: part(BaseCombobox.Empty, 'hds-combobox__status'),
  Status: part(BaseCombobox.Status, 'hds-combobox__status'),
  Backdrop: part(BaseCombobox.Backdrop, 'hds-backdrop'),
};

/** Same parts and token sources as Combobox; free text input with suggestions. */
export const Autocomplete = {
  ...BaseAutocomplete,
  InputGroup: part(BaseAutocomplete.InputGroup, 'hds-control', { 'data-size': 'md' }),
  Input: part(BaseAutocomplete.Input, 'hds-control__input'),
  Trigger: part(BaseAutocomplete.Trigger, 'hds-control__button', { children: <ChevronDownIcon /> }),
  Clear: part(BaseAutocomplete.Clear, 'hds-control__button', { children: <XIcon />, 'aria-label': 'Clear' }),
  Positioner: part(BaseAutocomplete.Positioner, 'hds-positioner'),
  Popup: part(BaseAutocomplete.Popup, 'hds-surface hds-popup hds-list', { 'data-elevation': '2' }),
  List: part(BaseAutocomplete.List, 'hds-list__items'),
  Item: part(BaseAutocomplete.Item, 'hds-action hds-item', tertiary),
  GroupLabel: part(BaseAutocomplete.GroupLabel, 'hds-list__label'),
  Separator: part(BaseAutocomplete.Separator, 'hds-separator'),
  Empty: part(BaseAutocomplete.Empty, 'hds-combobox__status'),
  Status: part(BaseAutocomplete.Status, 'hds-combobox__status'),
  Backdrop: part(BaseAutocomplete.Backdrop, 'hds-backdrop'),
};
