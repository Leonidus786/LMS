import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  return (
    <div className="flex-1 p-6 mt-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl text-gray-900 dark:text-white">
          Add detail information regarding course
        </h1>
        <Link to="lecture">
          {/* bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] px-4 py-2 */}
          <Button variant="link" className="hover:text-[#C70039]">
            Go to lectures page
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  );
};

export default EditCourse;
