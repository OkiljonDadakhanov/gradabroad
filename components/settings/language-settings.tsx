"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { fetchWithAuth } from "@/lib/fetchWithAuth"

const LANGUAGES = [
  { id: "en", name: "English", countryCode: "us" },
  { id: "ko", name: "한국어 (Korean)", countryCode: "kr" },
  { id: "ru", name: "Русский (Russian)", countryCode: "ru" },
  { id: "uz", name: "O'zbek (Uzbek)", countryCode: "uz" },
]

export function LanguageSettings() {
  const { toast } = useToast()
  const [language, setLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const res = await fetchWithAuth("/api/settings/language/")
        if (res.ok) {
          const data = await res.json()
          if (data.preferred_language) {
            setLanguage(data.preferred_language)
          }
        }
      } catch (err) {
        console.error("Error fetching language preference:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLanguage()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetchWithAuth("/api/settings/language/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferred_language: language }),
      })

      if (res.ok) {
        toast({
          title: "Language updated",
          description: "Your language preference has been saved.",
          variant: "success",
        })
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.detail || "Failed to update language preference",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update language preference",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Language Settings</h3>

      <div className="space-y-6 max-w-md">
        <div>
          <p className="text-sm text-gray-500 mb-4">Select your preferred language for the interface</p>

          <RadioGroup value={language} onValueChange={setLanguage} className="space-y-3" disabled={isLoading}>
            {LANGUAGES.map((lang) => (
              <div key={lang.id} className={`flex items-center space-x-2 border p-3 rounded-md ${isLoading ? "opacity-50" : ""}`}>
                <RadioGroupItem value={lang.id} id={`lang-${lang.id}`} disabled={isLoading} />
                <Label htmlFor={`lang-${lang.id}`} className="flex items-center cursor-pointer">
                  <span className={`fi fi-${lang.countryCode} mr-2 text-lg`}></span>
                  {lang.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button onClick={handleSave} className="bg-purple-900 hover:bg-purple-800" disabled={isSaving || isLoading}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}
