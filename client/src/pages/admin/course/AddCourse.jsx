import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };
  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  // for displaying toast
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course created.");
      navigate("/admin/course");
    }
  }, [isSuccess, error]);
  return (
    <div className="flex-1 mx-10 mt-15">
      <div className="mb-4 ">
        <h1 className="font-bold text-xl">
          Let&#39;s add course, add some basic course details for your new
          course.
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione,
          unde.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your Course Name"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
              <SelectGroup>
                <SelectLabel className="text-white">Category</SelectLabel>
                <SelectItem
                  value="Diploma in Digital Marketing"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Diploma in Digital Marketing
                </SelectItem>
                <SelectItem
                  value="Digital Marketing"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Digital Marketing
                </SelectItem>
                <SelectItem
                  value="Data Structures and Algorithms"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Data Structures and Algorithms
                </SelectItem>
                <SelectItem
                  value="Diploma in AI & Machine Learning"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Diploma in AI & Machine Learning
                </SelectItem>
                <SelectItem
                  value="Diploma in Data Science & ML"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Diploma in Data Science & ML
                </SelectItem>
                <SelectItem
                  value="Diploma in UI/UX"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Diploma in UI/UX
                </SelectItem>
                <SelectItem
                  value="Data Analytics & Business Analytics"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Data Analytics & Business Analytics
                </SelectItem>
                <SelectItem
                  value="Fullstack Developement"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Fullstack Developement
                </SelectItem>
                <SelectItem
                  value="Python Developement"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Python Developement
                </SelectItem>
                <SelectItem
                  value="Data Vizualization"
                  className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  Data Vizualization
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/course")}
            className="mt-2 bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
          >
            Back
          </Button>
          <Button
            disabled={isLoading}
            onClick={createCourseHandler}
            className="ml-2 mt-2 bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] "
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
