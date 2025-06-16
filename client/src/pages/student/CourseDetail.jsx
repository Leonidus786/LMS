import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { useLoadUserQuery } from "@/features/api/authApi";
import { setUser, logout } from "@/features/authSlice";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const getHTMLContent = (content) => {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object" && content.__html) return content.__html;
  return "";
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((store) => store.auth);

  const { data, isLoading, isError, error } = useGetCourseDetailWithStatusQuery(
    courseId,
    {
      skip: !isAuthenticated || !courseId,
    }
  );

  const {
    data: userData,
    isSuccess,
    isError: userError,
    error: userErrorData,
  } = useLoadUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (isSuccess && userData?.user) {
      dispatch(setUser(userData.user));
    }
    if (userError) {
      console.error("Error fetching user profile:", userErrorData);
      if (userErrorData?.status === 401) {
        dispatch(logout());
        navigate("/login", { replace: true });
      }
    }
  }, [isSuccess, userData, userError, userErrorData, dispatch, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("CourseDetail: Not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isError && error?.status === 401) {
      console.log(
        "CourseDetail: Unauthorized, logging out and redirecting to login"
      );
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [isError, error, dispatch, navigate]);

  const handleContinueCourse = () => {
    if (data?.purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) {
    return (
      <h1>
        Failed to load course details:{" "}
        {error?.data?.message || error?.message || "Unknown error"}
      </h1>
    );
  }

  // Check if data is undefined or null
  if (!data) {
    return <h1>No course data available</h1>;
  }

  const { course, purchased } = data;
  console.log("CourseDetail - Purchased status:", purchased);

  return (
    <div className="space-y-5">
      <div className="bg-[#C70039] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle || "Course Title"}
          </h1>
          <p className="text-base md:text-lg">
            {course?.subTitle || "Course Sub-title"}
          </p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator?.name || "Unknown Creator"}
            </span>
          </p>
          <div className="flex item-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>
              Last Updated {course?.createdAt?.split("T")[0] || "Unknown Date"}
            </p>
          </div>
          <p>Students Enrolled: {course?.enrolledStudents?.length || 0}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: getHTMLContent(course?.description),
            }}
          />
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Course Content</h2>
              <p className="text-sm text-gray-500">
                {course?.lectures?.length || 0} Lectures
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures?.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {purchased || lecture.isPreviewFree ? (
                      <PlayCircle size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </span>
                  <p>{lecture.lectureTitle || "Untitled Lecture"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={course?.lectures?.[0]?.videoUrl}
                  controls={true}
                />
              </div>
              <h1>{course?.lectures?.[0]?.lectureTitle || "Lecture Title"}</h1>
              <Separator className="my-2" />
              <h1 className="text-lg md:text-xl font-semibold">
                Course Price: ₹{course?.coursePrice || "N/A"}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button
                  onClick={handleContinueCourse}
                  className="w-full bg-[#C70039] text-white rounded-full hover:bg-black"
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
