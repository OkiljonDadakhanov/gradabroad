"use client";

import type { ReactNode } from "react";
import { SideNav } from "./side-nav";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4 flex justify-between items-center fixed top-0 left-0 right-0 bg-white z-40 h-16">
        <h1 className="text-xl font-bold">Graduate in Korea</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src="/placeholder.svg?height=40&width=40"
            alt="US Flag"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <SideNav />

      <main className="pl-[260px] pt-16 pr-6 pb-6">{children}</main>
    </div>
  );
}
