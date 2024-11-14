import React, { useState } from 'react';
import './banner.css';

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://i.ibb.co/MDWv1tz/img1.jpg",
    "https://i.ibb.co/cJz3jkF/img2.jpg",
    "https://i.ibb.co/C8qW9vT/img4.jpg",
    "https://i.ibb.co/SvxfKhW/img3.jpg",
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="slider">
      <div className="list">
        <div className="item">
          <img src={images[currentIndex]} alt="" />
        </div>
      </div>

      <div className="thumbnail">
        {images.map((img, index) => (
          <div key={index} className="item">
            <img src={img} alt="" />
          </div>
        ))}
      </div>

      <div className="nextPrevArrows">
        <button className="prev" onClick={handlePrev}> &lt; </button>
        <button className="next" onClick={handleNext}> &gt; </button>
      </div>
    </div>
  );
};

export default Slider;
