// No Base UI primitive: `useRender` + `mergeProps` from @base-ui/react 1.8.0. Spec: docs/component-specs/link-button/spec.md
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { ButtonSize, ButtonWidth } from './Button.tsx';
import './base.css';
import './action.css';
import './Button.css';

export interface LinkButtonProps extends Omit<useRender.ComponentProps<'a'>, 'className' | 'style'> {
  size?: ButtonSize;
  width?: ButtonWidth;
}

/** An `<a>` with the Button `primary` look. Use for navigation; Base UI forbids links rendered as buttons. */
export function LinkButton({ size = '1000', width = 'auto', render, ...props }: LinkButtonProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      { 'data-variant': 'primary', 'data-size': size, 'data-width': width } as object,
      props,
      { className: 'hds-button hds-action' },
    ),
  });
}
