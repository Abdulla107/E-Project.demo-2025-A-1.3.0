import React from "react";
import {
  FaClipboardList,
  FaHourglassHalf,
  FaBoxOpen,
  FaTruckLoading,
  FaPlane,
  FaMotorcycle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const steps = [
  { title: "Order Placed", icon: FaClipboardList },
  { title: "Awaiting Supplier", icon: FaHourglassHalf },
  { title: "Processing", icon: FaBoxOpen },
  { title: "Dispatched", icon: FaTruckLoading },
  { title: "In Transit", icon: FaPlane },
  { title: "Out for Delivery", icon: FaMotorcycle },
  { title: "Delivered", icon: FaCheckCircle },
  { title: "Failed Delivery", icon: FaTimesCircle },
];

const TrackingSteps = ({ currentStatus, statusDates = {}, onStatusClick }) => {
  const currentIndex = steps.findIndex((s) => s.title === currentStatus);

  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="relative flex items-center justify-between min-w-[900px] px-4">
        {/* Base track */}
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-300 rounded z-0" />

        {/* Filled track */}
        <div
          className="absolute top-6 left-0 h-1 bg-green-500 rounded z-10 transition-all duration-700 ease-in-out"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          const circleClasses = isCompleted
            ? "bg-green-600 text-white"
            : isActive
            ? "bg-yellow-500 text-white scale-110 animate-pulse"
            : "bg-gray-300 text-gray-600";

          const labelClasses = isCompleted
            ? "text-green-700"
            : isActive
            ? "text-yellow-600"
            : "text-gray-400";

          const date = statusDates[step.title];

          return (
            <div
              key={step.title}
              className="flex flex-col items-center relative flex-1 min-w-[72px] cursor-pointer group"
              onClick={() => onStatusClick && onStatusClick(step.title)}
            >
              {/* Circle with Icon */}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-10 ${circleClasses}`}
                title={step.title}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Label */}
              <p
                className={`mt-2 text-[10px] md:text-xs text-center truncate w-full ${labelClasses}`}
              >
                {step.title}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingSteps;
