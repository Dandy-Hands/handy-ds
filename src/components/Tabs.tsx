import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { part } from './part.ts';
import './base.css';
import './action.css';
import './Tabs.css';

/**
 * Tab triggers: Action tertiary, `selected` when active. Indicator: Action primary selected.
 * Panel: no category (token spec gap 5 decision) - transparent, inherits type and ground.
 */
export const Tabs = {
  ...BaseTabs,
  Root: part(BaseTabs.Root, 'hds-tabs'),
  List: part(BaseTabs.List, 'hds-tabs__list'),
  Tab: part(BaseTabs.Tab, 'hds-action hds-tabs__tab', { 'data-priority': 'tertiary' }),
  Indicator: part(BaseTabs.Indicator, 'hds-tabs__indicator'),
  Panel: part(BaseTabs.Panel, 'hds-tabs__panel'),
};
