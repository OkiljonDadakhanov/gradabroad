"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useI18n, SUPPORTED_LOCALES } from "@/lib/i18n"
import { Check } from "lucide-react"
import US from "country-flag-icons/react/3x2/US"
import KR from "country-flag-icons/react/3x2/KR"
import RU from "country-flag-icons/react/3x2/RU"
import UZ from "country-flag-icons/react/3x2/UZ"

const FLAGS: Record<string, React.ComponentType<{ className?: string }>> = {
  us: US,
  kr: KR,
  ru: RU,
  uz: UZ,
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const currentLang = SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0]
  const CurrentFlag = FLAGS[currentLang.countryCode] || US

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label={`Current language: ${currentLang.name}. Click to change language`}
        >
          <CurrentFlag className="w-6 h-4 rounded-sm shadow-sm" aria-hidden="true" />
          <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-gray-800 min-w-[160px]">
        {SUPPORTED_LOCALES.map((language) => {
          const Flag = FLAGS[language.countryCode] || US
          const isSelected = locale === language.code
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => setLocale(language.code)}
              className={`flex items-center justify-between gap-3 ${isSelected ? "bg-purple-50 dark:bg-purple-500/10" : ""}`}
              aria-selected={isSelected}
            >
              <span className="flex items-center gap-3">
                <Flag className="w-6 h-4 rounded-sm shadow-sm" aria-hidden="true" />
                <span>{language.name}</span>
              </span>
              {isSelected && <Check size={16} className="text-purple-600" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
