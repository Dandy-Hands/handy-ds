// Base UI @base-ui/react 1.8.0 — wraps @base-ui/react/meter.
import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ReactNode } from 'react';
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
