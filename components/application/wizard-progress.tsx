"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface WizardProgressProps {
  steps: string[];
  currentStep: number;
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                    isCompleted
                      ? "bg-purple-600 border-purple-600 text-white"
                      : isCurrent
                      ? "bg-purple-100 border-purple-600 text-purple-700"
                      : "bg-gray-100 border-gray-300 text-gray-500"
                  )}
                >
                  {isCompleted ? <Check size={20} /> : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs text-center hidden sm:block",
                    isCurrent
                      ? "text-purple-700 font-medium"
                      : isCompleted
                      ? "text-purple-600"
                      : "text-gray-500"
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    index < currentStep ? "bg-purple-600" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile step label */}
      <p className="text-center mt-4 text-sm text-purple-700 font-medium sm:hidden">
        Step {currentStep + 1}: {steps[currentStep]}
      </p>
    </div>
  );
}
