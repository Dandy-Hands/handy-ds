import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { part } from './part.ts';
import './base.css';
import './action.css';
import './control.css';
import './Button.css';
import './Separator.css';
import './Toggle.css';

const tertiary = { 'data-priority': 'tertiary' };

/** Buttons and links: Action tertiary. Input: Input/Field (sm). Separator: Divider. */
export const Toolbar = {
  ...BaseToolbar,
  Root: part(BaseToolbar.Root, 'hds-toggle-group'),
  Group: part(BaseToolbar.Group, 'hds-toggle-group'),
  Button: part(BaseToolbar.Button, 'hds-button hds-action', tertiary),
  Link: part(BaseToolbar.Link, 'hds-button hds-action', tertiary),
  Input: part(BaseToolbar.Input, 'hds-control', { 'data-size': 'sm' }),
  Separator: part(BaseToolbar.Separator, 'hds-separator'),
};
