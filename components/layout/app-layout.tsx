"use client"

import type { ReactNode } from "react"
import { SideNav } from "./side-nav"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Graduate in Korea</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src="/placeholder.svg?height=40&width=40" alt="US Flag" className="w-full h-full object-cover" />
        </div>
      </header>

      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

