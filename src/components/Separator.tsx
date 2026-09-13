import { Separator as BaseSeparator } from '@base-ui/react/separator';
import type { ComponentProps } from 'react';
import { cx } from './part.ts';
import './Separator.css';

/** Divider category weight axis. */
export type Weight = 'thin' | 'medium' | 'thick';

export interface SeparatorProps extends ComponentProps<typeof BaseSeparator> {
  weight?: Weight;
}

/** Divider category. `orientation="vertical"` for inline separators. */
export function Separator({ weight = 'thin', className, ...props }: SeparatorProps) {
  return <BaseSeparator data-weight={weight} {...props} className={cx('hds-separator', className)} />;
}
