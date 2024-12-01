import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Shared/Footer/Footer";
import Navbar from "../Shared/Navbar/Navbar";

const Main: React.FC = () => {
  return (
    <div>
      <div className="">
        <Navbar></Navbar>
      </div>
      <div className="mt-28">
        <Outlet></Outlet>
      </div>
      <div className="">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Main;
