import React from "react";
import { FaPhone } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import contact from "./bg.jpg";
import letsMessage from "../../assets/Image/contact.jpg";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Aos from "aos";
import { Helmet } from "react-helmet-async";
const Contact: React.FC = () => {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div className="">
       <Helmet>
          <title>quickBuzz | Contact Page </title>
        </Helmet>
      <div
        className="w-full h-[400px] md:h-[500px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${contact})`,
        }}
      >
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
        <div className="text-center text-white space-y-4 animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-semibold">Contact <span className="text-purple-600">Us</span></h1>
            <p className="text-base md:text-lg max-w-xl mx-auto">
              Our mission is to be the leading online shopping destination,
              delivering exceptional service, prioritizing quality, and offering
              unparalleled convenience to our customers.
            </p>
            <a href="#z">
              <button
                className="mt-3 px-6  py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-1050"
              >
               lets Message
              </button>
            </a>
          </div>
        </div>
      </div>
      {/* contact cart */}
      <div className="grid grid-cols-1 gap-12 mt-10 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-xl mx-auto" data-aos="flip-left" >
        <div
          className="p-4  text-black shadow-lg md:p-6 relative px-6 py-2  bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
        >
          <span className="inline-block p-3  rounded-lg   text-2xl">
            <MdOutlineAttachEmail />
          </span>

          <h2 className="mt-4 text-lg font-semibold text-gray-900 ">
            Chat to Sales
          </h2>
          <p className="mt-2 text-sm">Speak to our friendly team.</p>
          <p className="mt-2 text-sm">support@quicbus.com</p>
        </div>

        <div
          className="p-4  text-black shadow-lg md:p-6 relative px-6 py-2  bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
        >
          <span className="inline-block p-3  rounded-lg text-2xl">
            <ImLocation2 />
          </span>

          <h2 className="mt-4 text-lg font-semibold text-gray-900 ">
            Visit Us
          </h2>
          <p className="mt-2 text-sm  ">Visit our office HQ.</p>
          <p className="mt-2 text-sm  ">Dhaka,Bangladesh</p>
        </div>

        <div
          className="p-4  text-black shadow-lg md:p-6 relative px-6 py-2  bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
          border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
        >
          <span className="inline-block p-3  rounded-lg text-2xl">
            <FaPhone />
          </span>

          <h2 className="mt-4 text-lg font-semibold text-gray-900 ">Call Us</h2>
          <p className="mt-2 text-sm">24/7 Customer Support</p>
          <p className="mt-2 text-sm">+8801849317388</p>
        </div>
      </div>

      {/* lets message me */}
      <div id="letsMessage" className=" py-16" data-aos="flip-left">
        <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg shadow-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32">
          <div className="space-y-2">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-gray-900">
                Let's talk!
              </h2>
              <p className="">Vivamus in nisl metus? Phasellus.</p>
            </div>
            <img
              src={letsMessage}
              alt="letsMessage"
              className="w-full lg:max-w-lg rounded-lg shadow-md h-40 md:h-60  transition-transform transform hover:scale-105 duration-30"
            />
          </div>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="text-sm text-gray-700">
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                className="w-full p-3 rounded border border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-200 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email address"
                className="w-full p-3 rounded border border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-200 transition duration-300"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Your message"
                className="w-full p-3 rounded border border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-200 transition duration-300"
              ></textarea>
            </div>
            <button
              type="submit"
              className="relative  w-full px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-1050"
            >
             
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
