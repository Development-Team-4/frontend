import { type PropsWithChildren } from 'react';

import { ThemeProvider } from './theme-provider';
import { TanstackQueryProvider } from './tanstack-query-provider';
import { Toaster } from '@/components/ui/sonner';

export function MainProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <TanstackQueryProvider>
      <ThemeProvider
        attribute="class"
        themes={['light', 'dark']}
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </TanstackQueryProvider>
  );
}
