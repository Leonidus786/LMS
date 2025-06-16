import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const { data, isLoading, error } = useGetCreatorCourseQuery();
  const navigate = useNavigate();
  const instanceId = useRef(Math.random().toString(36).substr(2, 9)); // Unique ID for this instance

  console.log(
    `CourseTable instance ${instanceId.current} - API Response from useGetCreatorCourseQuery:`,
    data
  );
  if (error)
    console.log(
      `CourseTable instance ${instanceId.current} - Error fetching courses:`,
      error
    );

  useEffect(() => {
    console.log(
      `CourseTable instance ${instanceId.current} rendered with data:`,
      data
    );
  }, [data]);

  if (isLoading) return <h1>Loading...</h1>;

  const courses = data?.courses || [];
  console.log(
    `CourseTable instance ${instanceId.current} - Courses to render:`,
    courses
  );

  return (
    <div className="w-full mt-15">
      <Button
        onClick={() => navigate(`create`)}
        className="bg-[#C70039] text-white px-6 py-3 ml-1 hover:bg-black"
      >
        Create a new Course
      </Button>
      <div className="overflow-x-auto w-full max-w-full">
        <Table className="w-full">
          <TableCaption>A list of your recent courses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">
                  {course?.coursePrice || "NA"}
                </TableCell>
                <TableCell>
                  <Badge className="bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]">
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>{course.courseTitle}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`${course._id}`)}
                  >
                    <Edit />
                  </Button>
                </TableCell>
              </TableRow>
            )) || (
              <TableRow>
                <TableCell colSpan={4}>No courses found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseTable;
