import React from "react";
import { OrderStatus } from "../../../../constants/enums";

interface OrderTimelineProps {
  status: string;
  steps: { label: string; status: string }[];
  currentStep: number;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  status,
  steps,
  currentStep,
}) => {
  if (status === OrderStatus.CANCELLED) {
    return (
      <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 text-center font-bold text-sm">
        This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">Order Status Timeline</p>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
        {/* Horizontal progress connectors */}
        <div className="absolute top-[15px] left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 hidden md:block z-0" />
        <div
          className="absolute top-[15px] left-0 h-1 bg-orange-500 -translate-y-1/2 hidden md:block z-0 transition-all duration-500"
          style={{ width: `${currentStep >= 0 ? (currentStep / (steps.length - 1)) * 100 : 0}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStep;
          const isActive = idx === currentStep;
          return (
            <div key={idx} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 z-10 w-full md:w-auto">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                isCompleted
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                  : "bg-white text-gray-400 border-gray-200"
              }`}>
                {idx + 1}
              </div>
              <div className="text-left md:text-center">
                <p className={`text-xs font-bold ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                  {step.label}
                </p>
                {isActive && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-semibold bg-orange-50 text-orange-600 rounded border border-orange-100">
                    Current State
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
