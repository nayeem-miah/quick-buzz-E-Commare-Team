import React from "react";
import Faq from "../../Components/Home/Faq/Faq";
import Slider from "./Banner/Banner";
import BrowseByDestination from "../../Components/Home/BrowseByDestination/BrowseByDestination";


const Home: React.FC = () => {
    return (
        <div className="pt-12">
            <Slider></Slider>
            <BrowseByDestination/>
            <Faq></Faq>
        </div>
    );
};
// 
// 
export default Home;