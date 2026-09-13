import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { part } from './part.ts';
import './base.css';
import './action.css';
import './Button.css';
import './Toggle.css';

/** Two-state button: Action (secondary by default), `selected` when pressed. Set `data-priority` to change. */
export const Toggle = part(BaseToggle, 'hds-button hds-action');

/** Row of Toggles; single or `multiple` selection. */
export const ToggleGroup = part(BaseToggleGroup, 'hds-toggle-group');
