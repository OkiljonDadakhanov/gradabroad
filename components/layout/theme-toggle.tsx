"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
        <Sun size={20} className="text-gray-600" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors">
          {theme === "dark" ? (
            <Moon size={20} className="text-gray-600 dark:text-gray-400" />
          ) : theme === "system" ? (
            <Monitor size={20} className="text-gray-600 dark:text-gray-400" />
          ) : (
            <Sun size={20} className="text-gray-600" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-purple-50 dark:bg-purple-500/10" : ""}
        >
          <Sun size={16} className="mr-2" />
          {t("theme.light")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-purple-50 dark:bg-purple-500/10" : ""}
        >
          <Moon size={16} className="mr-2" />
          {t("theme.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-purple-50 dark:bg-purple-500/10" : ""}
        >
          <Monitor size={16} className="mr-2" />
          {t("theme.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
