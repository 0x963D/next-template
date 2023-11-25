"use client"

import type { ReactNode } from "react"
import { store } from "@/store/store"
import { SessionProvider } from "next-auth/react"
import { Provider } from "react-redux"

import Sentry from "@/lib/sentry" // needs to be imported first

import { ThemeProvider } from "@/components/common/theme-provider"

const AppProviders = ({ children }: { children: ReactNode | ReactNode[] }): React.JSX.Element => {
  return (
    <Provider store={store}>
      <Sentry.ErrorBoundary showDialog>
        <SessionProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </Sentry.ErrorBoundary>
    </Provider>
  )
}

export default AppProviders
