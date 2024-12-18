/* eslint-disable @typescript-eslint/no-unused-vars */
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/UsePublic";

export default function Carousel(): JSX.Element {
  const axiosPublic = useAxiosPublic();

  // Fetch data using React Query
  const { data: banner = [] } = useQuery({
    queryKey: ["banner"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/banner"); // API endpoint ঠিক করুন
      console.log(data);
      return data;
    },
  });

  // Get the last 6 items from the data
  console.log(banner);

  return (
    <div className="my-6">
      <Swiper
        spaceBetween={30} // The space between slides
        centeredSlides={true} // Center the slides
        loop={false} // Disable loop since we are showing 6 slides only
        autoplay={{
          delay: 1800,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {banner.map((slide: { productImage: string }, index: number) => (
          <SwiperSlide key={index}>
            <div
              className="bg-center mt-1 bg-[length:100%_100%] h-[300px] lg:h-[500px]"
              style={{
                backgroundImage: `url(${slide.productImage})`,
              }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-center">
                  <h1 >
                    <span className="lg:text-2xl text-sm font-mono font-bold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text bg-300% animate-gradient">
                      Please visit Ourwebsite, browse through the products,{" "}
                      <br />
                      and select the ones that suit your preferences
                    </span>
                  </h1>

                  <br />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
