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
      <div className="flex items-center justify-center h-full bg-black/45">
        <div className="text-center px-4 sm:px-6 md:px-8 lg:px-10">
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
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
            Find fresh deals, trusted gadgets, and everyday essentials in one clean shopping experience.
          </p>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 mt-3 hidden sm:block md:block lg:block">
  Shop faster with curated products, smooth checkout, and offers made for QuickBuzz customers.
</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6">
            <a
              href="/product"
              className="rounded-xl bg-orange-400 px-5 py-3 font-semibold text-gray-950 shadow-sm shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500"
            >
              View Products
            </a>
            <a
              href="/contact"
              className="rounded-xl bg-orange-400 px-5 py-3 font-semibold text-gray-950 shadow-sm shadow-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500"
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
