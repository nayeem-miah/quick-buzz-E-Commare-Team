import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import bgimg1 from "../../../assets/banner/banner1.jpg";
import bgimg2 from "../../../assets/banner/banner pic 2.jpg";
import bgimg3 from "../../../assets/banner/banner pic 3.avif";
import bgimg4 from "../../../assets/banner/banner pic 4.jpg";
import bgimg5 from "../../../assets/banner/banne pic 5.jpg";
import bgimg6 from "../../../assets/banner/banner pic 6.jpg";

// Import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";

export default function Carousel(): JSX.Element {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = search.trim();
    if (!term) return;

    navigate(`/product?search=${encodeURIComponent(term)}`);
  };

  const images = [bgimg5, bgimg6, bgimg1, bgimg2, bgimg4, bgimg3];

  return (
    <div className="max-w-screen-2xl relative h-[22rem] sm:h-[26rem] md:h-[30rem] lg:h-[34rem] xl:h-[38rem] overflow-hidden">
      {/* Background Images Slider */}
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper h-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-center bg-cover"
              style={{
                backgroundImage: `url(${img})`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Static Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/45 z-10 pointer-events-none">
        <div className="text-center px-4 sm:px-6 md:px-8 lg:px-10 w-full max-w-4xl pointer-events-auto">
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

          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-6 max-w-lg sm:max-w-xl w-full px-2"
          >
            <div className="relative flex items-center bg-white rounded-full p-1 shadow-md border border-orange-200/50 focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-transparent transition-all duration-300">
              <div className="pl-4 pr-2 text-orange-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search mobile, airpods, laptop..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-sm sm:text-base pr-3"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white font-semibold text-sm sm:text-base px-6 py-2.5 sm:py-3 rounded-full hover:bg-orange-600 hover:shadow-md transition-all duration-200 active:scale-95 whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>

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
}
