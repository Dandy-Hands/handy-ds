// Base UI: @base-ui/react 1.8.0 (dialog, alert-dialog). Specs: docs/component-specs/dialog/spec.md,
// docs/component-specs/alert-dialog/spec.md
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { useRef, type ReactNode } from 'react';
import { Button } from './Button.tsx';
import { XIcon } from './icons.tsx';
import './base.css';
import './action.css';
import './surface.css';
import './Button.css';
import './Dialog.css';

export type DialogWidth = '8000' | '9600' | '12800' | 'full';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  width?: DialogWidth;
  actions?: ReactNode;
  disablePointerDismissal?: boolean;
  children?: ReactNode;
}

/** Modal box for a short task. Opens only through `open` / `onOpenChange`. */
export function Dialog({ open, onOpenChange, title, width = '9600', actions, disablePointerDismissal, children }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={(next) => onOpenChange(next)} disablePointerDismissal={disablePointerDismissal}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="hds-backdrop" />
        <BaseDialog.Viewport className="hds-modal-viewport">
          <BaseDialog.Popup className="hds-surface hds-popup hds-modal hds-dialog" data-elevation="3" data-width={width}>
            <div className="hds-modal__header">
              <BaseDialog.Title className="hds-modal__title">{title}</BaseDialog.Title>
              <BaseDialog.Close render={<Button variant="tertiary" size="800" aria-label="Close" data-close="" />}>
                <XIcon />
              </BaseDialog.Close>
            </div>
            <div className="hds-modal__body">{children}</div>
            {actions != null && <div className="hds-modal__actions">{actions}</div>}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export type AlertDialogVariant = 'primary' | 'danger';

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  confirm: ReactNode;
  onConfirm: () => void;
  cancel?: ReactNode;
  variant?: AlertDialogVariant;
}

/** Modal confirm for one action. Cancel gets focus first; an outside click does not close it. */
export function AlertDialog({
  open, onOpenChange, title, description, confirm, onConfirm, cancel = 'Cancel', variant = 'primary',
}: AlertDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={(next) => onOpenChange(next)}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className="hds-backdrop" />
        <BaseAlertDialog.Viewport className="hds-modal-viewport">
          <BaseAlertDialog.Popup
            className="hds-surface hds-popup hds-modal hds-alert-dialog"
            data-elevation="3"
            data-variant={variant}
            initialFocus={cancelRef}
          >
            <BaseAlertDialog.Title className="hds-modal__title">{title}</BaseAlertDialog.Title>
            <BaseAlertDialog.Description className="hds-alert-dialog__description">{description}</BaseAlertDialog.Description>
            <div className="hds-modal__actions">
              <BaseAlertDialog.Close ref={cancelRef} render={<Button variant="secondary" size="1000" />}>{cancel}</BaseAlertDialog.Close>
              <Button variant={variant} size="1000" onClick={() => onConfirm()}>{confirm}</Button>
            </div>
          </BaseAlertDialog.Popup>
        </BaseAlertDialog.Viewport>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
