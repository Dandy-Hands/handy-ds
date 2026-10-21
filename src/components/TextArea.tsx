// Spec: docs/component-specs/text-area/spec.md
import { useLayoutEffect, useRef, type Ref } from 'react';
import { Input, type InputProps, type InputSize } from './Input.tsx';
import './TextArea.css';

/** Control size: a `measure/size` step. Sets padding, type size, and the height of one row. */
export type TextAreaSize = InputSize;
export type TextAreaProps = Omit<InputProps, 'type' | 'start' | 'end' | 'render' | 'ref'> & {
  ref?: Ref<HTMLTextAreaElement>;
  /** Rows shown before any growth. */
  rows?: number;
  wrap?: 'soft' | 'hard' | 'off';
  /** The height follows the text, from `rows` up to `maxRows`. The drag handle is off. */
  autoGrow?: boolean;
  /** With `autoGrow`, the most rows the field shows before it scrolls. No limit by default. */
  maxRows?: number;
};

/** Multi-line text field. The user drags the bottom edge to resize, or `autoGrow` fits the height to the text. */
export function TextArea({ rows = 3, wrap, autoGrow = false, maxRows, ref, onValueChange, className, ...props }: TextAreaProps) {
  const area = useRef<HTMLTextAreaElement | null>(null);
  const setRef: Ref<HTMLTextAreaElement> = (el) => {
    area.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  // Resets to `rows`, then sets the height to the text, capped at `maxRows`. The field has no padding of its own, so scrollHeight is the text height.
  const fit = () => {
    const el = area.current;
    if (!el || !autoGrow) return;
    el.style.height = 'auto';
    const max = maxRows ? parseFloat(getComputedStyle(el).lineHeight) * maxRows : Infinity;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  };
  // Runs on every render, so a controlled value, `rows`, and `maxRows` all refit.
  useLayoutEffect(fit);
  // A width change rewraps the text.
  useLayoutEffect(() => {
    const el = area.current;
    if (!el || !autoGrow) return;
    let width = el.clientWidth;
    const watch = new ResizeObserver(() => {
      if (el.clientWidth !== width) {
        width = el.clientWidth;
        fit();
      }
    });
    watch.observe(el);
    return () => {
      watch.disconnect();
      el.style.height = '';
      el.style.overflowY = '';
    };
  }, [autoGrow, maxRows]);

  return (
    <Input
      {...props}
      // `rows` and `wrap` are textarea attributes that InputProps does not list.
      {...({ rows, wrap, 'data-auto-grow': autoGrow || undefined } as object)}
      render={<textarea />}
      ref={setRef as Ref<HTMLInputElement>}
      // An uncontrolled field does not render on input, so it refits here.
      onValueChange={(value, details) => {
        onValueChange?.(value, details);
        fit();
      }}
      className={className ? `hds-text-area ${className}` : 'hds-text-area'}
    />
  );
}
