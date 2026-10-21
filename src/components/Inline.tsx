import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Inline.css';
import { responsive, spaceValue, type Responsive, type Space } from './responsive.ts';

export type InlineAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type InlineJustify = 'start' | 'center' | 'end' | 'between';

export interface InlineProps extends Omit<useRender.ComponentProps<'div'>, 'style'> {
  /** Space between children, in the row and between lines. */
  gap?: Responsive<Space>;
  /** Cross-axis (vertical) position of the children in a line. */
  align?: InlineAlign;
  /** Main-axis (horizontal) distribution of the children in a line. */
  justify?: InlineJustify;
}

/** Layout category. One wrapping row with a token gap. No Base UI primitive; `render` swaps the element. */
export function Inline({ gap = '200', align = 'center', justify = 'start', render, ...props }: InlineProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'hds-inline',
        'data-gap': typeof gap === 'object' ? gap.base : gap,
        'data-align': align,
        'data-justify': justify,
        style: responsive('gap', gap, spaceValue),
      } as object,
      props,
    ),
  });
}
