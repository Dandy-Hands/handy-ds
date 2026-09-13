import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './surface.css';
import './Card.css';

export type Elevation = 0 | 1 | 2 | 3;

export interface CardProps extends useRender.ComponentProps<'div'> {
  elevation?: Elevation;
}

/** Surface category container. No Base UI primitive; `render` swaps the element (e.g. `<article />`). */
export function Card({ elevation = 1, render, ...props }: CardProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>({ className: 'hds-surface hds-card', 'data-elevation': String(elevation) } as object, props),
  });
}
