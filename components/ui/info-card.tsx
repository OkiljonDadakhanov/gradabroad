import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface InfoItem {
  label: string;
  value: string | number | ReactNode;
  highlight?: boolean;
}

interface InfoCardProps {
  items: InfoItem[];
  className?: string;
  title?: string;
}

export function InfoCard({ items, className = "", title }: InfoCardProps) {
  return (
    <Card className={`mb-4 overflow-hidden bg-white border border-gray-100 shadow-sm ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-gray-100 bg-slate-50">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {item.label}
            </p>
            <p
              className={`text-sm font-medium ${
                item.highlight ? "text-purple-700" : "text-gray-900"
              }`}
            >
              {item.value || <span className="text-gray-300">Not provided</span>}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
