// Built against @base-ui/react 1.8.0 (no card primitive; useRender + mergeProps). Spec: docs/component-specs/card/spec.md
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './surface.css';
import './Card.css';
import { responsive, spaceValue, type Responsive } from './responsive.ts';

export type Elevation = 'base' | 'raised' | 'floating' | 'modal';
export type CardPadding = 'none' | '200' | '300' | '400' | '600' | '800' | '1000' | '1200';

export interface CardProps extends Omit<useRender.ComponentProps<'div'>, 'style'> {
  /** Surface level. `base` is the flat, outlined card. */
  elevation?: Elevation;
  /** Space between the edge and the content. */
  padding?: Responsive<CardPadding>;
}

/**
 * Surface category container. No Base UI primitive; `render` swaps the element (e.g. `<article />`).
 * A link or button element (`render={<a href="…" />}`) gets the hover border from Card.css.
 */
export function Card({ elevation = 'raised', padding = '600', render, ...props }: CardProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'hds-surface hds-card',
        'data-elevation': elevation,
        'data-padding': typeof padding === 'object' ? padding.base : padding,
        style: responsive('padding', padding, spaceValue),
      } as object,
      props,
    ),
  });
}
