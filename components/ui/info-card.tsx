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
    <Card className={`mb-4 overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm ${className}`}>
      {title && (
        <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
        {items.map((item, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              {item.label}
            </p>
            <p
              className={`text-sm font-medium ${
                item.highlight ? "text-purple-700 dark:text-purple-400" : "text-gray-900 dark:text-gray-200"
              }`}
            >
              {item.value || <span className="text-gray-300 dark:text-gray-600">Not provided</span>}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
