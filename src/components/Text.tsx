import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Text.css';

/** Type category role axis. */
export type TypeRole = 'display' | 'heading' | 'body' | 'label' | 'caption';

/** Per-role size step: 1 = smallest, 2 = role default (same as unset), 3 = largest. */
export type TextSize = 1 | 2 | 3;

const TAG = { display: 'h1', heading: 'h2', body: 'p', label: 'span', caption: 'small' } as const;

export interface TextProps extends useRender.ComponentProps<'p'> {
  variant?: TypeRole;
  size?: TextSize;
}

/**
 * Applies one Type role. The element defaults by role (display h1, heading h2, body p,
 * label span, caption small); pick the right heading level with `render={<h3 />}`.
 * `size` picks a step inside the role's band; steps pair across roles by theme design.
 */
export function Text({ variant = 'body', size, render, ...props }: TextProps) {
  return useRender({
    defaultTagName: TAG[variant],
    render,
    props: mergeProps<'p'>(
      {
        className: 'hds-text',
        'data-variant': variant,
        ...(size !== undefined ? { 'data-size': size } : null),
      } as object,
      props,
    ),
  });
}
