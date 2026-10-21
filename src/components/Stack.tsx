import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Stack.css';
import { responsive, spaceValue, type Responsive, type Space } from './responsive.ts';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

export interface StackProps extends Omit<useRender.ComponentProps<'div'>, 'style'> {
  /** Space between children. */
  gap?: Responsive<Space>;
  align?: StackAlign;
}

/** Layout category. One column with a token gap. No Base UI primitive; `render` swaps the element (e.g. `<ul />`). */
export function Stack({ gap = '400', align = 'stretch', render, ...props }: StackProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'hds-stack',
        'data-gap': typeof gap === 'object' ? gap.base : gap,
        'data-align': align,
        style: responsive('gap', gap, spaceValue),
      } as object,
      props,
    ),
  });
}
