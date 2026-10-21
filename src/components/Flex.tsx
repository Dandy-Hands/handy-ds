import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Flex.css';
import { responsive, spaceValue, widthValue, type Responsive, type Space, type Width } from './responsive.ts';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexBasis = Width | 'auto' | 'fit' | 'full';

export interface FlexProps extends Omit<useRender.ComponentProps<'div'>, 'style'> {
  /** Main axis. */
  direction?: Responsive<FlexDirection>;
  /** Space between children. */
  gap?: Responsive<Space>;
  /** Children move to the next line when the line is full. */
  wrap?: boolean;
  /** `align-items`. */
  align?: FlexAlign;
  /** `justify-content`. */
  justify?: FlexJustify;
}

export interface FlexItemProps extends Omit<useRender.ComponentProps<'div'>, 'style'> {
  /** The item takes the free space of the line. */
  grow?: boolean;
  /** The item may become narrower than its content when the line is full. */
  shrink?: boolean;
  /** Starting size on the main axis. */
  basis?: Responsive<FlexBasis>;
  /** `align-self`. Absent: the `align` of the Flex. */
  align?: FlexAlign;
}

const basisValue = (v: FlexBasis) => (v === 'auto' ? 'auto' : v === 'fit' ? 'fit-content' : widthValue(v));

/** Layout category. Flexbox container with a token gap and safe defaults (items wrap). No Base UI primitive. */
function FlexRoot({ direction = 'row', gap = '400', wrap = true, align = 'stretch', justify = 'start', render, ...props }: FlexProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'hds-flex',
        'data-direction': typeof direction === 'object' ? direction.base : direction,
        'data-gap': typeof gap === 'object' ? gap.base : gap,
        'data-wrap': wrap,
        'data-align': align,
        'data-justify': justify,
        style: { ...responsive('gap', gap, spaceValue), ...responsive('direction', direction) },
      } as object,
      props,
    ),
  });
}

/** One child of a Flex. Sets grow, shrink, basis, and its own cross-axis alignment. */
function FlexItem({ grow = false, shrink = true, basis = 'auto', align, render, ...props }: FlexItemProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'hds-flex-item',
        'data-grow': grow,
        'data-shrink': shrink,
        'data-basis': typeof basis === 'object' ? basis.base : basis,
        'data-align': align,
        style: responsive('basis', basis, basisValue),
      } as object,
      props,
    ),
  });
}

export const Flex = Object.assign(FlexRoot, { Item: FlexItem });
