/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { AiOutlineBars } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import { FaHistory, FaListAlt } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import { GoGitPullRequestClosed } from "react-icons/go";
import { GrLogout } from "react-icons/gr";
import { HiUsers } from "react-icons/hi2";
import { MdLocalGroceryStore, MdOutlineAddCircleOutline, MdOutlinePayment } from "react-icons/md";
import { RiGitClosePullRequestFill } from "react-icons/ri";
import { TbBrandBooking } from "react-icons/tb";
import { Link, NavLink } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import logo from "../../../src/assets/Image/logo2.png";
import useAuth from "../../Hooks/UseAuth";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";
import LoadingSpinner from "../../Shared/Loading";

const Sidebar: React.FC = () => {
  const { logOut, user } = useAuth();
  const [isActive, setActive] = useState(false);

  if (!user?.email) {
    return <h1>User email not available</h1>;
  }

  const { singleUser, loading } = useFetchSingleUser(user?.email);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (!singleUser) {
    return <h1>User not Found</h1>;
  }

  const handleToggle = () => {
    setActive(!isActive);
  };

  const activeClass = "bg-orange-50 text-orange-600 flex items-center px-4 py-2.5 my-1.5 rounded-xl transition-all duration-300 font-bold";
  const inactiveClass = "text-gray-600 hover:bg-gray-50 hover:text-orange-500 flex items-center px-4 py-2.5 my-1.5 rounded-xl transition-all duration-300 font-medium";

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      {isActive && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-20 md:hidden transition-all duration-300"
          onClick={handleToggle}
        />
      )}

      {/* Small Screen Navbar */}
      <div className="flex justify-between md:hidden bg-white border-b border-gray-100 items-center px-4 py-2 w-full z-20 relative">
        <Helmet>
          <title>quickBuzz | Dashboard Page </title>
        </Helmet>
        <div>
          <div className="block cursor-pointer py-2 font-bold">
            <Link to="/">
              <img src={logo} alt="logo" className="w-24 h-auto" />
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-2 rounded-lg text-gray-600 focus:outline-none focus:bg-gray-50"
        >
          <AiOutlineBars className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-30 fixed flex flex-col justify-between overflow-y-auto bg-white w-64 space-y-6 px-3 py-6 inset-y-0 left-0 transform ${
          isActive ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-300 ease-in-out border-r border-gray-100 h-screen`}
      >
        <div className="flex flex-col">
          <div className="w-full hidden md:flex px-4 py-3 justify-center items-center bg-gray-50/50 rounded-xl border border-gray-100/80 mx-auto">
            <Link to="/">
              <img src={logo} alt="logo" className="w-28 h-auto object-contain" />
            </Link>
          </div>

          {/* Nav Items */}
          <div className="mt-6 md:mt-8">
            <nav className="space-y-1">
              {/* ADMIN ROLE */}
              {singleUser?.role === "admin" && (
                <>
                  <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <BsGraphUp className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                    <span className="mx-4">Statistics</span>
                  </NavLink>

                  <NavLink to="manage-bookings" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <TbBrandBooking className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">Manage products</span>
                  </NavLink>

                  <NavLink to="manage-users" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <HiUsers className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">Manage Users</span>
                  </NavLink>

                  <NavLink to="all-payment-history" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <FaHistory className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">All payment history</span>
                  </NavLink>

                  <NavLink to="all-host-request" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <RiGitClosePullRequestFill className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">All Host Request</span>
                  </NavLink>
                </>
              )}

              {/* HOST ROLE */}
              {singleUser?.role === "Host" && (
                <>
                  <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <BsGraphUp className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">Overview</span>
                  </NavLink>

                  <NavLink to="host-add-product" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <MdOutlineAddCircleOutline className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">Add Product</span>
                  </NavLink>

                  <NavLink to="host-manage-booking" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <TbBrandBooking className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">Manage Booking</span>
                  </NavLink>

                  <NavLink to="my-host-listings" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <FaListAlt className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">My Listings</span>
                  </NavLink>
                </>
              )}

              {/* USER ROLE */}
              {singleUser?.role === "user" && (
                <>
                  <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <BsGraphUp className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">Overview</span>
                  </NavLink>

                  <NavLink to="my-listings" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <MdLocalGroceryStore className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">My Cart</span>
                  </NavLink>

                  <NavLink to="my-orders" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <FiPackage className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">My Orders</span>
                  </NavLink>

                  <NavLink to="my-payment-history" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <MdOutlinePayment className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">My payment history</span>
                  </NavLink>

                  <NavLink to="seller-request" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                    <GoGitPullRequestClosed className="w-5 h-5 text-gray-400" />
                    <span className="mx-4">Become a Seller</span>
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>

        <div>
          <hr className="border-gray-100 my-4" />

          {/* Profile Menu & Logout */}
          <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            <FcSettings className="w-5 h-5 text-gray-400" />
            <span className="mx-4">Profile</span>
          </NavLink>

          <button
            onClick={logOut}
            className="flex w-full items-center px-4 py-2.5 my-3 text-gray-500 hover:bg-red-50 text-red-500 rounded-xl transition-all duration-300 font-medium"
          >
            <GrLogout className="w-5 h-5 text-red-400" />
            <span className="mx-4">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
