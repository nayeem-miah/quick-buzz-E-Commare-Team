import React from "react";
import Faq from "../../Components/Faq/Faq";
import Slider from "./Banner/Banner";

const Home: React.FC = () => {
    return (
        <div className="pt-12">
            <Slider></Slider>
            <Faq></Faq>
        </div>
    );
};

export default Home;