// Base UI @base-ui/react 1.8.0 — no text primitive; useRender + mergeProps.
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import './base.css';
import './Text.css';

/** Typography role. */
export type TextVariant = 'display' | 'headline' | 'body' | 'label' | 'caption';

/** Font size step inside the role: typography/{role}/size/{size}. */
export type TextSize = 'sm' | 'md' | 'lg';

/** Content tones plus Feedback tones. Unset uses the role's color. */
export type TextTone = 'strong' | 'default' | 'muted' | 'accent' | 'danger' | 'warning' | 'success' | 'info';

const TAG = { display: 'h1', headline: 'h2', body: 'p', label: 'span', caption: 'small' } as const;

export interface TextProps extends Omit<useRender.ComponentProps<'p'>, 'style'> {
  variant?: TextVariant;
  size?: TextSize;
  tone?: TextTone;
  /** Cut the text after this many lines with an ellipsis. Cut text shows the full text on hover. */
  maxLines?: number;
}

/**
 * Applies one typography role. The element defaults by role (display h1, headline h2, body p,
 * label span, caption small); pick the right heading level with `render={<h3 />}`.
 */
export function Text({ variant = 'body', size = 'md', tone, maxLines, render, ref, title, ...props }: TextProps) {
  const own = useRef<HTMLElement>(null);
  const [cutText, setCutText] = useState<string>();

  // ponytail: native title on cut text; swap for Tooltip after the Tooltip spec.
  useLayoutEffect(() => {
    const el = own.current;
    if (!el || maxLines === undefined) return setCutText(undefined);
    const check = () => setCutText(el.scrollHeight > el.clientHeight + 1 ? el.textContent ?? undefined : undefined);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [maxLines, props.children]);

  return useRender({
    defaultTagName: TAG[variant],
    render,
    ref: [ref, own] as never,
    props: mergeProps<'p'>(
      {
        className: 'hds-text',
        'data-variant': variant,
        'data-size': size,
        'data-tone': tone,
        'data-max-lines': maxLines,
        style: maxLines === undefined ? undefined : ({ '--_max-lines': maxLines } as CSSProperties),
        title: title ?? cutText,
      } as object,
      props,
    ),
  });
}
