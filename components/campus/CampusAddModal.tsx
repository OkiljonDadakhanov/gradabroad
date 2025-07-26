"use client";

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
import type { CampusInfoData } from "@/types/profile";
import { useEffect, useState } from "react";

interface CampusAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CampusInfoData) => void;
}

const EMPTY_DATA: CampusInfoData = {
  yearOfEstablishment: "",
  numberOfGraduates: "",
  proportionOfEmployedGraduates: "",
  rankingWithinCountry: "",
  globalRankingPosition: "",
  websiteLink: "",
  hasDormitories: false,
  dormitoryFeeRangeMin: "",
  dormitoryFeeRangeMax: "",
  aboutUniversity: {
    english: "",
    korean: "",
    russian: "",
    uzbek: "",
  },
};

export function CampusAddModal({
  isOpen,
  onClose,
  onSave,
}: CampusAddModalProps) {
  const [values, setValues] = useState<CampusInfoData>(EMPTY_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValues(EMPTY_DATA); // Reset form when modal opens
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (
    name: keyof CampusInfoData,
    checked: boolean
  ) => {
    setValues((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRichTextChange = (lang: string, content: string) => {
    setValues((prev) => ({
      ...prev,
      aboutUniversity: {
        ...prev.aboutUniversity,
        [lang]: content,
      },
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setValues(EMPTY_DATA);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Campus Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="yearOfEstablishment">Year of establishment</Label>
            <Input
              id="yearOfEstablishment"
              name="yearOfEstablishment"
              value={values.yearOfEstablishment}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="numberOfGraduates">Number of graduates</Label>
            <Input
              id="numberOfGraduates"
              name="numberOfGraduates"
              value={values.numberOfGraduates}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="proportionOfEmployedGraduates">
              Proportion of employed graduates
            </Label>
            <Input
              id="proportionOfEmployedGraduates"
              name="proportionOfEmployedGraduates"
              value={values.proportionOfEmployedGraduates}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="rankingWithinCountry">
              Ranking within the country
            </Label>
            <Input
              id="rankingWithinCountry"
              name="rankingWithinCountry"
              value={values.rankingWithinCountry}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="globalRankingPosition">
              Global ranking position
            </Label>
            <Input
              id="globalRankingPosition"
              name="globalRankingPosition"
              value={values.globalRankingPosition}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="websiteLink">University Website Link</Label>
            <Input
              id="websiteLink"
              name="websiteLink"
              value={values.websiteLink}
              onChange={handleChange}
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
              Does the university have dormitories
            </Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dormitoryFeeRangeMin">
                Dormitory fee range (min)
              </Label>
              <Input
                id="dormitoryFeeRangeMin"
                name="dormitoryFeeRangeMin"
                value={values.dormitoryFeeRangeMin}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="dormitoryFeeRangeMax">
                Dormitory fee range (max)
              </Label>
              <Input
                id="dormitoryFeeRangeMax"
                name="dormitoryFeeRangeMax"
                value={values.dormitoryFeeRangeMax}
                onChange={handleChange}
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-purple-900 hover:bg-purple-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
