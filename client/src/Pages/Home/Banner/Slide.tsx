import React from 'react';
import Typewriter from 'typewriter-effect';

interface SlideProps {
  image: string;
}

const Slide: React.FC<SlideProps> = ({ image }) => {
  return (
    <div
      className="bg-center bg-cover h-[22rem] sm:h-[26rem] md:h-[30rem] lg:h-[34rem] xl:h-[38rem]"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="flex items-center justify-center h-full bg-black bg-opacity-40">
        <div className="text-center px-4 sm:px-6 md:px-8 lg:px-10">
          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-purple-600 to-red-500">
            <Typewriter
              options={{
                strings: ['Welcome to Quick Buzz', 'Your One-Stop Online Store'],
                autoStart: true,
                loop: true,
                delay: 80,
                deleteSpeed: 50,
              }}
            />
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 mt-3">
            Discover a wide variety of products crafted just for you.
          </p>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 mt-3 hidden sm:block md:block lg:block">
  Shop effortlessly and enjoy exclusive deals tailored to your preferences.
</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6">
            <a
              href="/product"
              className="text-white bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 sm:px-5 sm:py-3 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
            >
              View Products
            </a>
            <a
              href="/contact"
              className="text-white bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 sm:px-5 sm:py-3 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
            >
              Contact Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;
