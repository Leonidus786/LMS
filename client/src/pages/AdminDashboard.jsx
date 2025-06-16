import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Assuming you're using Redux for user auth
import BatchManagement from "./admin/batch/BatchManagement";
import Dashboard from "../pages/admin/Dashboard";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Get user info from Redux

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // Redirect students to home page (Courses.jsx)
    }
  }, [user, navigate]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Dashboard />
      <BatchManagement />
    </div>
  );
};

export default AdminDashboard;
