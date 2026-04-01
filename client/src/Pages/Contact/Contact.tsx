import React, { useEffect } from "react";
import { FaPhone, FaPaperPlane } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import contact from "./bg.jpg";
import letsMessage from "../../assets/Image/contact.jpg";
import "aos/dist/aos.css";
import Aos from "aos";
import { Helmet } from "react-helmet-async";

const Contact: React.FC = () => {
  useEffect(() => {
    Aos.init({ once: true });
  }, []);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <Helmet>
        <title>quickBuzz | Contact Us</title>
      </Helmet>

      {/* Hero Section */}
      <div
        className="w-full h-[400px] md:h-[500px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${contact})`,
        }}
      >
        <div className="absolute inset-0 bg-blue-900/80 flex items-center justify-center">
          <div className="text-center text-white space-y-6 animate-fadeIn px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Get in <span className="text-blue-400">Touch</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-blue-100 font-light leading-relaxed">
              We're here to help and answer any question you might have. We look forward to hearing from you.
            </p>
            <a href="#letsMessage" className="inline-block mt-4">
              <button
                className="px-8 py-3.5 text-blue-900 font-bold bg-white rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1"
              >
                Let's Talk
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="relative -mt-20 z-10 px-4">
        <div 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-xl mx-auto" 
          data-aos="fade-up"
        >
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-600 transition-colors duration-300 rounded-full flex items-center justify-center mb-6">
              <MdOutlineAttachEmail className="text-3xl text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Chat to Sales
            </h2>
            <p className="text-gray-500 mb-2">Speak to our friendly team.</p>
            <p className="text-blue-600 font-medium tracking-wide">support@quicbus.com</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-600 transition-colors duration-300 rounded-full flex items-center justify-center mb-6">
              <ImLocation2 className="text-3xl text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Visit Us
            </h2>
            <p className="text-gray-500 mb-2">Visit our office HQ.</p>
            <p className="text-blue-600 font-medium tracking-wide">Dhaka, Bangladesh</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 group">
            <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-600 transition-colors duration-300 rounded-full flex items-center justify-center mb-6">
              <FaPhone className="text-2xl text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Call Us</h2>
            <p className="text-gray-500 mb-2">24/7 Customer Support</p>
            <p className="text-blue-600 font-medium tracking-wide">+880 1849 317388</p>
          </div>
        </div>
      </div>

      {/* Let's Message Me */}
      <div id="letsMessage" className="py-24 px-4" data-aos="fade-up" data-aos-delay="100">
        <div className="max-w-screen-xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Side (Image & Text) */}
            <div className="p-10 md:p-14 bg-[#f8fafc] flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="mb-10">
                <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block bg-blue-100/50 w-fit px-3 py-1 rounded-full">Connect With Us</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
                  Let's talk!
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We'd love to hear from you. Please fill out this form or shoot us an email if you have any questions or feedback!
                </p>
              </div>
              <div className="relative rounded-3xl overflow-hidden shadow-inner border border-gray-200/60 bg-white group">
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                  src={letsMessage}
                  alt="Contact Us"
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            {/* Right Side (Form) */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700 block mb-2">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none text-gray-800"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 block mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none text-gray-800"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="text-sm font-semibold text-gray-700 block mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="How can we help you?"
                    rows={4}
                    className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none text-gray-800 resize-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full px-8 py-4 mt-4 text-white font-bold bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <FaPaperPlane className="text-sm" /> Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
