"use client";

import type { ReactNode } from "react";
import { SideNav } from "./side-nav";
import Image from "next/image";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b p-4 flex justify-between items-center fixed top-0 left-0 right-0 bg-white z-40 h-16">
        <h1 className="text-xl font-bold">Graduate in Korea</h1>
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <Image
            src="/logo.png"
            alt="US Flag"
            width={600} // desired width
            height={600} // desired height
            className="object-contain w-full h-auto"
          />
        </div>
      </header>

      <SideNav />

      <main className="pl-[260px] pt-16 pr-6 pb-6">{children}</main>
    </div>
  );
}
