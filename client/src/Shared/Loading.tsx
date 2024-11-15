import React from 'react'
import { ScaleLoader } from 'react-spinners'

interface LoadingSpinnerProps {
  smallHeight?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ smallHeight }) => {
  return (
    <div
      className={`${
        smallHeight ? 'h-[250px]' : 'h-[70vh]'
      } flex flex-col justify-center items-center`}
    >
      <ScaleLoader height={35} width={4} radius={2} color="red" />
    </div>
  )
}

export default LoadingSpinner
