"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const LANGUAGES = [
  { id: "en", name: "English", flag: "🇺🇸" },
  { id: "ko", name: "한국어 (Korean)", flag: "🇰🇷" },
  { id: "ru", name: "Русский (Russian)", flag: "🇷🇺" },
  { id: "uz", name: "O'zbek (Uzbek)", flag: "🇺🇿" },
]

export function LanguageSettings() {
  const { toast } = useToast()
  const [language, setLanguage] = useState("en")

  const handleSave = () => {
    // In a real app, this would call an API to save the settings
    toast({
      title: "Language updated",
      description: "Your language preference has been saved.",
      variant: "success",
    })
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Language Settings</h3>

      <div className="space-y-6 max-w-md">
        <div>
          <p className="text-sm text-gray-500 mb-4">Select your preferred language for the interface</p>

          <RadioGroup value={language} onValueChange={setLanguage} className="space-y-3">
            {LANGUAGES.map((lang) => (
              <div key={lang.id} className="flex items-center space-x-2 border p-3 rounded-md">
                <RadioGroupItem value={lang.id} id={`lang-${lang.id}`} />
                <Label htmlFor={`lang-${lang.id}`} className="flex items-center">
                  <span className="mr-2 text-xl">{lang.flag}</span>
                  {lang.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button onClick={handleSave} className="bg-purple-900 hover:bg-purple-800">
          Save Changes
        </Button>
      </div>
    </div>
  )
}
