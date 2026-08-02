import { PackageOpen } from "lucide-react";
import React from "react";

interface NoDataProps {
  message?: string;
  actionText?: string;
  onActionClick?: () => void;
}

const NoData: React.FC<NoDataProps> = ({
  message = "No data available.",
  actionText,
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-80 p-10 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-5">
        <PackageOpen className="w-7 h-7 text-orange-500" />
      </div>
      <p className="text-gray-500 text-sm font-semibold">{message}</p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md shadow-orange-500/30"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default NoData;
