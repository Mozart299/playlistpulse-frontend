'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
        className: 'sonner-toast',
        descriptionClassName: 'sonner-toast-description',
    
      }}
    />
  );
}
