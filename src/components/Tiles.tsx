import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Tiles.css';
import { responsive, spaceValue, widthValue, type Responsive, type Space, type Width } from './responsive.ts';

export interface TilesProps extends Omit<useRender.ComponentProps<'div'>, 'style'> {
  /** Space between tiles. */
  gap?: Responsive<Space>;
  /** The smallest width of one tile. A larger step gives fewer columns. */
  minTileWidth?: Width;
}

/** Layout category. Equal-size children in as many columns as fit. No Base UI primitive; `render` swaps the element. */
export function Tiles({ gap = '400', minTileWidth = '8000', render, ...props }: TilesProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'hds-tiles',
        'data-gap': typeof gap === 'object' ? gap.base : gap,
        'data-min-tile-width': minTileWidth,
        style: { ...responsive('gap', gap, spaceValue), '--_min': widthValue(minTileWidth) },
      } as object,
      props,
    ),
  });
}
