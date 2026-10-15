// Base UI: @base-ui/react 1.8.0 (slider). Spec: docs/component-specs/slider/spec.md
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import './base.css';
import './Slider.css';

/** Track height: measure/size/{size}. The thumb is two steps larger. */
export type SliderSize = '200' | '300' | '400';

export interface SliderRootProps
  extends Omit<ComponentProps<typeof BaseSlider.Root>, 'className' | 'style' | 'thumbAlignment'> {
  size?: SliderSize;
}

export interface SliderControlProps {
  getAriaLabel?: (index: number) => string;
  getAriaValueText?: (formattedValue: string, value: number, index: number) => string;
}

/** Number of thumbs. The Root sets it from `value ?? defaultValue`. */
const ThumbCount = createContext(1);

function SliderRoot({ size = '300', ...props }: SliderRootProps) {
  const initial = props.value ?? props.defaultValue;
  const count = Array.isArray(initial) ? initial.length : 1;
  return (
    <ThumbCount.Provider value={count}>
      <BaseSlider.Root thumbAlignment="edge" data-size={size} {...props} className="hds-slider" />
    </ThumbCount.Provider>
  );
}

function SliderLabel({ children }: { children?: ReactNode }) {
  return <BaseSlider.Label className="hds-slider__label">{children}</BaseSlider.Label>;
}

function SliderValue({
  children,
}: {
  children?: (formattedValues: readonly string[], values: readonly number[]) => ReactNode;
}) {
  return <BaseSlider.Value className="hds-slider__value">{children}</BaseSlider.Value>;
}

/** Draws the track, the fill, and one thumb for each value. */
function SliderControl({ getAriaLabel, getAriaValueText }: SliderControlProps) {
  const count = useContext(ThumbCount);
  return (
    <BaseSlider.Control className="hds-slider__control">
      <BaseSlider.Track className="hds-slider__track">
        <BaseSlider.Indicator className="hds-slider__indicator" />
        {Array.from({ length: count }, (_, index) => (
          <BaseSlider.Thumb
            key={index}
            index={index}
            className="hds-slider__thumb"
            getAriaLabel={getAriaLabel}
            getAriaValueText={getAriaValueText}
          />
        ))}
      </BaseSlider.Track>
    </BaseSlider.Control>
  );
}

/** Field category. Pick a number, or a range, by dragging. Label it with Slider.Label. */
export const Slider = {
  Root: SliderRoot,
  Label: SliderLabel,
  Value: SliderValue,
  Control: SliderControl,
};
