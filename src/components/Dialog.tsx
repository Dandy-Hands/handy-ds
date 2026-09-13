import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { part } from './part.ts';
import './base.css';
import './action.css';
import './surface.css';
import './Button.css';
import './Dialog.css';

/**
 * Modal. Popup: Surface elevation 3. Backdrop: Overlay. Trigger/Close look like a
 * secondary Button; pass `data-priority` to change.
 */
export const Dialog = {
  ...BaseDialog,
  Trigger: part(BaseDialog.Trigger, 'hds-button hds-action'),
  Backdrop: part(BaseDialog.Backdrop, 'hds-backdrop'),
  Popup: part(BaseDialog.Popup, 'hds-surface hds-popup hds-dialog', { 'data-elevation': '3' }),
  Title: part(BaseDialog.Title, 'hds-dialog__title'),
  Description: part(BaseDialog.Description, 'hds-dialog__description'),
  Close: part(BaseDialog.Close, 'hds-button hds-action'),
};

/** Dialog that needs a response (confirm/cancel); not dismissed by outside click. */
export const AlertDialog = {
  ...BaseAlertDialog,
  Trigger: part(BaseAlertDialog.Trigger, 'hds-button hds-action'),
  Backdrop: part(BaseAlertDialog.Backdrop, 'hds-backdrop'),
  Popup: part(BaseAlertDialog.Popup, 'hds-surface hds-popup hds-dialog', { 'data-elevation': '3' }),
  Title: part(BaseAlertDialog.Title, 'hds-dialog__title'),
  Description: part(BaseAlertDialog.Description, 'hds-dialog__description'),
  Close: part(BaseAlertDialog.Close, 'hds-button hds-action'),
};
