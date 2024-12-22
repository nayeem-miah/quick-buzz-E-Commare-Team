import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
// Uncomment if needed: import useAuth from '../../../hooks/useAuth';

// Interface for User (Uncomment if needed)
// interface User {
//   photoURL?: string;
// }
import logo from "../../../src/assets/Image/logo2.png";
import MenuDropdown from "./MenuDropdawn";
import useAuth from "../../Hooks/UseAuth";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useAuth();
  const { singleUser } = useFetchSingleUser(user?.email);
  // console.log(singleUser);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#b962f2]  shadow-lg z-50 ">
      <div className="container t px-6 py-4 mx-auto md:flex md:justify-between md:items-center">
        <div className="flex items-center justify-between">
          <Link to={"/"}>
            <img className="lg:w-48 h-12 sm:h-20" src={logo} alt="Logo" />
          </Link>

          {/* মোবাইল মেনু বাটন */}
          <div className="flex md:hidden  lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className=" focus:outline-none"
              aria-label="toggle menu"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <AiOutlineMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`${
            isOpen
              ? "translate-x-0 opacity-100 bg-white"
              : "opacity-0 -translate-x-full"
          } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out   md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center`}
        >
          <div className="flex flex-col md:flex-row md:mx-6  text-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500  font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  : " font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
              }
            >
              HOME
            </NavLink>

            <NavLink
              to="/product"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500  font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  : " font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
              }
            >
              PRODUCT
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500  font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  : " font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
              }
            >
              ABOUT
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-500  font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                  : " font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
              }
            >
              CONTACT
            </NavLink>
            <span className="block md:hidden ">
              {user ? (
                <div className="space-y-5 font-bold uppercase mt-3">
                  <div>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-500  font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                          : " font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                      }
                    >
                      Dashboard
                    </NavLink>
                  </div>

                  <div>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-500  font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                          : " font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                      }
                    >
                      My profile
                    </NavLink>
                  </div>
                  <div>
                    {singleUser?.role === "user" && (
                      <NavLink
                        to="/become-host"
                        className={({ isActive }) =>
                          isActive
                            ? "text-blue-500  font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                            : " font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                        }
                      >
                        Become a Seller
                      </NavLink>
                    )}
                  </div>
                  <div
                    onClick={logOut}
                    className="  font-bold my-2  transition-colors duration-300 transform hover:text-red-500  md:mx-4 md:my-0"
                  >
                    Logout
                  </div>
                </div>
              ) : (
                <div className="space-y-3 font-bold uppercase mt-3">
                  <div className=" ">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-500  font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0 "
                          : " font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                      }
                    >
                      Login
                    </NavLink>
                  </div>
                  <div className=" ">
                    <NavLink
                      to="/signup"
                      className={({ isActive }) =>
                        isActive
                          ? "text-blue-500  font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                          : " font-bold my-2  transition-colors duration-300 transform hover:text-blue-300 dark:hover:text-blue-400 md:mx-4 md:my-0"
                      }
                    >
                      Sign Up
                    </NavLink>
                  </div>
                </div>
              )}
            </span>
          </div>

          {/* <div className="flex justify-center md:block">
            <a href="#" className="relative text-gray-700 transition-colors duration-300 transform hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.707 15.293A1 1 0 005.414 17H17M17 17a2 2 0 102 2 2 2 0 00-2-2zM9 19a2 2 0 11-2 2 2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute top-0 left-0 p-1 text-xs text-white bg-blue-500 rounded-full"></span>
            </a>
          </div> */}
          <div className="hidden md:block">
            <MenuDropdown></MenuDropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
