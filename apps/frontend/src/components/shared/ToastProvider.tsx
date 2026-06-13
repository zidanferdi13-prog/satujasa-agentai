'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
} from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';

type ToastVariant = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 4000;

const ToastContext = createContext<ToastContextValue | null>(null);

function SlideTransition(
  props: TransitionProps & { children: React.ReactElement },
) {
  return <Slide {...props} direction="left" />;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = nextId.current++;
    setToasts((prev) => {
      const next = [...prev, { id, message, variant }];
      // Keep only the most recent MAX_TOASTS
      return next.slice(next.length - MAX_TOASTS);
    });

    // Auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, AUTO_DISMISS_MS);
  }, []);

  const showSuccess = useCallback(
    (message: string) => addToast(message, 'success'),
    [addToast],
  );

  const showError = useCallback(
    (message: string) => addToast(message, 'error'),
    [addToast],
  );

  const handleClose = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}

      {/* Toast container — fixed bottom-right */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1400,
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: 1,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            slots={{ transition: SlideTransition }}
            sx={{ position: 'static', transform: 'none' }}
          >
            <Alert
              severity={toast.variant}
              onClose={() => handleClose(toast.id)}
              variant="filled"
              sx={{
                minWidth: 320,
                maxWidth: 440,
                pointerEvents: 'auto',
                boxShadow:
                  'rgba(0, 0, 0, 0.08) 0px 8px 28px -6px, rgba(0, 0, 0, 0.04) 0px 4px 12px -4px',
                ...(toast.variant === 'success' && {
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  borderLeft: '4px solid #10b981',
                  '& .MuiAlert-icon': { color: '#10b981' },
                }),
                ...(toast.variant === 'error' && {
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  borderLeft: '4px solid #ef4444',
                  '& .MuiAlert-icon': { color: '#ef4444' },
                }),
              }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </Box>
    </ToastContext.Provider>
  );
}
