import React, { useEffect } from "react";
import { FaPhone, FaPaperPlane } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import "aos/dist/aos.css";
import Aos from "aos";
import { Helmet } from "react-helmet-async";

const Contact: React.FC = () => {
  useEffect(() => {
    Aos.init({ once: true });
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      <Helmet>
        <title>quickBuzz | Contact Us</title>
      </Helmet>

      {/* Minimal Header Section */}
      <div className="max-w-3xl mx-auto text-center pt-24 pb-12 px-4">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mt-4">
          We'd Love to Hear From You
        </h1>
        <p className="mt-3 text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
          We're here to help and answer any question you might have. Feel free to reach out to our team.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="px-4 py-8">
        <div 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto" 
          data-aos="fade-up"
        >
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:border-orange-200">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
              <MdOutlineAttachEmail className="text-xl" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Chat to Sales
            </h2>
            <p className="text-xs text-gray-500 mb-3">Speak to our friendly team.</p>
            <p className="text-sm text-orange-500 font-semibold tracking-wide">support@quickbuzz.com</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:border-orange-200">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
              <ImLocation2 className="text-xl" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Visit Us
            </h2>
            <p className="text-xs text-gray-500 mb-3">Visit our office HQ.</p>
            <p className="text-sm text-orange-500 font-semibold tracking-wide">Dhaka, Bangladesh</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center transition-all duration-300 hover:border-orange-200">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
              <FaPhone className="text-lg" />
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">Call Us</h2>
            <p className="text-xs text-gray-500 mb-3">24/7 Customer Support</p>
            <p className="text-sm text-orange-500 font-semibold tracking-wide">+880 1849 317388</p>
          </div>
        </div>
      </div>

      {/* Message Form */}
      <div className="py-12 px-4" data-aos="fade-up" data-aos-delay="100">
        <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Side (Info) */}
            <div className="p-8 md:p-10 bg-gray-50/50 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-500">Connect</span>
                  <h2 className="text-2xl font-bold text-gray-950 mt-1">Let's talk!</h2>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    Have questions about products, features, or orders? Send us a message and our team will get back to you within 24 hours.
                  </p>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Quick response time</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Friendly support agents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Secure shopping consultations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side (Form) */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-xs font-semibold text-gray-600 block mb-1">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all duration-300 outline-none text-sm text-gray-800"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="text-xs font-semibold text-gray-600 block mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all duration-300 outline-none text-sm text-gray-800"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="text-xs font-semibold text-gray-600 block mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="How can we help you?"
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all duration-300 outline-none text-sm text-gray-800 resize-none outline-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full px-6 py-3 mt-2 text-white font-semibold bg-orange-500 rounded-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FaPaperPlane className="text-xs" /> Send Message
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
