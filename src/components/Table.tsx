import type { ComponentProps } from 'react';
import './base.css';
import './Table.css';

export interface TableProps extends ComponentProps<'table'> {
  /** Alternate row backgrounds (Surface `striped` state). */
  striped?: boolean;
}

/**
 * Data Table (token spec section 9). Write native thead/tbody/tr/th/td inside. For a
 * sortable column put a <button> in the <th> and set `aria-sort` on the <th>.
 * Wrap in `<div style={{ overflowX: 'auto' }}>` when it may overflow.
 */
export function Table({ striped, className, ...props }: TableProps) {
  return <table data-striped={striped || undefined} {...props} className={className ? `hds-table ${className}` : 'hds-table'} />;
}
