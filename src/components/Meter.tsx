import { Meter as BaseMeter } from '@base-ui/react/meter';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ComponentProps } from 'react';
import { cx, part } from './part.ts';
import type { Sentiment } from './Alert.tsx';
import './base.css';
import './Meter.css';

export interface MeterRootProps extends ComponentProps<typeof BaseMeter.Root> {
  sentiment?: Sentiment;
}

function MeterRoot({ sentiment = 'info', className, ...props }: MeterRootProps) {
  return <BaseMeter.Root data-sentiment={sentiment} {...props} className={cx('hds-meter', className)} />;
}

/** Measured value in a known range. Track: Surface 0 striped. Fill: Feedback {sentiment} icon-fg. */
export const Meter = {
  ...BaseMeter,
  Root: MeterRoot,
  Label: part(BaseMeter.Label, 'hds-meter__label'),
  Track: part(BaseMeter.Track, 'hds-meter__track'),
  Indicator: part(BaseMeter.Indicator, 'hds-meter__indicator'),
  Value: part(BaseMeter.Value, 'hds-meter__value'),
};

/** Task progress (`value={null}` = indeterminate). Track: Surface 0 striped. Fill: Action primary. */
export const Progress = {
  ...BaseProgress,
  Root: part(BaseProgress.Root, 'hds-meter hds-progress'),
  Label: part(BaseProgress.Label, 'hds-meter__label'),
  Track: part(BaseProgress.Track, 'hds-meter__track'),
  Indicator: part(BaseProgress.Indicator, 'hds-meter__indicator'),
  Value: part(BaseProgress.Value, 'hds-meter__value'),
};
