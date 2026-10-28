// Base UI: @base-ui/react 1.8.0 (toast). Spec: docs/component-specs/toast/spec.md
import { Toast as BaseToast } from '@base-ui/react/toast';
import { useCallback, type ReactNode } from 'react';
import { Button } from './Button.tsx';
import { Icon } from './Icon.tsx';
import { XIcon } from './icons.tsx';
import './base.css';
import './action.css';
import './surface.css';
import './Button.css';
import './Toast.css';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title: ReactNode;
  tone?: ToastTone;
  action?: { label: ReactNode; onClick: () => void };
}

const GLYPH: Record<ToastTone, string> = { info: 'info', success: 'check_circle', warning: 'warning', danger: 'error' };

export interface ToastProviderProps {
  children?: ReactNode;
}

/** Place once around the app. Also renders the toast area. */
export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <BaseToast.Provider limit={3}>
      {children}
      <ToastArea />
    </BaseToast.Provider>
  );
}

function ToastArea() {
  const { toasts } = BaseToast.useToastManager();
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className="hds-toast-viewport">
        {toasts.map((t) => {
          const tone = (t.type ?? 'info') as ToastTone;
          return (
            <BaseToast.Root key={t.id} toast={t} className="hds-surface hds-toast" data-elevation="2" data-mode="dark" data-tone={tone}>
              <BaseToast.Content className="hds-toast__content">
                <Icon tone={tone} size="500">{GLYPH[tone]}</Icon>
                <BaseToast.Title className="hds-toast__title" />
                {t.actionProps && <BaseToast.Action render={<Button variant="secondary" size="800" />} />}
                <BaseToast.Close render={<Button variant="tertiary" size="800" aria-label="Close" data-close="" />}>
                  <XIcon />
                </BaseToast.Close>
              </BaseToast.Content>
            </BaseToast.Root>
          );
        })}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}

/** Returns `toast(options)`. Needs a `ToastProvider` above. */
export function useToast(): (options: ToastOptions) => void {
  const { add, close } = BaseToast.useToastManager();
  return useCallback(({ title, tone = 'info', action }: ToastOptions) => {
    let id = '';
    id = add({
      title,
      type: tone,
      priority: tone === 'danger' ? 'high' : 'low',
      timeout: action ? 10000 : 5000,
      actionProps: action && {
        children: action.label,
        onClick: () => {
          action.onClick();
          close(id);
        },
      },
    });
  }, [add, close]);
}
