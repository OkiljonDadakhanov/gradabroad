"use client";

import { PublicProgram } from "@/types/program";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface ProgramCardProps {
  program: PublicProgram;
}

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Link href={`/programs/${program.id}`} className="block h-full">
      <Card className="h-full flex flex-col hover:shadow-lg hover:border-purple-300 transition-all duration-200 cursor-pointer">
        <CardContent className="flex-1 pt-6">
          {/* University Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
              {program.university.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {program.university.name}
              </p>
              {program.university.city && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} />
                  {program.university.city}
                </p>
              )}
            </div>
          </div>

          {/* Program Name */}
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {program.name}
          </h3>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              <GraduationCap size={12} className="mr-1" />
              {program.degree_type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {program.field_of_study}
            </Badge>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-gray-400" />
              <span>
                {program.tuition_fee
                  ? `$${parseFloat(program.tuition_fee).toLocaleString()}/semester`
                  : "Contact for pricing"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              <span>Starts {formatDate(program.start_date)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
