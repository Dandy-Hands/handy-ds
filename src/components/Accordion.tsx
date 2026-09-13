import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { part } from './part.ts';
import './base.css';
import './action.css';
import './Accordion.css';

/** Trigger: Action tertiary. Panel: Surface elevation 0. Item edges: Divider. */
export const Accordion = {
  ...BaseAccordion,
  Root: part(BaseAccordion.Root, 'hds-accordion'),
  Item: part(BaseAccordion.Item, 'hds-accordion__item'),
  Header: part(BaseAccordion.Header, 'hds-accordion__header'),
  Trigger: part(BaseAccordion.Trigger, 'hds-action hds-accordion__trigger', { 'data-priority': 'tertiary' }),
  Panel: part(BaseAccordion.Panel, 'hds-accordion__panel'),
};
