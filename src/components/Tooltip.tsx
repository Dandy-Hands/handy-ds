// Base UI: @base-ui/react 1.8.0 (tooltip). Spec: docs/component-specs/tooltip/spec.md
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ReactElement, ReactNode } from 'react';
import { sideGap } from './part.ts';
import type { OverlayAlign, OverlaySide } from './Popover.tsx';
import './base.css';
import './surface.css';
import './Tooltip.css';

export interface TooltipProps {
  children: ReactElement;
  content: ReactNode;
  side?: OverlaySide;
  align?: OverlayAlign;
}

/** Short label for a control on hover or focus. Always dark (`data-mode="dark"`). */
export function Tooltip({ children, content, side = 'top', align = 'center' }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner className="hds-positioner" side={side} align={align} sideOffset={sideGap}>
          <BaseTooltip.Popup className="hds-surface hds-popup hds-tooltip" data-elevation="2" data-mode="dark">
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
