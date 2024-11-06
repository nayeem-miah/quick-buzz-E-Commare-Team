import React from 'react';
import './banner.css';
import './app.ts';

const Slider: React.FC = () => {
    return (
        <div className="slider">
            <div className="list">
                <div className="item">
                    <img src="https://i.ibb.co.com/MDWv1tz/img1.jpg" alt="" />
                    <div className="content">
                        {/* <div className="title">MAGIC SLIDER</div>
                        <div className="type">FLOWER</div> */}
                        {/* <div className="description">
                            "Welcome to QuickBuzz! Discover Amazing Deals Every Day 🛒✨"
                        </div>
                        <div className="button">
                            <button>SEE MORE</button>
                        </div> */}
                    </div>
                </div>

                <div className="item">
                    <img src="https://i.ibb.co.com/cJz3jkF/img2.jpg" alt="" />
                    <div className="content">
                        {/* <div className="title">MAGIC SLIDER</div>
                        <div className="type">NATURE</div> */}
                        {/* <div className="description">
                            "Welcome back to CodeDevotee! Exciting content, tutorials,<br />
                            and projects ahead. Let’s build together! 🚀💻"
                        </div> */}
                        {/* <div className="button">
                            <button>SEE MORE</button>
                        </div> */}
                    </div>
                </div>

                <div className="item">
                    <img src="
                           https://i.ibb.co.com/C8qW9vT/img4.jpg" alt="" />
                    <div className="content">
                        {/* <div className="title">MAGIC SLIDER</div>
                        <div className="type">PLANT</div> */}
                        {/* <div className="description">
                            "Welcome back to CodeDevotee! Exciting content, tutorials, <br />
                            and projects ahead. Let’s build together! 🚀💻"
                        </div> */}
                        {/* <div className="button">
                            <button>SEE MORE</button>
                        </div> */}
                    </div>
                </div>

                <div className="item">
                    <img src="https://i.ibb.co.com/SvxfKhW/img3.jpg" alt="" />
                    <div className="content">
                        {/* <div className="title">MAGIC SLIDER</div>
                        <div className="type">NATURE</div> */}
                        {/* <div className="description">
                            "Welcome back to CodeDevotee! Exciting content, tutorials, <br />
                            and projects ahead. Let’s build together! 🚀💻"
                        </div>
                        <div className="button">
                            <button>SEE MORE</button>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="thumbnail">
                <div className="item">
                    <img src="https://i.ibb.co.com/MDWv1tz/img1.jpg" alt="" />
                </div>
                <div className="item">
                    <img src="
                        https://i.ibb.co.com/cJz3jkF/img2.jpg
                          " alt="" />
                </div>
                <div className="item">
                    <img src="
                      https://i.ibb.co.com/C8qW9vT/img4.jpg" alt="" />
                </div>
                <div className="item">
                    <img src="https://i.ibb.co.com/SvxfKhW/img3.jpg" alt="" />
                </div>
            </div>

            <div className="nextPrevArrows">
                <button className="prev"> &lt; </button>
                <button className="next"> &gt; </button>
            </div>
        </div>
    );
};

export default Slider;
