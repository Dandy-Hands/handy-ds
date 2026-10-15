// Base UI: @base-ui/react 1.8.0 (radio, radio-group). Spec: docs/component-specs/radio/spec.md
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ComponentProps } from 'react';
import { Icon } from './Icon.tsx';
import './base.css';
import './Icon.css';
import './Radio.css';

/** Icon width and height: a `measure/size` step. */
export type RadioSize = '500' | '600' | '800';
export type RadioGroupOrientation = 'horizontal' | 'vertical';

export interface RadioProps
  extends Omit<ComponentProps<typeof BaseRadio.Root>, 'className' | 'style' | 'children' | 'inputRef' | 'nativeButton'> {
  size?: RadioSize;
}

export interface RadioGroupProps extends Omit<ComponentProps<typeof BaseRadioGroup>, 'className' | 'style' | 'inputRef'> {
  orientation?: RadioGroupOrientation;
}

/** Field category, `checked` state. One Material Symbols icon per state. Always inside a Radio.Group. */
function RadioItem({ size = '500', ...props }: RadioProps) {
  return (
    <BaseRadio.Root data-size={size} {...props} className="hds-radio">
      <Icon size={size} className="hds-radio__unchecked">radio_button_unchecked</Icon>
      <Icon size={size} className="hds-radio__checked">radio_button_checked</Icon>
    </BaseRadio.Root>
  );
}

function RadioGroup({ orientation = 'vertical', ...props }: RadioGroupProps) {
  return <BaseRadioGroup data-orientation={orientation} {...props} className="hds-radio-group" />;
}

export const Radio = Object.assign(RadioItem, { Group: RadioGroup });
