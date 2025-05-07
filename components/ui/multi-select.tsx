"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface MultiSelectProps {
  options: { label: string; value: string }[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className = "",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item))
    } else {
      onChange([...selected, item])
    }
    setInputValue("")
  }

  return (
    <Command className={`overflow-visible bg-white border rounded-md ${className}`}>
      <div className="flex flex-wrap gap-1 p-2">
        {selected.map((item) => (
          <Badge key={item} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            {item}
            <button
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUnselect(item)
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={() => handleUnselect(item)}
            >
              <X className="h-3 w-3 text-purple-800" />
            </button>
          </Badge>
        ))}
        <CommandInput
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? placeholder : "Add more..."}
          className="ml-2 bg-transparent outline-none placeholder:text-gray-500 flex-1 h-8 p-0"
        />
      </div>
      <div className="relative">
        {open && inputValue && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-white shadow-md">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter(
                    (option) =>
                      option.label.toLowerCase().includes(inputValue.toLowerCase()) && !selected.includes(option.value),
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="flex items-center gap-2"
                    >
                      <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300">
                        {selected.includes(option.value) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      {option.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  )
}

