import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { number: 1, label: 'Person', color: 'bg-blue-600' },
  { number: 2, label: 'Problem', color: 'bg-orange-600' },
  { number: 3, label: 'Plan', color: 'bg-purple-600' },
  { number: 4, label: 'Pivot', color: 'bg-green-600' },
  { number: 5, label: 'Payoff', color: 'bg-indigo-600' }
];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all text-sm",
                  currentStep > step.number
                    ? "bg-gray-900 text-white"
                    : currentStep === step.number
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-semibold",
                  currentStep >= step.number ? "text-gray-900" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px mx-4 bg-gray-200 relative -top-4">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    currentStep > step.number ? "bg-gray-900" : "bg-gray-200"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}