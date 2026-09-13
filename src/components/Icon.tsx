import type { ComponentProps, CSSProperties } from 'react';
import './Icon.css';

/** Icon category role axis. */
export type IconRole = 'default' | 'secondary' | 'accent';

export interface IconProps extends ComponentProps<'span'> {
  /** Omit to inherit the surrounding text color (icons inside Buttons, Alerts...). */
  variant?: IconRole;
  /** CSS length. Defaults to the surrounding font size (token spec section 7). */
  size?: string;
  /** Accessible name. Omit for decorative icons (hidden from assistive tech). */
  label?: string;
}

/** Wraps any SVG icon (stroke/fill = currentColor) with an Icon role color and size. */
export function Icon({ variant, size, label, style, className, ...props }: IconProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-variant={variant}
      style={size ? ({ ...style, '--_size': size } as CSSProperties) : style}
      {...props}
      className={className ? `hds-icon ${className}` : 'hds-icon'}
    />
  );
}
