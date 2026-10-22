// Base UI: @base-ui/react 1.8.0 (otp-field).
// Spec: docs/component-specs/otp-field/spec.md
import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { Fragment } from 'react';
import './base.css';
import './control.css';
import './OtpInput.css';

/** Box height: a `measure/size` step. Each box is a square. */
export type OtpInputSize = '800' | '1000' | '1200';

export interface OtpInputProps
  extends Omit<BaseOTPField.Root.Props, 'render' | 'style' | 'className' | 'length' | 'normalizeValue' | 'inputMode' | 'autoSubmit' | 'children'> {
  /** Boxes per group; the sum is the code length. A separator sits between groups. */
  groups?: number[];
  size?: OtpInputSize;
  /** Class for the outer row. */
  className?: string;
}

/** Row of single-character boxes for a one-time code, themed by `hds/sem/color/field/*`. */
export function OtpInput({ groups = [6], size = '1000', className, ...props }: OtpInputProps) {
  if (process.env.NODE_ENV !== 'production' && groups.some((n) => !Number.isInteger(n) || n < 1)) {
    console.warn('<OtpInput> `groups` takes positive whole numbers.');
  }
  const length = groups.reduce((sum, n) => sum + n, 0);
  let index = 0;
  return (
    <BaseOTPField.Root
      {...props}
      length={length}
      className={className ? `hds-otp-input ${className}` : 'hds-otp-input'}
      data-size={size}
    >
      {groups.map((count, group) => (
        <Fragment key={group}>
          {group > 0 && <BaseOTPField.Separator className="hds-otp-input__separator" />}
          {Array.from({ length: count }, () => {
            const i = index++;
            // The first box takes its name from the field label; a label on it is ignored.
            return (
              <BaseOTPField.Input
                key={i}
                className="hds-control hds-otp-input__slot"
                data-size={size}
                aria-label={i === 0 ? undefined : `Character ${i + 1} of ${length}`}
              />
            );
          })}
        </Fragment>
      ))}
    </BaseOTPField.Root>
  );
}
