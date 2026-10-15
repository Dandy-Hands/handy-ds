// Base UI: @base-ui/react 1.8.0 (switch). Spec: docs/component-specs/switch/spec.md
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentProps } from 'react';
import { Icon } from './Icon.tsx';
import './base.css';
import './Icon.css';
import './Switch.css';

/** Icon width and height: a `measure/size` step. */
export type SwitchSize = '500' | '600' | '800';

export interface SwitchProps
  extends Omit<
    ComponentProps<typeof BaseSwitch.Root>,
    'className' | 'style' | 'children' | 'uncheckedValue' | 'inputRef' | 'nativeButton'
  > {
  size?: SwitchSize;
}

/** Field category, `checked` state. One Material Symbols icon per state. Label it with Field.Label or a wrapping <label>. */
export function Switch({ size = '500', ...props }: SwitchProps) {
  return (
    <BaseSwitch.Root data-size={size} {...props} className="hds-switch">
      <Icon size={size} className="hds-switch__off">toggle_off</Icon>
      <Icon size={size} fill className="hds-switch__on">toggle_on</Icon>
    </BaseSwitch.Root>
  );
}
