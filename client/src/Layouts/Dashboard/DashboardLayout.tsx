import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Pages/Dashboard/Dashboard";

const DashboardLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen md:flex w-[100vw] relative left-1/2 -translate-x-1/2 overflow-x-hidden bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Outlet --> Dynamic content */}
      <div className="flex-1 md:ml-64">
        <div className="p-5 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
