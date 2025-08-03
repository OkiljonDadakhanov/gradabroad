"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useForm } from "@/hooks/use-form";
import type { CampusInfoData } from "@/types/profile";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface CampusEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CampusInfoData;
  onSuccess?: (updated: CampusInfoData) => void;
}

export function CampusEditModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: CampusEditModalProps) {
  const {
    values,
    handleChange,
    handleCheckboxChange,
    handleNestedChange,
    reset,
    setValues,
  } = useForm<CampusInfoData>(initialData);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Access token missing.");
      return;
    }

    setLoading(true);

    const payload = {
      year_established: values.yearOfEstablishment,
      graduates_total: values.numberOfGraduates,
      graduates_employed: values.proportionOfEmployedGraduates,
      ranking_local: values.rankingWithinCountry,
      ranking_global: values.globalRankingPosition,
      dormitory_fee: `${values.dormitoryFeeRangeMin} - ${values.dormitoryFeeRangeMax} USD`,
      dormitory_available: values.hasDormitories ? "Yes" : null,
      description: values.aboutUniversity.english,
    };

    try {
      const res = await fetchWithAuth(
        `https://api.gradabroad.net/api/information-about-campus/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const updatedRaw = await res.json();

      const updated: CampusInfoData = {
        ...values,
        yearOfEstablishment: updatedRaw.year_established?.toString() ?? "",
        numberOfGraduates: updatedRaw.graduates_total?.toString() ?? "",
        proportionOfEmployedGraduates:
          updatedRaw.graduates_employed?.toString() ?? "",
        rankingWithinCountry: String(updatedRaw.ranking_local ?? ""), // fix here
        globalRankingPosition: String(updatedRaw.ranking_global ?? ""),
        dormitoryFeeRangeMin:
          updatedRaw.dormitory_fee?.split(" - ")[0]?.trim() ?? "",
        dormitoryFeeRangeMax:
          updatedRaw.dormitory_fee
            ?.split(" - ")[1]
            ?.replace("USD", "")
            ?.trim() ?? "",
        hasDormitories: updatedRaw.dormitory_available === "Yes",
        aboutUniversity: {
          english: updatedRaw.description ?? "",
        },
      };

      setValues(updated); // Optional
      toast.success("Campus information updated successfully!");
      if (onSuccess) onSuccess(updated);
      onClose();
    } catch (err: any) {
      toast.error("Failed to update campus info.");
      console.error("Update error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleRichTextChange = (lang: string, content: string) => {
    handleNestedChange("aboutUniversity", lang, content);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Information about campus
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="yearOfEstablishment">Year of establishment</Label>
            <Input
              id="yearOfEstablishment"
              value={values.yearOfEstablishment}
              onChange={handleChange}
              name="yearOfEstablishment"
              placeholder="e.g. 1999"
            />
          </div>

          <div>
            <Label htmlFor="numberOfGraduates">Number of graduates</Label>
            <Input
              id="numberOfGraduates"
              value={values.numberOfGraduates}
              onChange={handleChange}
              name="numberOfGraduates"
              placeholder="e.g. 1500"
            />
          </div>

          <div>
            <Label htmlFor="proportionOfEmployedGraduates">
              Proportion of employed graduates (%)
            </Label>
            <Input
              id="proportionOfEmployedGraduates"
              value={values.proportionOfEmployedGraduates}
              onChange={handleChange}
              name="proportionOfEmployedGraduates"
              placeholder="e.g. 80"
            />
          </div>

          <div>
            <Label htmlFor="rankingWithinCountry">
              Ranking within the country
            </Label>
            <Input
              id="rankingWithinCountry"
              value={values.rankingWithinCountry}
              onChange={handleChange}
              name="rankingWithinCountry"
              placeholder="e.g. 10"
            />
          </div>

          <div>
            <Label htmlFor="globalRankingPosition">
              Global ranking position
            </Label>
            <Input
              id="globalRankingPosition"
              value={values.globalRankingPosition}
              onChange={handleChange}
              name="globalRankingPosition"
              placeholder="e.g. 250"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasDormitories"
              checked={values.hasDormitories}
              onCheckedChange={(checked) =>
                handleCheckboxChange("hasDormitories", checked as boolean)
              }
            />
            <Label htmlFor="hasDormitories">
              Does the university have dormitories?
            </Label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dormitoryFeeRangeMin">
                Dormitory fee (min, USD)
              </Label>
              <Input
                id="dormitoryFeeRangeMin"
                value={values.dormitoryFeeRangeMin}
                onChange={handleChange}
                name="dormitoryFeeRangeMin"
                placeholder="e.g. 100"
              />
            </div>
            <div>
              <Label htmlFor="dormitoryFeeRangeMax">
                Dormitory fee (max, USD)
              </Label>
              <Input
                id="dormitoryFeeRangeMax"
                value={values.dormitoryFeeRangeMax}
                onChange={handleChange}
                name="dormitoryFeeRangeMax"
                placeholder="e.g. 300"
              />
            </div>
          </div>

          <div>
            <Label>About the university</Label>
            <RichTextEditor
              value={values.aboutUniversity}
              onChange={handleRichTextChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-purple-900 hover:bg-purple-800 text-white"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
