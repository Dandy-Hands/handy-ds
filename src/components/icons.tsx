// Built-in glyphs for component parts (checkmarks, chevrons). Stroke follows currentColor.
import type { SVGProps } from 'react';

const icon = (d: string) => (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
    <path d={d} />
  </svg>
);

export const CheckIcon = icon('M3 8.5l3 3 7-7');
export const MinusIcon = icon('M3 8h10');
export const PlusIcon = icon('M8 3v10M3 8h10');
export const XIcon = icon('M4 4l8 8M12 4l-8 8');
export const ChevronDownIcon = icon('M4 6l4 4 4-4');
export const ChevronRightIcon = icon('M6 4l4 4-4 4');
