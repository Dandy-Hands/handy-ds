// Base UI @base-ui/react 1.8.0 — wraps @base-ui/react/progress.
import { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ReactNode } from 'react';
import './base.css';
import './Meter.css';

/** Track height: measure/size/{size}. */
export type ProgressSize = '200' | '300' | '400';

/** Minimal by spec, as Meter: no className, render, style, ref, or native props on any part. */
export interface ProgressRootProps {
  /** `null` = indeterminate. */
  value: number | null;
  min?: number;
  max?: number;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  'aria-valuetext'?: string;
  getAriaValueText?: (formattedValue: string | null, value: number | null) => string;
  size?: ProgressSize;
  children?: ReactNode;
}

function ProgressRoot({ size = '300', ...props }: ProgressRootProps) {
  return <BaseProgress.Root {...props} data-size={size} className="hds-meter hds-progress" />;
}

function ProgressLabel({ children }: { children?: ReactNode }) {
  return <BaseProgress.Label className="hds-meter__label">{children}</BaseProgress.Label>;
}

function ProgressValue({ children }: { children?: (formattedValue: string | null, value: number | null) => ReactNode }) {
  return <BaseProgress.Value className="hds-meter__value">{children}</BaseProgress.Value>;
}

function ProgressTrack({ children }: { children?: ReactNode }) {
  return <BaseProgress.Track className="hds-meter__track">{children}</BaseProgress.Track>;
}

function ProgressIndicator() {
  return <BaseProgress.Indicator className="hds-meter__indicator" />;
}

/** Task progress (`value={null}` = indeterminate). Fill: Action primary. Shares the Meter look. */
export const Progress = {
  Root: ProgressRoot,
  Label: ProgressLabel,
  Value: ProgressValue,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
};
