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

export function CandidateStatisticsChart() {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    const mockData: ChartData = {
      labels: ["Bachelor", "Master's degree", "MBA", "PhD"],
      datasets: [
        {
          label: "Applied",
          data: [65, 42, 28, 15],
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
        {
          label: "Accepted",
          data: [40, 30, 20, 10],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Rejected",
          data: [25, 12, 8, 5],
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
        {
          label: "Visa Approved",
          data: [35, 25, 15, 8],
          backgroundColor: "rgba(255, 206, 86, 0.6)",
        },
        {
          label: "Started Studying",
          data: [30, 20, 12, 6],
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    }

    setChartData(mockData)
  }, [])

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Candidate Statistics by Degree Type",
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
          text: "Degrees",
        },
      },
      y: {
        title: {
          display: true,
          text: "Candidates",
        },
        beginAtZero: true,
      },
    },
  }

  return <Bar data={chartData} options={options} />
}
