"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LanguageRequirement {
  name: string;
  requirement: string;
}

interface Props {
  value: LanguageRequirement[];
  onChange: (value: LanguageRequirement[]) => void;
}

const BUILTIN_OPTIONS: LanguageRequirement[] = [
  { name: "IELTS", requirement: "Minimum Score: 6.0 and above" },
  { name: "TOEFL", requirement: "Minimum Score: 80 and above" },
  {
    name: "Duolingo English Test",
    requirement: "Minimum Score: 100 and above",
  },
  { name: "Cambridge English", requirement: "C1 Advanced or C2 Proficiency" },
  { name: "PTE Academic", requirement: "Minimum Score: 50 and above" },
  { name: "OET", requirement: "For healthcare professionals" },
  { name: "MET", requirement: "Accepted in some universities" },
];

export function LanguageRequirementInput({ value, onChange }: Props) {
  const [customName, setCustomName] = useState("");
  const [customReq, setCustomReq] = useState("");

  const isSelected = (name: string) =>
    value.some((v) => v.name.toLowerCase() === name.toLowerCase());

  const handleBuiltinToggle = (item: LanguageRequirement) => {
    if (isSelected(item.name)) {
      onChange(value.filter((v) => v.name !== item.name));
    } else {
      onChange([...value, item]);
    }
  };

  const handleCustomAdd = () => {
    if (!customName || !customReq) return;

    const newEntry: LanguageRequirement = {
      name: customName.trim(),
      requirement: customReq.trim(),
    };

    // prevent duplicates
    if (isSelected(newEntry.name)) return;

    onChange([...value, newEntry]);
    setCustomName("");
    setCustomReq("");
  };

  const handleRemove = (name: string) => {
    onChange(value.filter((v) => v.name !== name));
  };

  return (
    <div className="space-y-3">
      <Label className="block">Select Language Requirements</Label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {BUILTIN_OPTIONS.map((option) => (
          <label
            key={option.name}
            className="flex items-center gap-2 text-sm bg-purple-50 rounded p-2 cursor-pointer border border-purple-200"
          >
            <input
              type="checkbox"
              checked={isSelected(option.name)}
              onChange={() => handleBuiltinToggle(option)}
            />
            <span>
              <strong>{option.name}</strong>: {option.requirement}
            </span>
          </label>
        ))}
      </div>

      {/* Custom Entry */}
      <div className="border-t pt-4 mt-2">
        <Label className="block mb-1 text-sm font-semibold">
          Add Custom Language Test
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            placeholder="Test Name (e.g. Korean Proficiency)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <Input
            placeholder="Requirement (e.g. Level 3 or above)"
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

      {/* Display Selected */}
      {value.length > 0 && (
        <div className="mt-4">
          <Label className="mb-1 text-sm">Selected Requirements:</Label>
          <ul className="space-y-1 mt-2">
            {value.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-purple-100 rounded px-3 py-1 text-sm"
              >
                <span>
                  <strong>{item.name}</strong>: {item.requirement}
                </span>
                <button
                  onClick={() => handleRemove(item.name)}
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
