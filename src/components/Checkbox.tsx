// Base UI: @base-ui/react 1.8.0 (checkbox, checkbox-group). Spec: docs/component-specs/checkbox/spec.md
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import type { ComponentProps } from 'react';
import { Icon } from './Icon.tsx';
import './base.css';
import './Icon.css';
import './Checkbox.css';

/** Box width and height: a `measure/size` step. */
export type CheckboxSize = '500' | '600' | '800';
export type CheckboxGroupOrientation = 'horizontal' | 'vertical';

export interface CheckboxProps
  extends Omit<
    ComponentProps<typeof BaseCheckbox.Root>,
    'className' | 'style' | 'children' | 'parent' | 'uncheckedValue' | 'inputRef' | 'nativeButton'
  > {
  size?: CheckboxSize;
}

export interface CheckboxGroupProps extends Omit<ComponentProps<typeof BaseCheckboxGroup>, 'className' | 'style' | 'allValues'> {
  orientation?: CheckboxGroupOrientation;
}

/** Field category, `checked` state. One Material Symbols icon per state. Label it with Field.Label or a wrapping <label>. */
function CheckboxBox({ size = '500', ...props }: CheckboxProps) {
  return (
    <BaseCheckbox.Root data-size={size} {...props} className="hds-checkbox">
      <Icon size={size} className="hds-checkbox__blank">check_box_outline_blank</Icon>
      <Icon size={size} fill className="hds-checkbox__checked">check_box</Icon>
      <Icon size={size} fill className="hds-checkbox__mixed">indeterminate_check_box</Icon>
    </BaseCheckbox.Root>
  );
}

function CheckboxGroup({ orientation = 'vertical', ...props }: CheckboxGroupProps) {
  return <BaseCheckboxGroup data-orientation={orientation} {...props} className="hds-checkbox-group" />;
}

export const Checkbox = Object.assign(CheckboxBox, { Group: CheckboxGroup });
