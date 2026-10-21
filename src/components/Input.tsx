// Base UI: @base-ui/react 1.8.0 (input). Internal base for TextInput and the typed inputs; not exported from index.ts.
// Spec: docs/component-specs/input/spec.md
import { Input as BaseInput } from '@base-ui/react/input';
import type { ComponentProps, PointerEvent, ReactNode, Ref } from 'react';
import { useRef } from 'react';
import './base.css';
import './control.css';
import './TextInput.css';

/** Control height: a `measure/size` step. */
export type InputSize = '800' | '1000' | '1200';
export type InputType = 'text' | 'email' | 'tel' | 'url' | 'search' | 'password';

export interface InputProps extends Omit<ComponentProps<typeof BaseInput>, 'type' | 'size' | 'style' | 'className'> {
  /** Omitted when `render` swaps the element for one without a type, such as a textarea. */
  type?: InputType;
  size?: InputSize;
  /** Content before the text, inside the frame. */
  start?: ReactNode;
  /** Content after the text, inside the frame. */
  end?: ReactNode;
  /** Class for the outer frame. */
  className?: string;
}

/** Frame, input, and start and end slots. Each public input sets `type` (or `render`) and its own defaults. */
export function Input({ size = '1000', start, end, className, ref, ...props }: InputProps) {
  const input = useRef<HTMLInputElement | null>(null);
  const setRef: Ref<HTMLInputElement> = (el) => {
    input.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };
  // A press on the frame or on plain slot content focuses the input; a button or link in a slot keeps its own press.
  const focusInput = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('input, button, a, [role="button"]')) return;
    e.preventDefault();
    input.current?.focus();
  };
  return (
    <div className={className ? `hds-control hds-text-input ${className}` : 'hds-control hds-text-input'} data-size={size} onPointerDown={focusInput}>
      {start != null && <span className="hds-text-input__start">{start}</span>}
      <BaseInput {...props} ref={setRef} className="hds-control__input" />
      {end != null && <span className="hds-text-input__end">{end}</span>}
    </div>
  );
}
