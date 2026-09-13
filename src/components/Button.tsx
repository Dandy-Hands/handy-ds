import { Button as BaseButton } from '@base-ui/react/button';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { ComponentProps } from 'react';
import { cx } from './part.ts';
import './base.css';
import './action.css';
import './Button.css';

/** Action category priority axis (token spec section 4). */
export type Priority = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends ComponentProps<typeof BaseButton> {
  priority?: Priority;
}

/** Base UI Button, themed by `hds/sem/action/*`. */
export function Button({ priority = 'primary', className, ...props }: ButtonProps) {
  return <BaseButton data-priority={priority} {...props} className={cx('hds-button hds-action', className)} />;
}

export interface LinkButtonProps extends useRender.ComponentProps<'a'> {
  priority?: Priority;
}

/** An `<a>` that looks like a Button. Use for navigation; Base UI forbids links rendered as buttons. */
export function LinkButton({ priority = 'primary', render, ...props }: LinkButtonProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>({ className: 'hds-button hds-action', 'data-priority': priority } as object, props),
  });
}
