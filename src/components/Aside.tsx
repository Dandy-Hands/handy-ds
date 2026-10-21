// Base UI @base-ui/react 1.8.0 (no primitive: useRender only)
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Aside.css';
import { responsive, spaceValue, widthValue, type Responsive, type Space, type Width } from './responsive.ts';

export type AsideSurface = 'sunken' | 'base' | 'raised' | 'primary' | 'secondary';

export interface AsideProps extends Omit<useRender.ComponentProps<'aside'>, 'style'> {
  /** Width of the column. */
  width?: Responsive<Width | 'full'>;
  /** The column stays in view while the page scrolls. */
  sticky?: boolean;
  /** Background color. Absent: transparent. `primary` and `secondary` set the brand context. */
  surface?: AsideSurface;
  paddingBlock?: Responsive<Space>;
  paddingInline?: Responsive<Space>;
}

const base = <T extends string>(v: Responsive<T>): T => (typeof v === 'object' ? v.base : v);

/** Page building category. A column of supporting content beside the main content. No Base UI primitive; `render` swaps the element. */
export function Aside({ width = '8000', sticky = false, surface, paddingBlock = '400', paddingInline = '400', render, ...props }: AsideProps) {
  return useRender({
    defaultTagName: 'aside',
    render,
    props: mergeProps<'aside'>(
      {
        className: 'hds-aside',
        'data-width': base(width),
        'data-surface': surface,
        'data-sticky': sticky ? '' : undefined,
        'data-context': surface === 'primary' ? 'on-primary' : surface === 'secondary' ? 'on-secondary' : undefined,
        style: {
          ...responsive('width', width, widthValue),
          ...responsive('padding-block', paddingBlock, spaceValue),
          ...responsive('padding-inline', paddingInline, spaceValue),
        },
      } as object,
      props,
    ),
  });
}
