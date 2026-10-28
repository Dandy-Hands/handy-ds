// Base UI: @base-ui/react 1.8.0 (drawer). Spec: docs/component-specs/drawer/spec.md
import { useDirection } from '@base-ui/react/direction-provider';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ReactNode } from 'react';
import { Button } from './Button.tsx';
import { XIcon } from './icons.tsx';
import './base.css';
import './action.css';
import './surface.css';
import './Button.css';
import './Dialog.css';
import './Drawer.css';

export type DrawerSide = 'inline-end' | 'inline-start' | 'bottom';
export type DrawerWidth = '8000' | '9600' | '12800';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  side?: DrawerSide;
  width?: DrawerWidth;
  actions?: ReactNode;
  disablePointerDismissal?: boolean;
  children?: ReactNode;
}

/** Modal panel that slides in from a screen edge. Shares the Dialog header, body and button row. */
export function Drawer({
  open, onOpenChange, title, side = 'inline-end', width = '9600', actions, disablePointerDismissal, children,
}: DrawerProps) {
  const rtl = useDirection() === 'rtl';
  const swipeDirection = side === 'bottom' ? 'down' : (side === 'inline-end') !== rtl ? 'right' : 'left';
  return (
    <BaseDrawer.Root
      open={open}
      onOpenChange={(next) => onOpenChange(next)}
      disablePointerDismissal={disablePointerDismissal}
      swipeDirection={swipeDirection}
    >
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className="hds-backdrop" />
        <BaseDrawer.Viewport className="hds-drawer-viewport" data-side={side}>
          <BaseDrawer.Popup className="hds-surface hds-modal hds-drawer" data-elevation="3" data-side={side} data-width={width}>
            {side === 'bottom' && <div className="hds-drawer__grab" aria-hidden="true" />}
            <div className="hds-modal__header">
              <BaseDrawer.Title className="hds-modal__title">{title}</BaseDrawer.Title>
              <BaseDrawer.Close render={<Button variant="tertiary" size="800" aria-label="Close" data-close="" />}>
                <XIcon />
              </BaseDrawer.Close>
            </div>
            <BaseDrawer.Content className="hds-modal__body">{children}</BaseDrawer.Content>
            {actions != null && <div className="hds-modal__actions">{actions}</div>}
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  );
}
