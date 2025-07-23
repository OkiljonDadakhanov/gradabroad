"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface LanguageRequirement {
  name: string;
  requirement: string;
}

interface Props {
  value: LanguageRequirement[];
  onChange: (value: LanguageRequirement[]) => void;
}

const DROPDOWN_OPTIONS: Record<string, string[]> = {
  TOEFL: ["iBT 65+", "iBT 71+", "iBT 80+", "iBT 90+"],
  IELTS: ["5.5+", "6.0+", "6.5+", "7+"],
  TOPIK: [
    "80–139 (TOPIK I)+",
    "140–200 (TOPIK I)+",
    "120–149 (TOPIK II)+",
    "150–189 (TOPIK II)+",
    "190–229 (TOPIK II)+",
    "230–300 (TOPIK II)+",
  ],
};

export function LanguageRequirementInput({ value, onChange }: Props) {
  const [customName, setCustomName] = useState("");
  const [customReq, setCustomReq] = useState("");

  const handleSelectChange = (category: string, selected: string) => {
    const updated = value.filter((v) => v.name !== category);
    updated.push({ name: category, requirement: selected });
    onChange(updated);
  };

  const handleCustomAdd = () => {
    if (!customName || !customReq) return;

    const newEntry = {
      name: customName.trim(),
      requirement: customReq.trim(),
    };

    if (
      value.some(
        (v) =>
          v.name.toLowerCase() === newEntry.name.toLowerCase() &&
          v.requirement === newEntry.requirement
      )
    )
      return;

    onChange([...value, newEntry]);
    setCustomName("");
    setCustomReq("");
  };

  const handleRemove = (name: string, requirement: string) => {
    onChange(
      value.filter((v) => !(v.name === name && v.requirement === requirement))
    );
  };

  const getSelected = (name: string) => {
    return value.find((v) => v.name === name)?.requirement || "";
  };

  return (
    <div className="space-y-6">
      <Label className="text-base">Language Requirements</Label>

      {/* Built-in Categories as Dropdowns */}
      {Object.entries(DROPDOWN_OPTIONS).map(([category, options]) => (
        <div key={category}>
          <Label className="font-semibold mb-1 block">{category}</Label>
          <Select
            value={getSelected(category)}
            onValueChange={(selected) => handleSelectChange(category, selected)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${category} requirement`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {category} {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {/* Custom Test Entry */}
      <div className="border-t pt-4">
        <Label className="block mb-1 text-sm font-semibold">
          Add Custom Test
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            placeholder="Test Name (e.g. Duolingo)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <Input
            placeholder="Requirement (e.g. 100+)"
            value={customReq}
            onChange={(e) => setCustomReq(e.target.value)}
          />
        </div>
        <Button
          onClick={handleCustomAdd}
          className="mt-2 bg-purple-900 hover:bg-purple-800"
        >
          Add Custom Test
        </Button>
      </div>

      {/* Selected Results */}
      {value.length > 0 && (
        <div className="mt-4">
          <Label className="mb-1 text-sm font-semibold">Selected:</Label>
          <ul className="space-y-1">
            {value.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between bg-purple-50 rounded px-3 py-1 text-sm border"
              >
                <span>
                  <strong>{item.name}</strong>: {item.requirement}
                </span>
                <button
                  onClick={() => handleRemove(item.name, item.requirement)}
                  className="text-red-600 text-xs hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
