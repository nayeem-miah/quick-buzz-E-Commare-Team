import React from "react";
import { FaPhone } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";
const Contact: React.FC = () => {
    return (
        <div className="py-24">
            <div className="grid grid-cols-1 gap-12 mt-10 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-xl mx-auto">
                <div className="p-4 bg-white text-black shadow-lg md:p-6 relative px-6 py-2  bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105">
                    <span className="inline-block p-3  rounded-lg   text-2xl">
                        <MdOutlineAttachEmail />
                    </span>

                    <h2 className="mt-4 text-lg font-semibold text-gray-900 ">Chat to Sales</h2>
                    <p className="mt-2 text-sm  ">Speak to our friendly team.</p>
                    <p className="mt-2 text-sm  ">support@quicbus.com</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-lg md:p-6 ">
                    <span className="inline-block p-3  rounded-lg  ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                    </span>

                    <h2 className="mt-4 text-lg font-semibold text-gray-900 ">Visit Us</h2>
                    <p className="mt-2 text-sm  ">Visit our office HQ.</p>
                    <p className="mt-2 text-sm  ">Dhaka,Bangladesh</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-lg md:p-6 ">
                    <span className="inline-block p-3  rounded-lg   text-2xl">
                        <FaPhone />
                    </span>

                    <h2 className="mt-4 text-lg font-semibold text-gray-900 ">Call Us</h2>
                    <p className="mt-2 text-sm  ">Mon-Fri from 8am to 5pm.</p>
                    <p className="mt-2 text-sm  ">+1 (555) 000-0000</p>
                </div>
            </div>



            {/* lets message me */}
            <div className="bg-white py-16">
                <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg shadow-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32">
                    <div className="flex flex-col justify-between">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-gray-900">Let's talk!</h2>
                            <p className="">Vivamus in nisl metus? Phasellus.</p>
                        </div>
                        <img src="assets/svg/doodle.svg" alt="Decorative Doodle" className="p-6 h-52 md:h-64" />
                    </div>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="text-sm text-gray-700">Full name</label>
                            <input id="name" type="text" placeholder="Your full name" className="w-full p-3 rounded border border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-200 transition duration-300" />
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm text-gray-700">Email</label>
                            <input id="email" type="email" placeholder="Your email address" className="w-full p-3 rounded border border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-200 transition duration-300" />
                        </div>
                        <div>
                            <label htmlFor="message" className="text-sm text-gray-700">Message</label>
                            <textarea id="message" placeholder="Your message" className="w-full p-3 rounded border border-gray-300 focus:border-violet-500 focus:ring focus:ring-violet-200 transition duration-300"></textarea>
                        </div>
                        <button type="submit" className="w-full p-3 text-sm font-bold tracking-wide uppercase rounded bg-violet-600 text-white hover:bg-violet-700 transition duration-300">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Contact;