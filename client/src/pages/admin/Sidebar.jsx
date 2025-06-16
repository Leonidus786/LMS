// D:\lms\client\src\pages\admin\Sidebar.jsx
import {
  ChartNoAxesColumn,
  Layers,
  SquareLibrary,
  Users,
  UserCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-[250px] sm:w-[300px] border-r border-gray-300 dark:border-gray-700 dark:bg-[#141414] p-5 sticky top-0 h-screen flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <h1 className="text-lg font-bold text-[#C70039]">Digital CourseAI</h1>
      </div>
      <nav className="space-y-4 flex flex-col">
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            location.pathname === "/admin/dashboard"
              ? "bg-[#C70039] text-white"
              : "hover:bg-[#C70039] hover:text-white"
          }`}
        >
          <ChartNoAxesColumn size={22} />
          <h1>Dashboard</h1>
        </Link>
        <Link
          to="/admin/course"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            location.pathname === "/admin/course"
              ? "bg-[#C70039] text-white"
              : "hover:bg-[#C70039] hover:text-white"
          }`}
        >
          <SquareLibrary size={22} />
          <h1>Courses</h1>
        </Link>
        <Link
          to="/admin/batches"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            location.pathname === "/admin/batches"
              ? "bg-[#C70039] text-white"
              : "hover:bg-[#C70039] hover:text-white"
          }`}
        >
          <Layers size={22} />
          <h1>Batch Management</h1>
        </Link>
        <Link
          to="/admin/students"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            location.pathname === "/admin/students"
              ? "bg-[#C70039] text-white"
              : "hover:bg-[#C70039] hover:text-white"
          }`}
        >
          <Users size={22} />
          <h1>Student Management</h1>
        </Link>
        <Link
          to="/admin/instructors"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            location.pathname === "/admin/instructors"
              ? "bg-[#C70039] text-white"
              : "hover:bg-[#C70039] hover:text-white"
          }`}
        >
          <UserCheck size={22} />
          <h1>Instructor Management</h1>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
