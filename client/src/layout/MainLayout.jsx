import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Sidebar from "../pages/admin/Sidebar";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar for admin routes */}
      {isAdminRoute && isAuthenticated && user?.role === "instructor" && (
        <Sidebar />
      )}
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 pt-16 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MainLayout);
