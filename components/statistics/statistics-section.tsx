"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CandidateStatisticsChart } from "./candidate-statistics-chart"
import { ProgramStatistics } from "./program-statistics"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { useTranslations } from "@/lib/i18n"

interface Programme {
  id: number
  name: string
}

export function StatisticsSection() {
  const t = useTranslations("statistics")
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const res = await fetchWithAuth("/api/programmes/mine/")
        if (res.ok) {
          const data = await res.json()
          setProgrammes(data)
          if (data.length > 0) {
            setSelectedProgrammeId(data[0].id)
          }
        }
      } catch (err) {
        console.error("Error fetching programmes:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProgrammes()
  }, [])

  const selectedProgramme = programmes.find((p) => p.id === selectedProgrammeId)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-900">{t("title")}</h2>
      </div>

      <div className="space-y-8">
        <Card className="p-6">
          <CandidateStatisticsChart />
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{t("programStatistics")}</h3>
            <Select
              value={selectedProgrammeId?.toString() || ""}
              onValueChange={(value) => setSelectedProgrammeId(Number(value))}
              disabled={loading || programmes.length === 0}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder={loading ? "..." : t("selectProgram")} />
              </SelectTrigger>
              <SelectContent>
                {programmes.map((programme) => (
                  <SelectItem key={programme.id} value={programme.id.toString()}>
                    {programme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="p-6">
            <ProgramStatistics
              programId={selectedProgrammeId}
              programName={selectedProgramme?.name || ""}
            />
          </Card>
        </div>
      </div>
    </>
  )
}
