// Base UI: @base-ui/react 1.8.0 (button). Spec: docs/component-specs/button/spec.md
import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps } from 'react';
import './base.css';
import './action.css';
import './Button.css';

/** Action role and weight (API conventions section 6). */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
/** Control height: a `measure/size` step. */
export type ButtonSize = '800' | '1000' | '1200';
export type ButtonWidth = 'auto' | 'full';

export interface ButtonProps
  extends Omit<ComponentProps<typeof BaseButton>, 'className' | 'style' | 'nativeButton' | 'focusableWhenDisabled'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: ButtonWidth;
  loading?: boolean;
}

/** Base UI Button, themed by `hds/sem/color/action/*`. */
export function Button({
  variant = 'primary',
  size = '1000',
  width = 'auto',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      data-variant={variant}
      data-size={size}
      data-width={width}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
      className="hds-button hds-action"
    >
      {loading && <span className="hds-button__spinner" aria-hidden="true" />}
      {children}
    </BaseButton>
  );
}
