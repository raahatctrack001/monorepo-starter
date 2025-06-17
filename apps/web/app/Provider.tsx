'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store/store'
import { ThemeProvider } from '@/components/theme-provider'
import GlobalLayout from '@/components/common/layouts/GlobalLayout'

type Props = {
  children: React.ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <GlobalLayout>{children}</GlobalLayout>
      </ThemeProvider>
    </Provider>
  )
}
