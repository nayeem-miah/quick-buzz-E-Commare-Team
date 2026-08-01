import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../Pages/Dashboard/Dashboard";
import NotificationDropdown from "../../Shared/Navbar/NotificationDropdown";
import useAuth from "../../Hooks/UseAuth";

const DashboardLayout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen md:flex w-full bg-white">
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16 px-6 hidden md:flex justify-end items-center z-40">
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            
            {user && (
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="flex items-center gap-2.5 pl-3 border-l border-gray-200 cursor-pointer group focus:outline-none"
                title="View Profile"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-orange-500/20 group-hover:border-orange-500/50 shadow-sm transition-all duration-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold border border-orange-200 group-hover:border-orange-400 transition-all duration-300">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-gray-800 group-hover:text-orange-500 transition-colors duration-200">
                    {user.displayName || "My Profile"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">
                    {user.email}
                  </p>
                </div>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 bg-gray-50/20">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
