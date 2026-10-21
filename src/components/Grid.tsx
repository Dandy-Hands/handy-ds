import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Grid.css';
import { responsive, spaceValue, widthValue, type Responsive, type Space, type Width } from './responsive.ts';

export type GridCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';

export interface GridProps extends Omit<useRender.ComponentProps<'div'>, 'style'> {
  /** Number of equal columns. Absent: as many columns as fit, each at least `minColWidth`. */
  cols?: Responsive<GridCount>;
  /** Smallest column width. Used only when `cols` is absent. */
  minColWidth?: Width;
  /** Space between rows and columns. */
  gap?: Responsive<Space>;
  /** `align-items`. */
  align?: GridAlign;
  /** `justify-items`. */
  justify?: GridAlign;
}

export interface GridItemProps extends Omit<useRender.ComponentProps<'div'>, 'style'> {
  /** Columns covered. A value larger than the grid `cols` is reduced to `cols`. */
  colSpan?: Responsive<GridCount>;
  rowSpan?: Responsive<GridCount>;
  /** Column line where the item starts. */
  colStart?: Responsive<GridCount>;
  rowStart?: Responsive<GridCount>;
  /** `align-self`. Absent: the Grid `align`. */
  align?: Responsive<GridAlign>;
  /** `justify-self`. Absent: the Grid `justify`. */
  justify?: Responsive<GridAlign>;
}

const base = <T,>(v: Responsive<T>): T => (typeof v === 'object' && v !== null ? (v as { base: T }).base : (v as T));

/** Layout category. CSS grid with typed props. No Base UI primitive; `render` swaps the element. */
function GridRoot({ cols, minColWidth = '8000', gap = '400', align = 'stretch', justify = 'stretch', render, ...props }: GridProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'hds-grid',
        'data-cols': cols === undefined ? undefined : base(cols),
        'data-gap': base(gap),
        'data-align': align,
        'data-justify': justify,
        style: {
          ...(cols === undefined ? { '--_min': widthValue(minColWidth) } : responsive('cols', cols)),
          ...responsive('gap', gap, spaceValue),
        },
      } as object,
      props,
    ),
  });
}

/** One grid item. Every prop is responsive. Sets all its custom properties so a nested Grid.Item does not inherit them. */
function GridItem({ colSpan = 1, rowSpan = 1, colStart, rowStart, align, justify, render, ...props }: GridItemProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'hds-grid-item',
        'data-col-span': base(colSpan),
        'data-row-span': base(rowSpan),
        'data-col-start': colStart === undefined ? undefined : base(colStart),
        'data-row-start': rowStart === undefined ? undefined : base(rowStart),
        'data-align': align === undefined ? undefined : base(align),
        'data-justify': justify === undefined ? undefined : base(justify),
        style: {
          ...responsive('col-span', colSpan),
          ...responsive('row-span', rowSpan),
          ...responsive<GridCount | 'auto'>('col-start', colStart ?? 'auto'),
          ...responsive<GridCount | 'auto'>('row-start', rowStart ?? 'auto'),
          ...responsive<GridAlign | 'auto'>('self-align', align ?? 'auto'),
          ...responsive<GridAlign | 'auto'>('self-justify', justify ?? 'auto'),
        },
      } as object,
      props,
    ),
  });
}

export const Grid = Object.assign(GridRoot, { Item: GridItem });
