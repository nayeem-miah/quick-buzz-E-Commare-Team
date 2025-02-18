/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { GrLogout } from "react-icons/gr";
import { FcSettings } from "react-icons/fc";
import { AiOutlineBars } from "react-icons/ai";
import { MdHomeWork } from "react-icons/md";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { TbBrandBooking } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import useAuth from "../../Hooks/UseAuth";
import { BsGraphUp } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { FaHistory } from "react-icons/fa";
import logo from "../../../src/assets/Image/logo2.png";
import { MdOutlinePayment } from "react-icons/md";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";
import LoadingSpinner from "../../Shared/Loading";
import { RiGitClosePullRequestFill } from "react-icons/ri";
import { GoGitPullRequestClosed } from "react-icons/go";
import { Helmet } from "react-helmet-async";

const Sidebar: React.FC = () => {
  const { logOut, user } = useAuth();
  const [isActive, setActive] = useState(false);

  if (!user?.email) {
    return <h1>User email not available</h1>;
  }

  const { singleUser, loading } = useFetchSingleUser(user?.email);
  // console.log(singleUser);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (!singleUser) {
    return <h1>User not Found</h1>;
  }

  // const role: string = "admin";
  // Sidebar Responsive Handler
  const handleToggle = () => {
    setActive(!isActive);
  };

  return (
    <>
      {/* Small Screen Navbar */}
      <div className="  flex justify-between md:hidden">
      <Helmet>
          <title>quickBuzz | Dashboard Page </title>
        </Helmet>
        <div>
          <div className="block cursor-pointer p-4 font-bold">
            <Link to="/">
              <img src={logo} alt="logo" width={100} height={100} />
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar  admin*/}
      {singleUser?.role === "admin" && (
        <div
          className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-[#131826]  w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${
            isActive ? "-translate-x-full" : ""
          } md:translate-x-0 transition duration-200 ease-in-out`}
        >
          <div>
            <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-[#4270B5] mx-auto">
              <Link to="/">
                <img src={logo} alt="logo" width={100} height={100} />
              </Link>
            </div>

            {/* Nav Items */}
            <div className="flex flex-col justify-between flex-1 mt-6">
              {/* Menu Items */}
              <nav>
                {/* Statistics */}
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <BsGraphUp className="w-5 h-5" />
                  <span className="mx-4 font-medium">Statistics</span>
                </NavLink>

                {/* Manage Bookings  */}
                <NavLink
                  to="manage-bookings"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <TbBrandBooking className="w-5 h-5" />
                  <span className="mx-4 font-medium">Manage products</span>
                </NavLink>
                {/* Manage Users */}
                <NavLink
                  to="manage-users"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <HiUsers className="w-5 h-5" />
                  <span className="mx-4 font-medium">Manage Users</span>
                </NavLink>

                {/* My Listing */}
                <NavLink
                  to="all-payment-history"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <FaHistory className="w-5 h-5" />
                  <span className="mx-4 font-medium">All payment history</span>
                </NavLink>
                {/* host request  */}
                <NavLink
                  to="all-host-request"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <RiGitClosePullRequestFill className="w-5 h-5" />
                  <span className="mx-4 font-medium">All Host Request</span>
                </NavLink>
              </nav>
            </div>
          </div>

          <div>
            <hr />

            {/* Profile Menu*/}
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                  isActive ? "bg-gray-300 text-gray-700" : "text-white"
                }`
              }
            >
              <FcSettings className="w-5 h-5" />
              <span className="mx-4 font-medium">Profile</span>
            </NavLink>
            <button
              onClick={logOut}
              className="flex w-full items-center px-4 py-2 mt-5 text-white hover:bg-gray-300 hover:text-gray-700 transition-colors duration-300 transform"
            >
              <GrLogout className="w-5 h-5" />
              <span className="mx-4 font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
      {/* Sidebar  host*/}
      {singleUser?.role === "Host" && (
        <div
          className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-[#131826]  w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${
            isActive ? "-translate-x-full" : ""
          } md:translate-x-0 transition duration-200 ease-in-out`}
        >
          <div>
            <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-[#4270B5] mx-auto">
              <Link to="/">
                <img src={logo} alt="logo" width={100} height={100} />
              </Link>
            </div>

            {/* Nav Items */}
            <div className="flex flex-col  justify-between flex-1 mt-6">
              {/* Menu Items */}
              <nav>
                {/* host Home */}
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <BsGraphUp className="w-5 h-5" />
                  <span className="mx-4 font-medium">Overview</span>
                </NavLink>

                {/* Add Product */}
                <NavLink
                  to="host-add-product"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <MdOutlineAddCircleOutline className="w-5 h-5" />
                  <span className="mx-4 font-medium">Add Product</span>
                </NavLink>
                {/* host-manageBooking */}
                <NavLink
                  to="host-manage-booking"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <TbBrandBooking className="w-5 h-5" />
                  <span className="mx-4 font-medium">Manage Booking</span>
                </NavLink>
                {/* My Listing */}
                <NavLink
                  to="my-host-listings"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <FaListAlt className="w-5 h-5" />
                  <span className="mx-4 font-medium">My Listings</span>
                </NavLink>
              </nav>
            </div>
          </div>

          <div>
            <hr />

            {/* Profile Menu */}
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform ${
                  isActive ? "text-white" : " text-white"
                }`
              }
            >
              <FcSettings className="w-5 h-5" />
              <span className="mx-4 font-medium">Profile</span>
            </NavLink>
            <button
              onClick={logOut}
              className="flex w-full items-center px-4 py-2 mt-5 text-white hover:bg-gray-300 hover:text-gray-700 transition-colors duration-300 transform"
            >
              <GrLogout className="w-5 h-5" />
              <span className="mx-4 font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
      {/* Sidebar  user dashboard*/}
      {singleUser?.role === "user" && (
        <div
          className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-[#131826]  w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${
            isActive ? "-translate-x-full" : ""
          } md:translate-x-0 transition duration-200 ease-in-out`}
        >
          <div>
            <div className="w-full hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-[#4270B5] mx-auto">
              <Link to="/">
                <img src={logo} alt="logo" width={100} height={100} />
              </Link>
            </div>

            {/* Nav Items */}
            <div className="flex flex-col justify-between flex-1 mt-6">
              {/* Menu Items */}
              <nav>
                {/* user home */}
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <BsGraphUp className="w-5 h-5" />
                  <span className="mx-4 font-medium">Overview</span>
                </NavLink>

                {/* My Listing */}
                <NavLink
                  to="my-listings"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <MdHomeWork className="w-5 h-5" />
                  <span className="mx-4 font-medium">My Listings</span>
                </NavLink>

                {/*my-payment-history  */}
                <NavLink
                  to="my-payment-history"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 gap-2 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <MdOutlinePayment className="w-5 h-5" />
                  <span className=" font-medium">My payment history</span>
                </NavLink>
                {/* seller request */}
                <NavLink
                  to="seller-request"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 my-5 gap-2 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                      isActive ? "bg-gray-300 text-gray-700" : "text-white"
                    }`
                  }
                >
                  <GoGitPullRequestClosed className="w-5 h-5" />
                  <span className=" font-medium">Become a seller request</span>
                </NavLink>
              </nav>
            </div>
          </div>

          <div>
            <hr />
            {/*  */}
            {/* Profile Menu */}
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-gray-300 hover:text-gray-700 ${
                  isActive ? "bg-gray-300 text-gray-700" : "text-white"
                }`
              }
            >
              <FcSettings className="w-5 h-5" />
              <span className="mx-4 font-medium">Profile</span>
            </NavLink>
            <button
              onClick={logOut}
              className="flex w-full items-center px-4 py-2 mt-5 text-white hover:bg-gray-300 hover:text-gray-700 transition-colors duration-300 transform"
            >
              <GrLogout className="w-5 h-5" />
              <span className="mx-4 font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
