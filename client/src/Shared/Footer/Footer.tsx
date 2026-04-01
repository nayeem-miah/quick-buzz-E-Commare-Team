import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowRight
} from 'react-icons/fa';
import icon from '../../../src/assets/Image/logo2.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-[#0a0a0a] text-gray-300 pt-16 pb-8 border-t border-gray-800 overflow-hidden mt-10">
      {/* Decorative gradient background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 relative">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to={'/'} className="inline-block group">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20 group-hover:rotate-3 flex justify-center items-center w-14 h-14">
                  <img src={icon} alt="QuickBuzz Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">QuickBuzz</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Your ultimate destination for premium products. Experience seamless shopping with quick delivery and 24/7 customer support.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/na.ye.em.711869/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-blue-500/25 hover:-translate-y-1">
                <FaFacebookF />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-300 shadow-md hover:shadow-blue-400/25 hover:-translate-y-1">
                <FaLinkedinIn />
              </a>
              <a href="https://github.com/nayeem-miah" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800/80 flex items-center justify-center text-gray-400 hover:bg-gray-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-gray-500/25 hover:-translate-y-1">
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-blue-500 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['Home', 'Product', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group text-sm font-medium"
                  >
                    <span className="text-transparent group-hover:text-blue-500 transition-colors mr-2 text-xs">
                      <FaArrowRight />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-purple-500 rounded-full"></span>
              Our Services
            </h3>
            <ul className="space-y-3">
              {[
                { name: '24/7 Customer Support', link: '/contact' },
                { name: 'Shipping Information', link: '/about' },
                { name: 'FAQs', link: '/' },
                { name: 'Order Tracking', link: '/product' },
              ].map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.link}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center group text-sm font-medium"
                  >
                    <span className="text-transparent group-hover:text-purple-500 transition-colors mr-2 text-xs">
                      <FaArrowRight />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-emerald-500 rounded-full"></span>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-xl bg-gray-800/80 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Email</p>
                  <a href="mailto:support@quickbuzz.com" className="text-sm font-medium hover:text-emerald-400 transition-colors">support@quickbuzz.com</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-xl bg-gray-800/80 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                  <FaPhoneAlt size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                  <a href="tel:+8801849317388" className="text-sm font-medium hover:text-blue-400 transition-colors">+880 1849-317388</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-xl bg-gray-800/80 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
                  <FaMapMarkerAlt size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                  <p className="text-sm font-medium text-gray-300">Dhaka, Bangladesh</p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} <span className="text-gray-300 font-semibold">QuickBuzz</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Developed by</span>
            <a href="https://nayeem-miah.vercel.app" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-400 hover:text-blue-400 transition-colors">Nayeem</a>
            <span>&</span>
            <a href="https://rakibul-xi.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-400 hover:text-blue-400 transition-colors">Rakib</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
