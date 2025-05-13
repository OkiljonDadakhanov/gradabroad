"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CandidateStatisticsChart } from "./candidate-statistics-chart"
import { ProgramStatistics } from "./program-statistics"

const PROGRAMS = [
  "Software Engineering",
  "Computer Science",
  "Data Science",
  "Business Administration",
  "English Literature",
  "Medicine",
]

export function StatisticsSection() {
  const [selectedProgram, setSelectedProgram] = useState<string>("Software Engineering")

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-900">Statistics</h2>
      </div>

      <div className="space-y-8">
        <Card className="p-6">
          <CandidateStatisticsChart />
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Candidate Statistics</h3>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMS.map((program) => (
                  <SelectItem key={program} value={program}>
                    {program}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="p-6">
            <ProgramStatistics program={selectedProgram} />
          </Card>
        </div>
      </div>
    </>
  )
}
