/* eslint-disable @typescript-eslint/no-unused-vars */
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../Hooks/UsePublic';

export default function Carousel(): JSX.Element {
  const axiosPublic = useAxiosPublic();

  // Fetch data using React Query
  const { data: allsave = [] } = useQuery({
    queryKey: ['allsave'],
    queryFn: async () => {
      const { data } = await axiosPublic.get('/allsave'); // API endpoint ঠিক করুন
      console.log(data);
      return data;
    },
  });

  // Get the last 6 items from the data
  const lastSixSlides = allsave.slice(-6);

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
        {lastSixSlides.map((slide: { productImage: string }, index: number) => (
          <SwiperSlide key={index}>
            <div
              className="bg-center mt-1 bg-cover h-[32rem]"
              style={{
                backgroundImage: `url(${slide.productImage})`, // Set product image as background
              }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold font-mono  lg:text-2xl">
                    {slide.productTitle} 
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
