// components/ui/multi-select.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleOption = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, value]);
    } else {
      onChange(selected.filter((v) => v !== value));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left ${className}`}
        >
          {selected.length === 0 ? placeholder : selected.join(", ")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2 space-y-1 max-h-64 overflow-y-auto">
        {options.map((opt) => {
          const isChecked = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) =>
                  toggleOption(opt.value, !!checked)
                }
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
