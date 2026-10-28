// Base UI: @base-ui/react 1.8.0 (popover). Spec: docs/component-specs/popover/spec.md
import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ReactElement, ReactNode } from 'react';
import { Button } from './Button.tsx';
import { XIcon } from './icons.tsx';
import { sideGap } from './part.ts';
import './base.css';
import './action.css';
import './surface.css';
import './Button.css';
import './Popover.css';

export type OverlaySide = 'top' | 'bottom' | 'inline-start' | 'inline-end';
export type OverlayAlign = 'start' | 'center' | 'end';
/** `measure/width` steps for Popover and PreviewCard panels. */
export type PanelMaxWidth = '6400' | '8000' | '9600' | '12800';
export type PanelWidth = 'auto' | PanelMaxWidth;

export interface PopoverProps {
  children: ReactElement;
  title: ReactNode;
  content: ReactNode;
  side?: OverlaySide;
  align?: OverlayAlign;
  width?: PanelWidth;
  maxWidth?: PanelMaxWidth;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Non-modal panel next to its control, opened by a click on it. One component; parts are internal. */
export function Popover({
  children, title, content, side = 'bottom', align = 'center', width = 'auto', maxWidth = '9600', open, onOpenChange,
}: PopoverProps) {
  return (
    <BasePopover.Root open={open} onOpenChange={onOpenChange && ((next) => onOpenChange(next))}>
      <BasePopover.Trigger render={children} />
      <BasePopover.Portal>
        <BasePopover.Positioner className="hds-positioner" side={side} align={align} sideOffset={sideGap}>
          <BasePopover.Popup
            className="hds-surface hds-popup hds-panel hds-popover"
            data-elevation="2"
            data-width={width}
            data-max-width={maxWidth}
          >
            <div className="hds-popover__header">
              <BasePopover.Title className="hds-popover__title">{title}</BasePopover.Title>
              <BasePopover.Close render={<Button variant="tertiary" size="800" aria-label="Close" data-close="" />}>
                <XIcon />
              </BasePopover.Close>
            </div>
            <div className="hds-popover__body">{content}</div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
