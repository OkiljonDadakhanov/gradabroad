"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bold, Italic, Link, List, ListOrdered, ChevronLeft, ChevronRight } from "lucide-react"

interface RichTextEditorProps {
  value: Record<string, string>
  onChange: (lang: string, value: string) => void
  languages?: Array<{ value: string; label: string }>
}

export function RichTextEditor({
  value,
  onChange,
  languages = [
    { value: "english", label: "English" },
    { value: "korean", label: "한국어" },
    { value: "russian", label: "Русский" },
    { value: "uzbek", label: "O'zbek" },
  ],
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState(languages[0].value)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <Tabs defaultValue={activeTab} className="mt-2" onValueChange={handleTabChange}>
      <TabsList className="bg-purple-100">
        {languages.map((lang) => (
          <TabsTrigger
            key={lang.value}
            value={lang.value}
            className="data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            {lang.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="border rounded-md mt-2 p-2">
        <div className="flex gap-2 border-b p-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight size={20} />
          </button>
          <select className="border rounded px-2 text-sm">
            <option>Paragraph</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
          </select>
          <button className="p-1 hover:bg-gray-100 rounded font-bold">
            <Bold size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded italic">
            <Italic size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Link size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <List size={20} />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ListOrdered size={20} />
          </button>
        </div>

        {languages.map((lang) => (
          <TabsContent key={lang.value} value={lang.value}>
            <textarea
              className="w-full h-64 p-2 border-0 focus:outline-none focus:ring-0"
              value={value[lang.value] || ""}
              onChange={(e) => onChange(lang.value, e.target.value)}
              placeholder={`Enter ${lang.label} description`}
            />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}

