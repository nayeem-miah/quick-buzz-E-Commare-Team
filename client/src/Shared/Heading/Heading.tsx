import React from "react";

interface HeadingProps {
  title: string;
  subtitle: string;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="max-w-4xl mx-auto text-center px-6 sm:px-10 lg:px-16">
      {/* Title with responsive sizing and animation */}
      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-gray-800 mb-6 animate-fade-in">
        {title}
      </h3>
      {/* Subtitle with responsive sizing and animation */}
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed animate-slide-up">
        {subtitle}
      </p>
    </div>
  );
};

export default Heading;
