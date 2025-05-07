"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/ui/section-header"
import { InfoCard } from "@/components/ui/info-card"
import { Card } from "@/components/ui/card"
import { CampusEditModal } from "./campus-edit-modal"
import type { CampusInfoData } from "@/types/profile"

export function CampusInfoSection() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [campusData, setCampusData] = useState<CampusInfoData>({
    yearOfEstablishment: "01.01.2020",
    numberOfGraduates: "600",
    proportionOfEmployedGraduates: "350",
    rankingWithinCountry: "10",
    globalRankingPosition: "-",
    hasDormitories: true,
    dormitoryFeeRangeMin: "50",
    dormitoryFeeRangeMax: "100",
    websiteLink: "https://newuu.uz/",
    aboutUniversity: {
      english: `New Uzbekistan University (NewUU) is Uzbekistan's first comprehensive research university where research and education are integrated. Located at the heart of greater Central Asia, we are building the nation's premier institution as the country embarks to conclude its first decade of political and market economy reforms. NewUU aims to become Central Asia's flagship university through an official partnership with the Massachusetts Institute of Technology's (MIT) Jameel Abdul Latif-World Education Lab (J-WEL) and Technical University of Munich (TUM) International.

Offering a diverse range of programs, including 9 undergraduate, 2 graduate, 9 PhD and 2 DSc degrees across the schools of Engineering, Computing, Humanities, Natural & Social Sciences, and Management, the university is tailored to meet the evolving demands of the modern world. By fostering a multidisciplinary approach, NewUU is educating the next generation of leaders and innovators who will lay out the groundwork for significant contributions to the local & global knowledge economy.

Beyond its academic offerings, New Uzbekistan University is committed to becoming a local and regional hub for the dissemination of knowledge and best practices in higher education. Through organizing a variety of events such as local and regional forums, conferences, hackathons, and festivals, NewUU actively cultivates a culture of innovation, entrepreneurship, engineering, and research. This commitment to outreach and collaboration underscores NewUU's vision of contribution to the broader educational and research community in Uzbekistan and Central Asia.`,
      korean: "",
      russian: "",
      uzbek: "",
    },
  })

  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  const handleSave = (updatedData: CampusInfoData) => {
    setCampusData(updatedData)
    setIsEditModalOpen(false)
  }

  return (
    <>
      <SectionHeader title="Information about campus" onEdit={handleEditClick} />

      <InfoCard
        items={[
          { label: "Year of establishment", value: campusData.yearOfEstablishment, highlight: true },
          { label: "Number of graduates", value: campusData.numberOfGraduates },
          { label: "Proportion of employed graduates", value: campusData.proportionOfEmployedGraduates },
        ]}
      />

      <InfoCard
        items={[
          { label: "Ranking within the country", value: campusData.rankingWithinCountry, highlight: true },
          { label: "Global ranking position", value: campusData.globalRankingPosition },
          { label: "Does the university have dormitories", value: campusData.hasDormitories ? "Yes" : "No" },
        ]}
      />

      <InfoCard
        items={[
          {
            label: "Dormitory fee range",
            value: `${campusData.dormitoryFeeRangeMin} - ${campusData.dormitoryFeeRangeMax}`,
          },
        ]}
      />

      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: campusData.aboutUniversity.english.replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        </div>
      </Card>

      <CampusEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={campusData}
        onSave={handleSave}
      />
    </>
  )
}

