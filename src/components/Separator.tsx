// Base UI @base-ui/react 1.8.0 — wraps @base-ui/react/separator.
import { Separator as BaseSeparator } from '@base-ui/react/separator';
import './base.css';
import './Separator.css';

/** Graphic divider tone: color/graphic/divider/{tone}. */
export type SeparatorTone = 'default' | 'strong';

/** Minimal by spec: no className, render, style, ref, or native props. */
export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  tone?: SeparatorTone;
}

/** Group boundary line. Always role="separator". */
export function Separator({ orientation = 'horizontal', tone = 'default' }: SeparatorProps) {
  return <BaseSeparator orientation={orientation} data-tone={tone} className="hds-separator" />;
}
