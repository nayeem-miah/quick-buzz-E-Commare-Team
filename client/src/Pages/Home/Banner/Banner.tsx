/* eslint-disable @typescript-eslint/no-unused-vars */
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import
 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';


import bgimg1 from '../../../assets/slider/Barisal.jpg';
import bgimg2 from '../../../assets/slider/chittagong.png';
import bgimg3 from '../../../assets/slider/dhaka.jpg';
import bgimg4 from '../../../assets/slider/mymenshing.jpg';
import bgimg5 from '../../../assets/slider/rajshahi.jpg';
import bgimg6 from '../../../assets/slider/rongpur.png';
import Slide from './Slide';

interface SlideProps {
  image: string;
}

export default function Carousel(): JSX.Element {
  return (
    <div className="">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
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
        <SwiperSlide><Slide image={bgimg1} /></SwiperSlide>
        <SwiperSlide><Slide image={bgimg2} /></SwiperSlide>
        <SwiperSlide><Slide image={bgimg3} /></SwiperSlide>
        <SwiperSlide><Slide image={bgimg4} /></SwiperSlide>
        <SwiperSlide><Slide image={bgimg5} /></SwiperSlide>
        <SwiperSlide><Slide image={bgimg6} /></SwiperSlide>
      </Swiper>
    </div>
  );
}
