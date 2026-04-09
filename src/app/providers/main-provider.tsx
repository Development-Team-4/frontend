import { type PropsWithChildren } from 'react';

import { ThemeProvider } from './theme-provider';
import { TanstackQueryProvider } from './tanstack-query-provider';

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
      </ThemeProvider>
    </TanstackQueryProvider>
  );
}
