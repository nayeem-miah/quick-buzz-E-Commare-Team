import React from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../../Pages/Dashboard/Dashboard";
import NotificationDropdown from "../../Shared/Navbar/NotificationDropdown";

const DashboardLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen md:flex w-full bg-white">
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3.5 px-6 hidden md:flex justify-between items-center z-40">
          <h1 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Dashboard Panel
          </h1>
          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <span className="h-5 w-px bg-gray-200" />
            <Link to="/profile" className="text-xs font-bold text-gray-600 hover:text-orange-500 transition">
              Profile Page
            </Link>
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
