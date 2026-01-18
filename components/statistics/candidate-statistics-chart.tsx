"use client"

import { useState, useEffect } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { useTranslations } from "@/lib/i18n"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Define the chart data structure
interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor?: string
    borderWidth?: number
  }[]
}

interface DegreeStats {
  degree_type: string
  applied: number
  accepted: number
  rejected: number
  visa_approved: number
  studying: number
}

export function CandidateStatisticsChart() {
  const t = useTranslations("statistics")
  const tCommon = useTranslations("common")
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        console.log("Fetching statistics...")
        const res = await fetchWithAuth("/api/statistics/")
        console.log("Statistics response status:", res.status)

        if (!res.ok) {
          const errorText = await res.text()
          console.error("Statistics API error:", errorText)
          throw new Error("Failed to fetch statistics")
        }

        const data = await res.json()
        console.log("Statistics data:", data)
        const degreeStats: DegreeStats[] = data.by_degree_type || []

        if (degreeStats.length === 0) {
          setChartData({
            labels: [tCommon("noData")],
            datasets: [{ label: tCommon("noData"), data: [0], backgroundColor: "rgba(200, 200, 200, 0.6)" }]
          })
          return
        }

        const labels = degreeStats.map((d) => d.degree_type)

        const chartDataFormatted: ChartData = {
          labels,
          datasets: [
            {
              label: t("applied"),
              data: degreeStats.map((d) => d.applied),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
              label: t("accepted"),
              data: degreeStats.map((d) => d.accepted),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
              label: t("rejected"),
              data: degreeStats.map((d) => d.rejected),
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
              label: t("visaApproved"),
              data: degreeStats.map((d) => d.visa_approved),
              backgroundColor: "rgba(255, 206, 86, 0.6)",
            },
            {
              label: t("studying"),
              data: degreeStats.map((d) => d.studying),
              backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
          ],
        }

        setChartData(chartDataFormatted)
      } catch (err: any) {
        console.error("Error fetching statistics:", err?.message || err)
        setError(`${tCommon("error")}: ${err?.message || "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [t, tCommon])

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: t("byDegreeType"),
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ""
            const value = context.parsed.y
            return `${label}: ${value}`
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t("byDegreeType"),
        },
      },
      y: {
        title: {
          display: true,
          text: t("totalApplicants"),
        },
        beginAtZero: true,
      },
    },
  }

  if (loading) {
    return <div className="flex justify-center py-8 text-gray-500">{tCommon("loading")}</div>
  }

  if (error) {
    return <div className="flex justify-center py-8 text-red-500">{error}</div>
  }

  return <Bar data={chartData} options={options} />
}
