import React from "react";
import { CirclesWithBar, DNA } from "react-loader-spinner";
interface LoadingSpinnerProps {
  smallHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ smallHeight }) => {
  return (
    <div
      className={`${
        smallHeight ? "h-[250px]" : "h-[70vh]"
      } flex flex-col justify-center items-center`}
    >
                 <CirclesWithBar
        height={80}
        width={80}               
        color="#3498db"
        outerCircleColor="#3498db" 
        innerCircleColor="#2980b9" 
        barColor="#2980b9"        
        ariaLabel="circles-with-bar-loading" 
        wrapperStyle={{}}         
        wrapperClass="spinner"  
        visible={true}          
      />
    </div>
  );
};

export default LoadingSpinner;
