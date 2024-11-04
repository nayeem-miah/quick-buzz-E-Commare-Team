// Banner.tsx

import React, { useEffect } from 'react';
import './banner.css';

const Banner: React.FC = () => {
    useEffect(() => {
        const nextBtn = document.querySelector<HTMLButtonElement>('.next');
        const prevBtn = document.querySelector<HTMLButtonElement>('.prev');
        const slider = document.querySelector<HTMLDivElement>('.slider');
        const sliderList = slider?.querySelector<HTMLDivElement>('.list');
        const thumbnail = document.querySelector<HTMLDivElement>('.thumbnail');

        const handleNext = () => moveSlider('next', sliderList, thumbnail);
        const handlePrev = () => moveSlider('prev', sliderList, thumbnail);

        nextBtn?.addEventListener('click', handleNext);
        prevBtn?.addEventListener('click', handlePrev);

        // Cleanup event listeners on component unmount
        return () => {
            nextBtn?.removeEventListener('click', handleNext);
            prevBtn?.removeEventListener('click', handlePrev);
        };
    }, []);

    const moveSlider = (direction: 'next' | 'prev', sliderList: HTMLDivElement | null, thumbnail: HTMLDivElement | null) => {
        if (!sliderList || !thumbnail) return;

        const sliderItems = sliderList.querySelectorAll<HTMLDivElement>('.item');
        const thumbnailItems = thumbnail.querySelectorAll<HTMLDivElement>('.item');

        if (direction === 'next' && sliderItems.length > 0 && thumbnailItems.length > 0) {
            sliderList.appendChild(sliderItems[0]);
            thumbnail.appendChild(thumbnailItems[0]);
            sliderList.parentElement?.classList.add('next');
        } else if (direction === 'prev' && sliderItems.length > 0 && thumbnailItems.length > 0) {
            sliderList.prepend(sliderItems[sliderItems.length - 1]);
            thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1]);
            sliderList.parentElement?.classList.add('prev');
        }

        // Remove animation class after the animation ends
        sliderList.parentElement?.addEventListener('animationend', () => {
            sliderList.parentElement?.classList.remove(direction === 'next' ? 'next' : 'prev');
        }, { once: true });
    };

    return (
        <div>
            <div className="slider">
                <div className="list">
                    <div className="item">
                        <img src="img1.jpg" alt="Flower Image" />
                        <div className="content">
                            <div className="title">MAGIC SLIDER</div>
                            <div className="type">FLOWER</div>
                            <div className="description">
                                "Welcome back to CodeDevotee! Exciting content, tutorials,<br />
                                and projects ahead. Let’s build together! 🚀💻"
                            </div>
                            <div className="button">
                                <button>SEE MORE</button>
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <img src="img2.jpg" alt="Nature Image" />
                        <div className="content">
                            <div className="title">MAGIC SLIDER</div>
                            <div className="type">NATURE</div>
                            <div className="description">
                                "Welcome back to CodeDevotee! Exciting content, tutorials,<br />
                                and projects ahead. Let’s build together! 🚀💻"
                            </div>
                            <div className="button">
                                <button>SEE MORE</button>
                            </div>
                        </div>
                    </div>
                    {/* Add more items as needed */}
                </div>

                <div className="thumbnail">
                    <div className="item">
                        <img src="https://i.ibb.co/w6KkD9s/img1.jpg" alt="Thumbnail 1" />
                    </div>
                    <div className="item">
                        <img src="https://i.ibb.co/vhhMtFx/img2.jpg" alt="Thumbnail 2" />
                    </div>
                    <div className="item">
                        <img src="https://i.ibb.co/CBMjH5s/img3.jpg" alt="Thumbnail 3" />
                    </div>
                    <div className="item">
                        <img src="https://i.ibb.co/12H0qcW/img4.jpg" alt="Thumbnail 4" />
                    </div>
                </div>

                <div className="nextPrevArrows">
                    <button className="prev">&lt;</button>
                    <button className="next">&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;
