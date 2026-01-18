import React from "react"
import "@/app/globals.css"
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
      generator: 'GradAbroad',
      applicationName: 'GradAbroad',
    };
