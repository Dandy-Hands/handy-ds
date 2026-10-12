// Base UI @base-ui/react 1.8.0 — wraps @base-ui/react/meter and @base-ui/react/progress.
import { Meter as BaseMeter } from '@base-ui/react/meter';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ReactNode } from 'react';
import { part } from './part.ts';
import './base.css';
import './Meter.css';

/** Feedback fill tone: color/feedback/{tone}/icon. */
export type MeterTone = 'info' | 'success' | 'warning' | 'danger';
/** Track height: measure/size/{size}. */
export type MeterSize = '200' | '300' | '400';

/** Minimal by spec: no className, render, style, ref, or native props on any part. */
export interface MeterRootProps {
  value: number;
  min?: number;
  max?: number;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  'aria-valuetext'?: string;
  getAriaValueText?: (formattedValue: string, value: number) => string;
  tone?: MeterTone;
  size?: MeterSize;
  children?: ReactNode;
}

function MeterRoot({ tone = 'info', size = '300', ...props }: MeterRootProps) {
  return <BaseMeter.Root {...props} data-tone={tone} data-size={size} className="hds-meter" />;
}

function MeterLabel({ children }: { children?: ReactNode }) {
  return <BaseMeter.Label className="hds-meter__label">{children}</BaseMeter.Label>;
}

function MeterValue({ children }: { children?: (formattedValue: string, value: number) => ReactNode }) {
  return <BaseMeter.Value className="hds-meter__value">{children}</BaseMeter.Value>;
}

function MeterTrack({ children }: { children?: ReactNode }) {
  return <BaseMeter.Track className="hds-meter__track">{children}</BaseMeter.Track>;
}

function MeterIndicator() {
  return <BaseMeter.Indicator className="hds-meter__indicator" />;
}

/** Static measurement in a known range. Fill: Feedback {tone} icon. */
export const Meter = {
  Root: MeterRoot,
  Label: MeterLabel,
  Value: MeterValue,
  Track: MeterTrack,
  Indicator: MeterIndicator,
};

/** Task progress (`value={null}` = indeterminate). Dry-run surface until its own interview. Fill: Action primary. */
export const Progress = {
  ...BaseProgress,
  Root: part(BaseProgress.Root, 'hds-meter hds-progress'),
  Label: part(BaseProgress.Label, 'hds-meter__label'),
  Track: part(BaseProgress.Track, 'hds-meter__track'),
  Indicator: part(BaseProgress.Indicator, 'hds-meter__indicator'),
  Value: part(BaseProgress.Value, 'hds-meter__value'),
};
