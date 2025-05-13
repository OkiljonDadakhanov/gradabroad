"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface ProgramStatisticsProps {
  program: string
}

interface ProgramStats {
  totalApplicants: number
  acceptanceRate: number
  visaApprovalRate: number
  enrollmentRate: number
  topCountries: { country: string; count: number }[]
}

export function ProgramStatistics({ program }: ProgramStatisticsProps) {
  const [stats, setStats] = useState<ProgramStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockStats: ProgramStats = {
        totalApplicants: Math.floor(Math.random() * 100) + 50,
        acceptanceRate: Math.floor(Math.random() * 40) + 40,
        visaApprovalRate: Math.floor(Math.random() * 30) + 60,
        enrollmentRate: Math.floor(Math.random() * 20) + 70,
        topCountries: [
          { country: "China", count: Math.floor(Math.random() * 20) + 10 },
          { country: "India", count: Math.floor(Math.random() * 15) + 8 },
          { country: "Vietnam", count: Math.floor(Math.random() * 10) + 5 },
          { country: "Indonesia", count: Math.floor(Math.random() * 8) + 3 },
          { country: "Pakistan", count: Math.floor(Math.random() * 5) + 2 },
        ],
      }

      setStats(mockStats)
      setLoading(false)
    }, 500)
  }, [program])

  if (loading) {
    return <div className="flex justify-center py-8">Loading statistics...</div>
  }

  if (!stats) {
    return <div className="flex justify-center py-8">No statistics available</div>
  }

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-medium">{program} Program Statistics</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-purple-50">
          <p className="text-sm text-gray-500">Total Applicants</p>
          <p className="text-2xl font-bold text-purple-900">{stats.totalApplicants}</p>
        </Card>

        <Card className="p-4 bg-purple-50">
          <p className="text-sm text-gray-500">Acceptance Rate</p>
          <p className="text-2xl font-bold text-purple-900">{stats.acceptanceRate}%</p>
        </Card>

        <Card className="p-4 bg-purple-50">
          <p className="text-sm text-gray-500">Visa Approval Rate</p>
          <p className="text-2xl font-bold text-purple-900">{stats.visaApprovalRate}%</p>
        </Card>

        <Card className="p-4 bg-purple-50">
          <p className="text-sm text-gray-500">Enrollment Rate</p>
          <p className="text-2xl font-bold text-purple-900">{stats.enrollmentRate}%</p>
        </Card>
      </div>

      <div>
        <h5 className="text-md font-medium mb-3">Top Countries of Origin</h5>
        <div className="bg-white rounded-md border">
          <div className="grid grid-cols-2 gap-4 p-3 font-medium text-purple-900 bg-purple-50 rounded-t-md">
            <div>Country</div>
            <div>Applicants</div>
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
