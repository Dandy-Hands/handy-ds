import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Text.css';

/** Type category role axis. */
export type TypeRole = 'display' | 'heading' | 'body' | 'label' | 'caption';

const TAG = { display: 'h1', heading: 'h2', body: 'p', label: 'span', caption: 'small' } as const;

export interface TextProps extends useRender.ComponentProps<'p'> {
  variant?: TypeRole;
}

/**
 * Applies one Type role. The element defaults by role (display h1, heading h2, body p,
 * label span, caption small); pick the right heading level with `render={<h3 />}`.
 */
export function Text({ variant = 'body', render, ...props }: TextProps) {
  return useRender({
    defaultTagName: TAG[variant],
    render,
    props: mergeProps<'p'>({ className: 'hds-text', 'data-variant': variant } as object, props),
  });
}
