'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

type ToastVariant = 'default' | 'success' | 'error' | 'info';

type ToastInput =
  | string
  | {
      title?: string;
      description?: string;
      variant?: ToastVariant;
      duration?: number;
    };

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within <ToastProvider>');
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const data = typeof input === 'string' ? { description: input } : input;
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = {
        id,
        title: data.title,
        description: data.description,
        variant: data.variant ?? 'default',
      };
      setToasts((current) => [...current, item]);
      const duration =
        (typeof input === 'object' && input.duration) || 3500;
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            onClick={() => dismiss(t.id)}
            style={{
              minWidth: 240,
              maxWidth: 360,
              padding: '12px 14px',
              borderRadius: 10,
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,.5)',
              background:
                t.variant === 'error'
                  ? '#dc2626'
                  : t.variant === 'success'
                  ? '#16a34a'
                  : t.variant === 'info'
                  ? '#2563eb'
                  : '#1f2937',
            }}
          >
            {t.title && (
              <div style={{ fontWeight: 600, marginBottom: t.description ? 2 : 0 }}>
                {t.title}
              </div>
            )}
            {t.description && (
              <div style={{ fontSize: 14, opacity: 0.9 }}>{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
