import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Shared/Footer/Footer";
import Navbar from "../Shared/Navbar/Navbar";

const Main: React.FC = () => {
  return (
    <div>
      <Navbar></Navbar>

      <div className="md:mt-28 mt-20 lg:mt-28">
        <Outlet></Outlet>
      </div>
      <div className="mt-10">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Main;
