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
}

export function InfoCard({ items, className = "" }: InfoCardProps) {
  const gridCols =
    items.length <= 3 ? `grid-cols-${items.length}` : "grid-cols-3";

  return (
    <Card className={`mb-6 overflow-hidden ${className}`}>
      <div className={`grid ${gridCols} gap-4 p-4`}>
        {items.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p
              className={`font-medium ${
                item.highlight ? "text-purple-900" : ""
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
