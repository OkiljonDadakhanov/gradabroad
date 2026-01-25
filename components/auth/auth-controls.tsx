"use client"

import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { ThemeToggle } from "@/components/layout/theme-toggle"

export function AuthControls() {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  )
}
