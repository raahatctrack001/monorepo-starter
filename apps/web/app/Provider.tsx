'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/lib/store/store'
import { ThemeProvider } from '@/components/theme-provider'
import GlobalLayout from '@/components/common/layouts/GlobalLayout'

type Props = {
  children: React.ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalLayout>{children}</GlobalLayout>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}
