import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { Size } from './Field.tsx';
import type { Priority } from './Button.tsx';
import './base.css';
import './action.css';
import './Button.css';

export interface LinkButtonProps extends useRender.ComponentProps<'a'> {
  priority?: Priority;
  size?: Size;
}

/** An `<a>` that looks like a Button. Use for navigation; Base UI forbids links rendered as buttons. */
export function LinkButton({ priority = 'primary', size = 'md', render, ...props }: LinkButtonProps) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: mergeProps<'a'>(
      { className: 'hds-button hds-action', 'data-priority': priority, 'data-size': size } as object,
      props,
    ),
  });
}
