import React from "react"
import "@/app/globals.css"
import "flag-icons/css/flag-icons.min.css"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/providers"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'K-GradAbroad',
      applicationName: 'K-GradAbroad',
    };
