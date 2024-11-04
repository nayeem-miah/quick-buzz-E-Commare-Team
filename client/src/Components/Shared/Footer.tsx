import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaGithub, FaLinkedinIn, FaLocationArrow, FaPhone } from "react-icons/fa";
import { MdOutlineAttachEmail } from "react-icons/md";

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div>
            <footer className="px-4 divide-y font-bold">
                <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
                    <div className="lg:w-1/3">
                        <a rel="noopener noreferrer" href="#" className="flex justify-center space-x-3 lg:justify-start">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full dark:bg-violet-600">
                               icon
                            </div>
                            <span className="self-center text-2xl font-semibold">quicBus</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4 font-bold">
                        <div className="space-y-3">
                            <h3 className="tracking-wide uppercase font-bold">Our Services</h3>

                            <ul>
                                <li><Link className='hover:text-blue-700 hover:underline' to="/">24/7 Customer Support.</Link></li>
                                <li><Link className='hover:text-blue-700 hover:underline' to="/">Shipping Information</Link></li>
                                <li><Link className='hover:text-blue-700 hover:underline' to="/">FAQs</Link></li>
                                <li><Link className='hover:text-blue-700 hover:underline' to="/">Order Tracking</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-3 font-bold">
                            <h3 className="tracking-wide uppercase font-bold">pages</h3>
                            <ul className="space-y-1">
                                <li className='hover:text-blue-700 hover:underline'>
                                    <Link to={'/'}>
                                        Home
                                    </Link>
                                </li>
                                <li className='hover:text-blue-700 hover:underline'>
                                    <Link to={'/'}>
                                        Product
                                    </Link>
                                </li>
                                <li className='hover:text-blue-700 hover:underline'>
                                    <Link to={'/'}>
                                        about
                                    </Link>
                                </li>
                                <li className='hover:text-blue-700 hover:underline'>
                                    <Link to={'/'}>
                                        contact
                                    </Link>
                                </li>

                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="uppercase font-bold">Developers</h3>
                            <ul className="space-y-1">
                                <li>
                                    <a className='hover:text-blue-700 hover:underline' href="#">Nayeem</a>
                                </li>
                                <li>
                                    <a className='hover:text-blue-700 hover:underline' href="#">Rakib</a>
                                </li>

                            </ul>
                        </div>
                        <div className="space-y-3">
                            <div className="uppercase font-bold">contact us</div>
                            <ul>
                                <li className='flex items-center gap-2 font-bold'><MdOutlineAttachEmail />
                                    <span>support@quicbus.com</span></li>
                                <li className='flex items-center gap-2 font-bold'><FaPhone/> <span>+8801849317388</span></li>
                                <li className='flex items-center gap-2 font-bold'> <FaLocationArrow/><span>Dhaka,Bangladesh</span></li>
                            </ul>
                            <div className="flex justify-start space-x-3">
                                <a rel="noopener noreferrer" href="#" title="Facebook" className="flex items-center p-1 text-xl">
                                    <FaFacebook />
                                </a>
                                <a rel="noopener noreferrer" href="#" title="Linkedin" className="flex items-center p-1 text-xl">
                                    <FaLinkedinIn />
                                </a>
                                <a href="https://github.com/nayeem-miah" target='_blank' title="Github" className="flex items-center p-1 text-xl">
                                    <FaGithub />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-6 text-sm text-center "> <p>© {currentYear} quickBus. All rights reserved.</p></div>
            </footer>
        </div>
    );
};

export default Footer;