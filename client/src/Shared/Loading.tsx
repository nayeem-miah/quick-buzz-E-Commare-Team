import React from "react";
// import { ScaleLoader } from 'react-spinners'
import { DNA } from "react-loader-spinner";
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
            {/* <ScaleLoader height={35} width={4} radius={2} color="red" /> */}
      <DNA
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
};

export default LoadingSpinner;
