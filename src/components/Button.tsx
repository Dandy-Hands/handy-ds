import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps, ReactNode } from 'react';
import type { Size } from './Field.tsx';
import { cx } from './part.ts';
import './base.css';
import './action.css';
import './Button.css';

/** Action category priority axis (token spec section 4). */
export type Priority = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends ComponentProps<typeof BaseButton> {
  priority?: Priority;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

/** Base UI Button, themed by `hds/sem/action/*`. */
export function Button({
  priority = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      data-priority={priority}
      data-size={size}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
      className={cx('hds-button hds-action' + (fullWidth ? ' hds-button--full' : ''), className)}
    >
      {loading && <span className="hds-button__spinner" aria-hidden="true" />}
      {children as ReactNode}
    </BaseButton>
  );
}
