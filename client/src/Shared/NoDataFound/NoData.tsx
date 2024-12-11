import React from "react";
import NoDataImg from '../../assets/Image/noData.webp'

interface NoDataProps {
  message?: string; // Custom message to display
  actionText?: string; // Optional button text
  onActionClick?: () => void; // Optional action button handler
  illustration?: string; // Optional illustration URL
}

const NoData: React.FC<NoDataProps> = ({
  message = "No data available.",
  actionText,
  onActionClick,

}) => {
  return (
    <div className="flex flex-col items-center justify-center h-80 p-6 bg-white rounded-lg shadow-md">
    
        <img
          src={NoDataImg}
          alt="No data"
          className="w-40 h-40 mb-4 object-contain"
        />
   
      <p className="text-gray-600 text-lg font-medium">{message}</p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default NoData;
