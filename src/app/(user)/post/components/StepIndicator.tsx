"use client";

import { useIsMobile } from "@/hooks/use-mobile";

interface StepIndicatorProps {
  currentStep: number;
  steps: { number: number; title: string }[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  const isMobile = useIsMobile();
  return (
    <div className="md:w-64 md:shrink-0">
      <div className="flex md:flex-col">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="flex-1 md:flex-none"
            style={{
              paddingTop: `${index === 0 && !isMobile ? "18px" : "0px"}`,
              paddingLeft: `${isMobile ? "18px" : "0px"}`,

            }}
          >
            {index > 0 && !isMobile && (
              <div
                className={`h-1 md:h-6 md:w-[2px] mx-auto my-2 md:ml-4 ${
                currentStep > index ? "bg-primary" : "bg-secondary" }`}
              />
            )}
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                ${
                currentStep >= step.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {step.number}
              </div>
              <div className="hidden md:block flex-1">
                <p
                  className={`text-sm font-medium ${
                  currentStep >= step.number
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
