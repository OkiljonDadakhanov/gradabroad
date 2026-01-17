"use client";

import { useState } from "react";
import { ProgramFilters, DEGREE_TYPES, FIELDS_OF_STUDY } from "@/types/program";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface ProgramFiltersProps {
  filters: ProgramFilters;
  onFiltersChange: (filters: ProgramFilters) => void;
}

export function ProgramFiltersPanel({
  filters,
  onFiltersChange,
}: ProgramFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.search ||
    filters.field_of_study ||
    filters.degree_type ||
    filters.min_price ||
    filters.max_price;

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={14} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit}>
        <Label htmlFor="search" className="text-sm font-medium text-gray-700">
          Search
        </Label>
        <div className="relative mt-1">
          <Input
            id="search"
            placeholder="Search programs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Degree Type */}
      <div>
        <Label className="text-sm font-medium text-gray-700">Degree Type</Label>
        <Select
          value={filters.degree_type || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              degree_type: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="All degree types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All degree types</SelectItem>
            {DEGREE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Field of Study */}
      <div>
        <Label className="text-sm font-medium text-gray-700">
          Field of Study
        </Label>
        <Select
          value={filters.field_of_study || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              field_of_study: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="All fields" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fields</SelectItem>
            {FIELDS_OF_STUDY.map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium text-gray-700">
          Tuition Range (per semester)
        </Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Input
            type="number"
            placeholder="Min"
            value={filters.min_price || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                min_price: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.max_price || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                max_price: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
