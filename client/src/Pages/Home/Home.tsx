import React from "react";
import Faq from "../../Components/Home/Faq/Faq";
import Slider from "./Banner/Banner";
import BrowseByDestination from "../../Components/Home/BrowseByDestination/BrowseByDestination";
import Categories from "./Category/Category";
import Input from "../Product/Input";

const Home: React.FC = () => {
  return (
    <div>
    
      <div className="pt-12">
        <Slider></Slider>
        <div className="p-8">
        <Input></Input>
      </div>
        <div className="mt-10 space-y-1">
          <h1 className="text-center text-3xl  border-b-2 font-semibold">
            Categories
          </h1>

          <Categories></Categories>
        </div>
        
        <div>{/* {added poduct} */}</div>
        <BrowseByDestination />
        <Faq></Faq>
      </div>
    </div>
  );
};
//
//
export default Home;
