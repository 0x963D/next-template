import "@/styles/globals.css"

import { type Metadata } from "next"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/shadcn"
import AppProviders from "@/components/common/providers"
import { TailwindIndicator } from "@/components/common/tailwind-indicator"
import Toast from "@/components/common/toast"

import "react-toastify/dist/ReactToastify.css"

import { HeaderView } from "@/components/views/header"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon-16x16.png",
    apple: "/favicons/apple-touch-icon.png"
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <>
      <html lang='en' suppressHydrationWarning>
        <head />
        <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
          <AppProviders>
            <HeaderView />
            <div className='relative flex min-h-screen flex-col'>
              <Toast />
              <div className='overflow-hidden flex-1'>{children}</div>
            </div>
            <TailwindIndicator />
          </AppProviders>
        </body>
      </html>
    </>
  )
}
