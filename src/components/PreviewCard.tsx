// Base UI: @base-ui/react 1.8.0 (preview-card). Spec: docs/component-specs/preview-card/spec.md
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import type { ReactElement, ReactNode } from 'react';
import { sideGap } from './part.ts';
import type { OverlayAlign, OverlaySide, PanelMaxWidth, PanelWidth } from './Popover.tsx';
import './base.css';
import './surface.css';
import './Popover.css';
import './PreviewCard.css';

export interface PreviewCardProps {
  children: ReactElement;
  content: ReactNode;
  side?: OverlaySide;
  align?: OverlayAlign;
  width?: PanelWidth;
  maxWidth?: PanelMaxWidth;
}

/** Preview of a link's destination on hover or focus. Shares the Popover panel. */
export function PreviewCard({
  children, content, side = 'bottom', align = 'center', width = 'auto', maxWidth = '9600',
}: PreviewCardProps) {
  return (
    <BasePreviewCard.Root>
      <BasePreviewCard.Trigger className="hds-link" render={children} />
      <BasePreviewCard.Portal>
        <BasePreviewCard.Positioner className="hds-positioner" side={side} align={align} sideOffset={sideGap}>
          <BasePreviewCard.Popup
            className="hds-surface hds-popup hds-panel hds-preview-card"
            data-elevation="2"
            data-width={width}
            data-max-width={maxWidth}
          >
            {content}
          </BasePreviewCard.Popup>
        </BasePreviewCard.Positioner>
      </BasePreviewCard.Portal>
    </BasePreviewCard.Root>
  );
}
