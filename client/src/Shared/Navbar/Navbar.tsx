import { AiOutlineMenu } from 'react-icons/ai';
import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-[#5eaaf5]  shadow dark:bg-gray-800">
      <div className="container px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <a href="#">
            <img className="w-auto h-6 sm:h-7" src="https://merakiui.com/images/full-logo.svg" alt="Logo" />
          </a>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
              aria-label="toggle menu"
            >
              <AiOutlineMenu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu open: "block", Menu closed: "hidden" */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:block`}
        >
          <div className="flex flex-col md:flex-row md:mx-6">
            <Link to='/' className="my-2 text-white hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="#">
              HOME
            </Link>
            <Link to='/about'  className="my-2 text-white hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="#">
              ABOUT
            </Link>
            <Link to='/product' className="my-2 text-white hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="#">
              PRODUCT
            </Link>
            <Link to='/contact' className="my-2 text-white hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="#">
              CONTACT
            </Link>
            <Link to='/login'  className="my-2 text-white hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="#">
              LOGIN
            </Link>
            <Link to='/signup'  className="my-2 text-white hover:text-blue-500 dark:hover:text-blue-400 md:mx-4 md:my-0" href="#">
              SIGN UP
            </Link>
            
           {/*  */}
          </div>

          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
