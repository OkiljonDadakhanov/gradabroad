"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { useTranslations } from "@/lib/i18n"

interface ProgramStatisticsProps {
  programId: number | null
  programName: string
}

interface ProgramStats {
  totalApplicants: number
  acceptanceRate: number
  visaApprovalRate: number
  enrollmentRate: number
  topCountries: { country: string; count: number }[]
}

export function ProgramStatistics({ programId, programName }: ProgramStatisticsProps) {
  const t = useTranslations("statistics")
  const tCommon = useTranslations("common")
  const [stats, setStats] = useState<ProgramStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgramStats = async () => {
      if (!programId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const res = await fetchWithAuth(`/api/statistics/programme/${programId}/`)

        if (!res.ok) {
          throw new Error("Failed to fetch programme statistics")
        }

        const data = await res.json()

        setStats({
          totalApplicants: data.total_applicants || 0,
          acceptanceRate: data.acceptance_rate || 0,
          visaApprovalRate: data.visa_approval_rate || 0,
          enrollmentRate: data.enrollment_rate || 0,
          topCountries: data.top_countries || [],
        })
      } catch (err) {
        console.error("Error fetching programme statistics:", err)
        setError("Failed to load programme statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchProgramStats()
  }, [programId])

  if (loading) {
    return <div className="flex justify-center py-8 text-gray-500">{tCommon("loading")}</div>
  }

  if (error) {
    return <div className="flex justify-center py-8 text-red-500">{error}</div>
  }

  if (!stats || !programId) {
    return <div className="flex justify-center py-8 text-gray-500">{t("selectProgram")}</div>
  }

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium">{programName}</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-purple-50">
          <p className="text-sm text-gray-500">{t("totalApplicants")}</p>
          <p className="text-2xl font-bold text-purple-900">{stats.totalApplicants}</p>
        </Card>

        <Card className="p-4 bg-purple-50">
          <p className="text-sm text-gray-500">{t("acceptanceRate")}</p>
          <p className="text-2xl font-bold text-purple-900">{stats.acceptanceRate}%</p>
        </Card>

        <Card className="p-4 bg-purple-50">
          <p className="text-sm text-gray-500">{t("visaApprovalRate")}</p>
          <p className="text-2xl font-bold text-purple-900">{stats.visaApprovalRate}%</p>
        </Card>

        <Card className="p-4 bg-purple-50">
          <p className="text-sm text-gray-500">{t("enrollmentRate")}</p>
          <p className="text-2xl font-bold text-purple-900">{stats.enrollmentRate}%</p>
        </Card>
      </div>

      <div>
        <h5 className="text-md font-medium mb-3">{t("topCountries")}</h5>
        <div className="bg-white rounded-md border">
          <div className="grid grid-cols-2 gap-4 p-3 font-medium text-purple-900 bg-purple-50 rounded-t-md">
            <div>{t("topCountries").split(" ")[0]}</div>
            <div>{t("totalApplicants")}</div>
          </div>
          {stats.topCountries.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 p-3 border-t">
              <div>{item.country}</div>
              <div>{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
