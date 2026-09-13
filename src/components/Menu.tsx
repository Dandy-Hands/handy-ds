import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { part } from './part.ts';
import { CheckIcon, ChevronRightIcon } from './icons.tsx';
import './base.css';
import './action.css';
import './surface.css';
import './Button.css';
import './Separator.css';
import './Menu.css';

const tertiary = { 'data-priority': 'tertiary' };
const popup = { 'data-elevation': '2' };

/**
 * Items: Action tertiary. Popup: Surface (token spec section 9).
 * Trigger looks like a secondary Button; pass `data-priority` to change it
 * (use `data-priority="tertiary"` for triggers inside a Menubar).
 */
export const Menu = {
  ...BaseMenu,
  Trigger: part(BaseMenu.Trigger, 'hds-button hds-action'),
  Positioner: part(BaseMenu.Positioner, 'hds-positioner'),
  Popup: part(BaseMenu.Popup, 'hds-surface hds-popup hds-list', popup),
  Item: part(BaseMenu.Item, 'hds-action hds-item', tertiary),
  LinkItem: part(BaseMenu.LinkItem, 'hds-action hds-item', tertiary),
  SubmenuTrigger: part(BaseMenu.SubmenuTrigger, 'hds-action hds-item hds-menu__submenu', tertiary),
  CheckboxItem: part(BaseMenu.CheckboxItem, 'hds-action hds-item', tertiary),
  CheckboxItemIndicator: part(BaseMenu.CheckboxItemIndicator, 'hds-item__indicator', { children: <CheckIcon /> }),
  RadioItem: part(BaseMenu.RadioItem, 'hds-action hds-item', tertiary),
  RadioItemIndicator: part(BaseMenu.RadioItemIndicator, 'hds-item__indicator hds-menu__dot'),
  GroupLabel: part(BaseMenu.GroupLabel, 'hds-list__label'),
  Separator: part(BaseMenu.Separator, 'hds-separator'),
  Backdrop: part(BaseMenu.Backdrop, 'hds-backdrop'),
};

/** Menu opened by right-click / long-press on Trigger (an area, not a button). */
export const ContextMenu = {
  ...BaseContextMenu,
  Positioner: part(BaseContextMenu.Positioner, 'hds-positioner'),
  Popup: part(BaseContextMenu.Popup, 'hds-surface hds-popup hds-list', popup),
  Item: part(BaseContextMenu.Item, 'hds-action hds-item', tertiary),
  LinkItem: part(BaseContextMenu.LinkItem, 'hds-action hds-item', tertiary),
  SubmenuTrigger: part(BaseContextMenu.SubmenuTrigger, 'hds-action hds-item hds-menu__submenu', tertiary),
  CheckboxItem: part(BaseContextMenu.CheckboxItem, 'hds-action hds-item', tertiary),
  CheckboxItemIndicator: part(BaseContextMenu.CheckboxItemIndicator, 'hds-item__indicator', { children: <CheckIcon /> }),
  RadioItem: part(BaseContextMenu.RadioItem, 'hds-action hds-item', tertiary),
  RadioItemIndicator: part(BaseContextMenu.RadioItemIndicator, 'hds-item__indicator hds-menu__dot'),
  GroupLabel: part(BaseContextMenu.GroupLabel, 'hds-list__label'),
  Separator: part(BaseContextMenu.Separator, 'hds-separator'),
  Backdrop: part(BaseContextMenu.Backdrop, 'hds-backdrop'),
};

/** Row of Menu.Root children. Give each Menu.Trigger `data-priority="tertiary"`. */
export const Menubar = part(BaseMenubar, 'hds-menubar');
