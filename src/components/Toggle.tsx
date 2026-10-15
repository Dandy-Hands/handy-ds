// Base UI: @base-ui/react 1.8.0 (toggle-group, toggle). Spec: docs/component-specs/toggle/spec.md
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { cloneElement, createContext, useContext, type ComponentProps, type ReactElement } from 'react';
import './base.css';
import './action.css';
import './Button.css';
import './Toggle.css';

/** Look of a pressed `Toggle`. An idle button uses the next weaker look. */
export type ToggleVariant = 'primary' | 'secondary';
/** Button height: a `measure/size` step. */
export type ToggleSize = '800' | '1000' | '1200';

const idleVariant = { primary: 'secondary', secondary: 'tertiary' } as const;

const ToggleContext = createContext<{ variant: ToggleVariant; size: ToggleSize } | null>(null);

export interface ToggleGroupProps extends Omit<ComponentProps<typeof BaseToggleGroup>, 'className' | 'style' | 'loopFocus'> {
  variant?: ToggleVariant;
  size?: ToggleSize;
}

/** Group of toggles in a filled track: single or `multiple` selection. */
export function ToggleGroup({ variant = 'secondary', size = '1000', ...props }: ToggleGroupProps) {
  return (
    <ToggleContext.Provider value={{ variant, size }}>
      <BaseToggleGroup data-variant={variant} data-size={size} {...props} className="hds-toggle-group" />
    </ToggleContext.Provider>
  );
}

export interface ToggleProps
  extends Omit<ComponentProps<typeof BaseToggle>, 'className' | 'style' | 'pressed' | 'defaultPressed' | 'onPressedChange' | 'nativeButton'> {}

/** One button in a `ToggleGroup`. Pressed: the group `variant`. Idle: the next weaker variant. */
export function Toggle({ render, ...props }: ToggleProps) {
  const ctx = useContext(ToggleContext);
  if (!ctx) throw new Error('Toggle must sit inside a ToggleGroup.');
  return (
    <BaseToggle
      data-size={ctx.size}
      {...props}
      className="hds-button hds-action hds-toggle"
      render={(p, state) => {
        const merged = { ...p, 'data-variant': state.pressed ? ctx.variant : idleVariant[ctx.variant] };
        if (typeof render === 'function') return render(merged, state);
        return render ? cloneElement(render as ReactElement<object>, merged) : <button type="button" {...merged} />;
      }}
    />
  );
}

