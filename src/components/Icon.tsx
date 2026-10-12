// Base UI @base-ui/react 1.8.0 — no icon primitive; plain span wrapper.
import type { ComponentProps, ReactElement } from 'react';
import './Icon.css';

/** Content tones plus Feedback tones. Unset inherits the surrounding text color. */
export type IconTone = 'strong' | 'default' | 'muted' | 'accent' | 'danger' | 'warning' | 'success' | 'info';

/** measure/size steps. Unset uses the surrounding font size. */
export type IconSize = '400' | '500' | '600' | '800' | '1000' | '1200' | '1600' | '2400' | '3200';

export interface IconProps extends Omit<ComponentProps<'span'>, 'style' | 'children'> {
  tone?: IconTone;
  size?: IconSize;
  /** Glyph names only: draw filled instead of outlined. Ignored for SVG children. */
  fill?: boolean;
  /** Accessible name. Omit for a decorative icon (hidden from assistive tech). */
  label?: string;
  /** An SVG element (stroke/fill = currentColor) or a Material Symbols glyph name. The client loads the font. */
  children: ReactElement | string;
}

export function Icon({ tone, size, fill = false, label, className, children, ...props }: IconProps) {
  const glyph = typeof children === 'string';
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-tone={tone}
      data-size={size}
      data-glyph={glyph ? '' : undefined}
      data-fill={glyph && fill ? '' : undefined}
      {...props}
      className={className ? `hds-icon ${className}` : 'hds-icon'}
    >
      {children}
    </span>
  );
}
