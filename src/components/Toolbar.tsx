import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { part } from './part.ts';
import './base.css';
import './action.css';
import './control.css';
import './Button.css';
import './Separator.css';
import './Toolbar.css';

const tertiary = { 'data-priority': 'tertiary' };

/** Buttons and links: Action tertiary. Input: Input/Field (size 800). Separator: Divider. */
export const Toolbar = {
  ...BaseToolbar,
  Root: part(BaseToolbar.Root, 'hds-toolbar'),
  Group: part(BaseToolbar.Group, 'hds-toolbar__group'),
  Button: part(BaseToolbar.Button, 'hds-button hds-action', tertiary),
  Link: part(BaseToolbar.Link, 'hds-button hds-action', tertiary),
  Input: part(BaseToolbar.Input, 'hds-control', { 'data-size': '800' }),
  Separator: part(BaseToolbar.Separator, 'hds-separator'),
};
