import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../Shared/Footer/Footer";
import Navbar from "../Shared/Navbar/Navbar";
import { AiSuggestionsChatbot } from "../Shared/Chatbot/AiSuggestionsChatbot";

const Main: React.FC = () => {
  return (
    <div>
      <Navbar></Navbar>

      <div className="md:mt-24 mt-16 lg:mt-24">
        <Outlet></Outlet>
      </div>
      <div className="mt-10">
        <Footer></Footer>
      </div>

      {/* Floating AI Assistant Chatbot */}
      <AiSuggestionsChatbot />
    </div>
  );
};

export default Main;
