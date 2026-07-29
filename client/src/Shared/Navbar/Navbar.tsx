import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdLocalGroceryStore } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../src/assets/Image/logo2.png";
import useAuth from "../../Hooks/UseAuth";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";
import useAxiosPublic from "../../Hooks/UsePublic";
import MenuDropdown from "./MenuDropdawn";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useAuth();
  const { singleUser } = useFetchSingleUser(user?.email as string);
  const axiosPublic = useAxiosPublic();

  // Query cart items for count
  const { data: allsave = [] } = useQuery({
    queryKey: ["allsave", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosPublic.get(`/cart/${user.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  return (
    <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-80 backdrop-blur-lg shadow-sm border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center">
        {/* Left: Logo */}
        <Link to={"/"} className="flex-shrink-0 flex items-center">
          <img className="w-24 sm:w-28 lg:w-36 h-auto object-contain" src={logo} alt="Logo" />
        </Link>

        {/* Center: Desktop NavLinks */}
        <div className="hidden md:flex items-center gap-6 font-bold text-sm tracking-wide">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-orange-500 transition-colors duration-300"
                : "text-gray-800 hover:text-orange-500 transition-colors duration-300"
            }
          >
            HOME
          </NavLink>
          <NavLink
            to="/product"
            className={({ isActive }) =>
              isActive
                ? "text-orange-500 transition-colors duration-300"
                : "text-gray-800 hover:text-orange-500 transition-colors duration-300"
            }
          >
            PRODUCT
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-orange-500 transition-colors duration-300"
                : "text-gray-800 hover:text-orange-500 transition-colors duration-300"
            }
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-orange-500 transition-colors duration-300"
                : "text-gray-800 hover:text-orange-500 transition-colors duration-300"
            }
          >
            CONTACT
          </NavLink>
        </div>

        {/* Right: Cart and Dropdown (Desktop) or Hamburger + Cart (Mobile) */}
        <div className="flex items-center gap-3">
          {/* Cart Icon (Desktop) */}
          <div className="hidden md:block">
            {user && singleUser?.role === "user" && (
              <Link
                to="/dashboard/my-listings"
                className="relative flex items-center justify-center p-2 text-orange-500 hover:text-orange-600 transition duration-300"
              >
                <MdLocalGroceryStore size={25} />
                {allsave.length > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    {allsave.length}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Profile Dropdown (Desktop) */}
          <div className="hidden md:block">
            <MenuDropdown />
          </div>

          {/* Cart Icon (Mobile) */}
          <div className="block md:hidden flex items-center mr-1">
            {user && singleUser?.role === "user" && (
              <Link
                to="/dashboard/my-listings"
                className="relative flex items-center justify-center p-2 text-orange-500"
              >
                <MdLocalGroceryStore size={24} />
                {allsave.length > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                    {allsave.length}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Hamburger Icon (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="md:hidden text-gray-800 hover:text-orange-500 focus:outline-none transition duration-300"
            aria-label="toggle menu"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <AiOutlineMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col p-6 space-y-4 font-semibold text-gray-800 z-50">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "text-orange-500 text-base font-bold transition-colors"
                : "hover:text-orange-500 transition-colors text-base text-gray-700"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/product"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "text-orange-500 text-base font-bold transition-colors"
                : "hover:text-orange-500 transition-colors text-base text-gray-700"
            }
          >
            Product
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "text-orange-500 text-base font-bold transition-colors"
                : "hover:text-orange-500 transition-colors text-base text-gray-700"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "text-orange-500 text-base font-bold transition-colors"
                : "hover:text-orange-500 transition-colors text-base text-gray-700"
            }
          >
            Contact
          </NavLink>

          <hr className="border-gray-100 my-1" />

          {/* User Specific Mobile Links */}
          {user ? (
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-500 text-base font-bold transition-colors"
                    : "hover:text-orange-500 transition-colors text-base text-gray-700"
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-500 text-base font-bold transition-colors"
                    : "hover:text-orange-500 transition-colors text-base text-gray-700"
                }
              >
                My Profile
              </NavLink>
              {singleUser?.role === "user" && (
                <>
                  <NavLink
                    to="/dashboard/my-listings"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-orange-500 text-base font-bold transition-colors"
                        : "hover:text-orange-500 transition-colors text-base text-gray-700"
                    }
                  >
                    My Cart
                  </NavLink>
                  <NavLink
                    to="/become-host"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      isActive
                        ? "text-orange-500 text-base font-bold transition-colors"
                        : "hover:text-orange-500 transition-colors text-base text-gray-700"
                    }
                  >
                    Become a Seller
                  </NavLink>
                </>
              )}
              <div
                onClick={() => {
                  logOut();
                  setIsOpen(false);
                }}
                className="text-red-500 hover:text-red-600 cursor-pointer transition-colors text-base"
              >
                Logout
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-500 text-base font-bold transition-colors"
                    : "hover:text-orange-500 transition-colors text-base text-gray-700"
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-500 text-base font-bold transition-colors"
                    : "hover:text-orange-500 transition-colors text-base text-gray-700"
                }
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
