"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { useForm } from "@/hooks/use-form"
import type { CampusInfoData } from "@/types/profile"

interface CampusEditModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: CampusInfoData
  onSave: (data: CampusInfoData) => void
}

export function CampusEditModal({ isOpen, onClose, initialData, onSave }: CampusEditModalProps) {
  const { values, handleChange, handleCheckboxChange, handleNestedChange, reset } = useForm<CampusInfoData>(initialData)

  const handleSubmit = () => {
    onSave(values)
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handleRichTextChange = (lang: string, content: string) => {
    handleNestedChange("aboutUniversity", lang, content)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel()
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Information about campus</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="yearOfEstablishment">Year of establishment</Label>
            <Input
              id="yearOfEstablishment"
              name="yearOfEstablishment"
              value={values.yearOfEstablishment}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="numberOfGraduates">Number of graduates</Label>
            <Input
              id="numberOfGraduates"
              name="numberOfGraduates"
              value={values.numberOfGraduates}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="proportionOfEmployedGraduates">Proportion of employed graduates</Label>
            <Input
              id="proportionOfEmployedGraduates"
              name="proportionOfEmployedGraduates"
              value={values.proportionOfEmployedGraduates}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="rankingWithinCountry">Ranking within the country</Label>
            <Input
              id="rankingWithinCountry"
              name="rankingWithinCountry"
              value={values.rankingWithinCountry}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="websiteLink">Website</Label>
            <Input
              id="websiteLink"
              name="websiteLink"
              value={values.websiteLink}
              onChange={handleChange}
              className="mt-1"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label htmlFor="globalRankingPosition">Global ranking position</Label>
            <Input
              id="globalRankingPosition"
              name="globalRankingPosition"
              value={values.globalRankingPosition}
              onChange={handleChange}
              className="mt-1"
              placeholder="Global ranking position"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasDormitories"
              checked={values.hasDormitories}
              onCheckedChange={(checked) => {
                handleCheckboxChange("hasDormitories", checked as boolean)
              }}
            />
            <Label htmlFor="hasDormitories">Does the university have dormitories</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dormitoryFeeRangeMin">Dormitory fee range (min)</Label>
              <Input
                id="dormitoryFeeRangeMin"
                name="dormitoryFeeRangeMin"
                value={values.dormitoryFeeRangeMin}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dormitoryFeeRangeMax">Dormitory fee range (max)</Label>
              <Input
                id="dormitoryFeeRangeMax"
                name="dormitoryFeeRangeMax"
                value={values.dormitoryFeeRangeMax}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>About the university</Label>
            <RichTextEditor value={values.aboutUniversity} onChange={handleRichTextChange} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-purple-900 hover:bg-purple-800">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

