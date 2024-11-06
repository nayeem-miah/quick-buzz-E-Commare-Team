import React from "react";
const Contact: React.FC = () => {
    return (
        <div className="py-24">
            <div className="grid grid-cols-1 gap-12 mt-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-white rounded-lg shadow-lg md:p-6 dark:bg-gray-800">
                    <span className="inline-block p-3 text-blue-600 rounded-lg bg-blue-100 dark:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </span>

                    <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Chat to Sales</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Speak to our friendly team.</p>
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">hello@merakiui.com</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-lg md:p-6 dark:bg-gray-800">
                    <span className="inline-block p-3 text-blue-600 rounded-lg bg-blue-100 dark:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                    </span>

                    <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Visit Us</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Visit our office HQ.</p>
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">100 Smith Street Collingwood VIC 3066 AU</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-lg md:p-6 dark:bg-gray-800">
                    <span className="inline-block p-3 text-blue-600 rounded-lg bg-blue-100 dark:bg-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                    </span>

                    <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Call Us</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Mon-Fri from 8am to 5pm.</p>
                    <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">+1 (555) 000-0000</p>
                </div>
            </div>



            {/* lets message me */}
            <div className="bg-white py-16">
                <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg shadow-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32">
                    <div className="flex flex-col justify-between">
                        <div className="space-y-2">
                            <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-gray-900">Let's talk!</h2>
                            <p className="text-gray-600">Vivamus in nisl metus? Phasellus.</p>
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