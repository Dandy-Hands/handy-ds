import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import type { ReactNode } from 'react';
import './base.css';
import './Feedback.css';

/** Feedback category sentiment axis. */
export type Sentiment = 'danger' | 'warning' | 'success' | 'info';

export interface AlertProps extends useRender.ComponentProps<'div'> {
  sentiment?: Sentiment;
  heading?: ReactNode;
  icon?: ReactNode;
}

/**
 * Static alert/banner. No live-region role by default: pass `role="alert"` (urgent) or
 * `role="status"` (polite) when it appears in response to an action.
 */
export function Alert({ sentiment = 'info', heading, icon, children, render, ...props }: AlertProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(
      {
        className: 'hds-feedback hds-alert',
        'data-sentiment': sentiment,
        children: (
          <>
            {icon && <span className="hds-feedback__icon">{icon}</span>}
            <div className="hds-alert__body">
              {heading && <p className="hds-feedback__heading">{heading}</p>}
              {children}
            </div>
          </>
        ),
      } as object,
      props,
    ),
  });
}
