import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar"; // Replacing Header with Navbar
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Section */}
      <div className="flex flex-col flex-1">
        <Navbar /> {/* Navbar is placed correctly at the top */}
        <main className="p-4 flex-1 overflow-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Admin;
