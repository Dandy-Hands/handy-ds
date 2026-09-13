import { Popover as BasePopover } from '@base-ui/react/popover';
import { part } from './part.ts';
import './base.css';
import './action.css';
import './surface.css';
import './Button.css';
import './Popover.css';

/** Non-modal floating panel. Popup: Surface elevation 2. Trigger looks like a secondary Button. */
export const Popover = {
  ...BasePopover,
  Trigger: part(BasePopover.Trigger, 'hds-button hds-action'),
  Backdrop: part(BasePopover.Backdrop, 'hds-backdrop'),
  Positioner: part(BasePopover.Positioner, 'hds-positioner'),
  Popup: part(BasePopover.Popup, 'hds-surface hds-popup hds-popover', { 'data-elevation': '2' }),
  Title: part(BasePopover.Title, 'hds-popover__title'),
  Description: part(BasePopover.Description, 'hds-popover__description'),
  Close: part(BasePopover.Close, 'hds-button hds-action', { 'data-priority': 'tertiary' }),
};
