import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-[#C70039] bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 h-full flex flex-col">
        {/* Course Thumbnail */}
        <div className="w-full h-40 bg-gray-100">
          <img
            src={course.courseThumbnail || "https://via.placeholder.com/150"}
            alt={course.courseTitle || "Course"}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>

        {/* Course Details */}
        <CardContent className="px-5 py-4 space-y-3 flex-grow flex flex-col justify-between">
          <h1 className="hover:underline font-bold text-lg truncate">
            {course.courseTitle || "Course Data Missing"}
          </h1>

          {/* Instructor Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    course.creator?.photoUrl || "https://github.com/shadcn.png"
                  }
                  alt={course.creator?.name || "Instructor"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm">
                {course.creator?.name || "Unknown Instructor"}
              </h1>
            </div>

            {/* Course Level Badge */}
            <Badge className="bg-[#C70039] text-white px-2 py-1 text-xs rounded-full transition-all duration-300 hover:bg-black">
              {course.courseLevel || "N/A"}
            </Badge>
          </div>

          {/* Course Price */}
          <div className="text-lg font-bold">
            <span>
              {course.coursePrice ? `₹${course.coursePrice}` : "Free"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
