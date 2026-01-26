"use client";

import type { ReactNode } from "react";
import { SideNav } from "./side-nav";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { NotificationDropdown } from "./notification-dropdown";
import { UserDropdown } from "./user-dropdown";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";
import { Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, SUPPORTED_LOCALES } from "@/lib/i18n";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { locale, setLocale, t } = useI18n();
  const { open } = useSidebar();

  const currentLang = SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Header - full width on mobile, offset on desktop */}
      <header className="border-b px-4 md:px-6 flex justify-between items-center fixed top-0 left-0 md:left-64 right-0 bg-white dark:bg-gray-900 dark:border-gray-800 z-40 h-16 shadow-sm dark:shadow-gray-950/50">
        <div className="flex items-center gap-3">
          {/* Hamburger menu for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={open}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">K-GradAbroad</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("header.universityDashboard")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2" title={t("header.language")}>
                <Globe size={20} className="text-gray-600 dark:text-gray-400" />
                <span className={`fi fi-${currentLang.countryCode} hidden sm:inline`}></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800">
              {SUPPORTED_LOCALES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLocale(lang.code)}
                  className={locale === lang.code ? "bg-purple-50 dark:bg-purple-500/10" : ""}
                >
                  <span className={`fi fi-${lang.countryCode} mr-2`}></span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </header>

      <SideNav />

      {/* Main content - no margin on mobile, 64 offset on desktop */}
      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
