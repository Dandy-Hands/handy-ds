import { Toast as BaseToast } from '@base-ui/react/toast';
import { part } from './part.ts';
import { XIcon } from './icons.tsx';
import './base.css';
import './action.css';
import './Button.css';
import './Feedback.css';

/**
 * Feedback category. A toast's `type` is its sentiment: 'info' (default) | 'success' |
 * 'warning' | 'danger'. Usage: wrap the app in <Toast.Provider>, render <Toaster /> once,
 * then `Toast.useToastManager().add({ title, description, type })`.
 */
export const Toast = {
  ...BaseToast,
  Viewport: part(BaseToast.Viewport, 'hds-toast-viewport'),
  Root: part(BaseToast.Root, 'hds-feedback hds-toast'),
  Content: part(BaseToast.Content, 'hds-toast__content'),
  Title: part(BaseToast.Title, 'hds-feedback__heading'),
  Description: part(BaseToast.Description, 'hds-toast__description'),
  Action: part(BaseToast.Action, 'hds-button hds-action'),
  Close: part(BaseToast.Close, 'hds-feedback__close', { children: <XIcon />, 'aria-label': 'Close' }),
};

/** Renders every toast from the nearest Toast.Provider. */
export function Toaster() {
  const { toasts } = BaseToast.useToastManager();
  return (
    <BaseToast.Portal>
      <Toast.Viewport>
        {toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast} data-sentiment={toast.type ?? 'info'}>
            <Toast.Content>
              <Toast.Title />
              <Toast.Description />
            </Toast.Content>
            <Toast.Close />
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </BaseToast.Portal>
  );
}
