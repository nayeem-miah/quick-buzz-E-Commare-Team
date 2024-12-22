/* eslint-disable @typescript-eslint/no-unused-vars */
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import bgimg1 from '../../../assets/banner/banner pic 1.avif'
import bgimg2 from '../../../assets/banner/banner pic 2.jpg'
import bgimg3 from '../../../assets/banner/banner pic 3.avif'
import bgimg4 from '../../../assets/banner/banner pic 4.jpg'
import bgimg5 from '../../../assets/banner/banne pic 5.jpg'
import bgimg6 from '../../../assets/banner/banner pic 6.jpg'


// Import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import Slide from "./Slide";

export default function Carousel(): JSX.Element {
  

  // Get the last 6 items from the data
  // console.log(banner);

  return (
    <div className="">
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
        <SwiperSlide><Slide image={bgimg1}></Slide> </SwiperSlide>
        <SwiperSlide><Slide image={bgimg2}></Slide> </SwiperSlide>
        <SwiperSlide><Slide image={bgimg3}></Slide> </SwiperSlide>
        <SwiperSlide><Slide image={bgimg4}></Slide> </SwiperSlide>
        <SwiperSlide><Slide image={bgimg5}></Slide> </SwiperSlide>
        <SwiperSlide><Slide image={bgimg6}></Slide> </SwiperSlide>
      </Swiper>
    </div>
  );
}
