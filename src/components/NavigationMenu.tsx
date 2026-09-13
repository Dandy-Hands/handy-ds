import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { part } from './part.ts';
import { ChevronDownIcon } from './icons.tsx';
import './base.css';
import './action.css';
import './surface.css';
import './Button.css';
import './NavigationMenu.css';

const tertiary = { 'data-priority': 'tertiary' };

/**
 * Site navigation. Triggers and links: Action tertiary (current page link = `selected`,
 * via Base UI's `active` prop). Popup: Surface elevation 2 (token spec section 9).
 */
export const NavigationMenu = {
  ...BaseNavigationMenu,
  Root: part(BaseNavigationMenu.Root, 'hds-nav'),
  List: part(BaseNavigationMenu.List, 'hds-nav__list'),
  Trigger: part(BaseNavigationMenu.Trigger, 'hds-button hds-action', tertiary),
  Icon: part(BaseNavigationMenu.Icon, 'hds-nav__icon', { children: <ChevronDownIcon /> }),
  Content: part(BaseNavigationMenu.Content, 'hds-nav__content'),
  Link: part(BaseNavigationMenu.Link, 'hds-button hds-action hds-nav__link', tertiary),
  Positioner: part(BaseNavigationMenu.Positioner, 'hds-positioner hds-nav__positioner'),
  Popup: part(BaseNavigationMenu.Popup, 'hds-surface hds-popup hds-nav__popup', { 'data-elevation': '2' }),
  Viewport: part(BaseNavigationMenu.Viewport, 'hds-nav__viewport'),
  Backdrop: part(BaseNavigationMenu.Backdrop, 'hds-backdrop'),
};
