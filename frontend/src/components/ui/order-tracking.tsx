"use client"

import * as React from "react"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface OrderTrackingProps
  extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    name: string
    timestamp: string
    isCompleted: boolean
  }[]
  orientation?: "horizontal" | "vertical"
  onStepClick?: (index: number) => void
}

const OrderTracking = React.forwardRef<HTMLDivElement, OrderTrackingProps>(
  ({ steps = [], orientation = "horizontal", onStepClick, className, ...props }, ref) => {
    if (steps.length === 0) {
      return (
        <div ref={ref} className={cn("w-full text-xs text-foreground/80", className)} {...props}>
          This order has no tracking information.
        </div>
      )
    }

    if (orientation === "horizontal") {
      return (
        <div ref={ref} className={cn("w-full py-1 overflow-x-auto", className)} {...props}>
          <div className="flex items-center justify-between min-w-[520px] w-full px-1">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  onClick={() => onStepClick && onStepClick(index)}
                  className={cn(
                    "flex flex-col items-center text-center transition-all px-1",
                    onStepClick && "cursor-pointer hover:opacity-80"
                  )}
                  style={{ minWidth: '70px' }}
                >
                  <div className="flex items-center justify-center">
                    {step.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-slate-300" />
                    )}
                  </div>
                  <p className={cn("text-[11px] font-bold mt-1 leading-tight whitespace-nowrap", step.isCompleted ? "text-slate-900" : "text-slate-400")}>
                    {step.name}
                  </p>
                  <p className={cn("text-[10px] mt-0.5 whitespace-nowrap font-mono", step.isCompleted ? "text-emerald-700 font-semibold" : "text-slate-400")}>
                    {step.timestamp}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-[2px] flex-1 mx-1 self-center -mt-4 transition-colors",
                      steps[index + 1].isCompleted
                        ? "bg-emerald-500"
                        : "bg-slate-200"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("w-full max-w-md", className)} {...props}>
        <div>
          {steps.map((step, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center">
                {step.isCompleted ? (
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600" />
                ) : (
                  <Circle className="h-4.5 w-4.5 shrink-0 text-slate-300" />
                )}
                {index < steps.length - 1 && (
                  <div
                    className={cn("w-[2px] grow min-h-[16px] my-0.5", {
                      "bg-emerald-500": steps[index + 1].isCompleted,
                      "bg-slate-200": !steps[index + 1].isCompleted,
                    })}
                  />
                )}
              </div>
              <div className="ml-2.5 pb-2.5">
                <p className={cn("text-xs font-semibold", step.isCompleted ? "text-slate-900" : "text-slate-400")}>
                  {step.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {step.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
OrderTracking.displayName = "OrderTracking"

export { OrderTracking }
