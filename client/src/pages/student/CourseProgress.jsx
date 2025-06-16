import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/features/authSlice";
import { CheckCircle, CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const params = useParams();
  const courseId = params.courseId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authState = useSelector((state) => state.auth);
  console.log("Redux Auth State:", authState);

  const { data, isLoading, isError, error, refetch } =
    useGetCourseProgressQuery(courseId, {
      skip: !courseId || !authState.isAuthenticated,
    });

  const [
    updateLectureProgress,
    { isLoading: updateLoading, error: updateError },
  ] = useUpdateLectureProgressMutation();

  const [
    completeCourse,
    {
      data: markCompleteData,
      isSuccess: completedSuccess,
      isError: completeError,
      error: completeErrorData,
    },
  ] = useCompleteCourseMutation();

  const [
    inCompleteCourse,
    {
      data: markInCompleteData,
      isSuccess: inCompletedSuccess,
      isError: inCompleteError,
      error: inCompleteErrorData,
    },
  ] = useInCompleteCourseMutation();

  const {
    data: userData,
    isSuccess: userSuccess,
    isError: userError,
    error: userErrorData,
    refetch: refetchUser,
  } = useLoadUserQuery(undefined, {
    skip: !authState.isAuthenticated,
  });

  useEffect(() => {
    if (!authState.isAuthenticated) {
      console.log("CourseProgress: Not authenticated, redirecting to login");
      navigate("/login");
    } else {
      refetchUser();
    }
  }, [authState.isAuthenticated, navigate, refetchUser]);

  useEffect(() => {
    if (userSuccess && userData?.user) {
      dispatch(setUser(userData.user));
    }
    if (userError) {
      console.error("Error fetching user profile:", userErrorData);
      if (userErrorData?.status === 401) {
        toast.error("Session expired. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    }
  }, [userSuccess, userError, userData, userErrorData, dispatch, navigate]);

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData?.message || "Course marked as completed.");
    }
    if (completeError) {
      console.error("Complete Course Error:", completeErrorData);
      const errorMessage =
        completeErrorData?.data?.message ||
        "Failed to mark course as completed.";
      if (completeErrorData?.status === 401) {
        toast.error("Session expired. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(
        markInCompleteData?.message || "Course marked as incompleted."
      );
    }
    if (inCompleteError) {
      console.error("InComplete Course Error:", inCompleteErrorData);
      const errorMessage =
        inCompleteErrorData?.data?.message ||
        "Failed to mark course as incompleted.";
      if (inCompleteErrorData?.status === 401) {
        toast.error("Session expired. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    }
  }, [
    completedSuccess,
    completeError,
    inCompletedSuccess,
    inCompleteError,
    markCompleteData,
    markInCompleteData,
    completeErrorData,
    inCompleteErrorData,
    refetch,
    navigate,
  ]);

  const [currentLecture, setCurrentLecture] = useState(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleLectureProgress = useCallback(
    async (lectureId) => {
      if (!lectureId || !courseId) {
        toast.error("Invalid lecture or course ID.");
        return;
      }

      try {
        const response = await updateLectureProgress({
          courseId,
          lectureId,
        }).unwrap();
        refetch();
        toast.success(
          response?.message || "Lecture progress updated successfully."
        );
      } catch (err) {
        console.error("Error updating lecture progress:", err);
        const errorMessage =
          err?.data?.message || "Failed to update lecture progress.";
        if (err?.status === 401) {
          toast.error("Session expired. Please log in again.");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error(errorMessage);
        }
      }
    },
    [courseId, updateLectureProgress, refetch, navigate]
  );

  const isLectureCompleted = useCallback(
    (lectureId) => {
      return (
        data?.data?.progress?.some(
          (prog) => prog.lectureId === lectureId && prog.viewed
        ) || false
      );
    },
    [data]
  );

  const handleSelectLecture = useCallback(
    (lecture) => {
      setCurrentLecture(lecture);
      handleLectureProgress(lecture._id);
    },
    [handleLectureProgress]
  );

  const handleVideoPlay = useCallback(() => {
    if (!hasPlayed) {
      setHasPlayed(true);
      handleLectureProgress(
        currentLecture?._id || data?.data?.courseDetails?.lectures?.[0]?._id
      );
    }
  }, [hasPlayed, handleLectureProgress, currentLecture, data]);

  const handleCompleteCourse = useCallback(async () => {
    try {
      const response = await completeCourse(courseId).unwrap();
      console.log("Complete Course Response:", response);
    } catch (err) {
      console.error("Error marking course as completed:", err);
      const errorMessage =
        err?.data?.message || "Failed to mark course as completed.";
      if (err?.status === 401) {
        toast.error("Session expired. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    }
  }, [courseId, completeCourse, navigate]);

  const handleInCompleteCourse = useCallback(async () => {
    try {
      const response = await inCompleteCourse(courseId).unwrap();
      console.log("InComplete Course Response:", response);
    } catch (err) {
      console.error("Error marking course as incompleted:", err);
      const errorMessage =
        err?.data?.message || "Failed to mark course as incompleted.";
      if (err?.status === 401) {
        toast.error("Session expired. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    }
  }, [courseId, inCompleteCourse, navigate]);

  if (isLoading) return <p>Loading...</p>;
  if (isError)
    return (
      <p>
        Failed to load course details: {error?.data?.message || error.message}
      </p>
    );

  console.log("Course Progress Data:", data);
  const { courseDetails, progress, completed } = data.data || {};
  const { courseTitle, lectures } = courseDetails || {};
  const initialLecture = currentLecture || (lectures && lectures[0]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{courseTitle || "Course Title"}</h1>
        <Button
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
          className="bg-[#C70039] text-white hover:bg-black"
          variant={completed ? "outline" : "default"}
          disabled={updateLoading}
        >
          {completed ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> <span>Completed</span>
            </div>
          ) : (
            "Mark as completed"
          )}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4">
          <div>
            <video
              src={currentLecture?.videoUrl || initialLecture?.videoUrl}
              controls
              className="w-full h-auto md:rounded-lg"
              onPlay={handleVideoPlay}
            />
          </div>
          <div className="mt-2">
            <h3 className="font-medium text-lg">
              {`Lecture ${
                lectures?.findIndex(
                  (lec) =>
                    lec._id === (currentLecture?._id || initialLecture?._id)
                ) + 1 || 1
              } : ${
                currentLecture?.lectureTitle ||
                initialLecture?.lectureTitle ||
                "Untitled"
              }`}
            </h3>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lecture</h2>
          <div className="flex-1 overflow-y-auto">
            {lectures?.map((lecture) => (
              <Card
                key={lecture._id}
                className={`mb-3 hover:cursor-pointer transition transform ${
                  lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:dark:bg-gray-800"
                    : "bg-[#C70039] text-white hover:bg-black"
                }`}
                onClick={() => handleSelectLecture(lecture)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2 size={24} className="text-green-500 mr-2" />
                    ) : (
                      <CirclePlay size={24} className="text-white mr-2" />
                    )}
                    <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle || "Untitled Lecture"}
                      </CardTitle>
                    </div>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge
                      variant={"outline"}
                      className="bg-green-200 text-green-600"
                    >
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
