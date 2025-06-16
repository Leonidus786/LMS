import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Course from "./Course.jsx";

const MyLearning = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    token,
  } = useSelector((store) => store.auth);

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
    isSuccess: userSuccess,
    isUninitialized: userUninitialized,
    refetch: refetchUser,
  } = useLoadUserQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: purchasedData,
    isLoading: purchasedLoading,
    isError: purchasedError,
    error: purchasedErrorData,
    isSuccess: purchasedSuccess,
    isUninitialized: purchasedUninitialized,
  } = useGetPurchasedCoursesQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    console.log("MyLearning: Rendering");
    console.log("MyLearning: Authentication State:", {
      isAuthenticated,
      user,
      token,
    });
    console.log("MyLearning: User Query State:", {
      userLoading,
      userError,
      userErrorData,
      userSuccess,
      userData,
      userUninitialized,
    });
    console.log("MyLearning: Purchased Courses Query State:", {
      purchasedLoading,
      purchasedError,
      purchasedErrorData,
      purchasedSuccess,
      purchasedData,
      purchasedUninitialized,
    });
  }, [
    isAuthenticated,
    user,
    token,
    userLoading,
    userError,
    userErrorData,
    userSuccess,
    userData,
    userUninitialized,
    purchasedLoading,
    purchasedError,
    purchasedErrorData,
    purchasedSuccess,
    purchasedData,
    purchasedUninitialized,
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("MyLearning: Not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (
    authLoading ||
    (userLoading && !userUninitialized) ||
    (purchasedLoading && !purchasedUninitialized)
  ) {
    console.log("MyLearning: Rendering loading state");
    return <MyLearningSkeleton />;
  }

  if (userError) {
    console.error("MyLearning: Error fetching user profile:", userErrorData);
    if (userErrorData?.status === 401) {
      console.log("MyLearning: Unauthorized user, redirecting to login");
      navigate("/login", { replace: true });
      return null;
    }
    return (
      <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
        <p className="text-red-600">
          Error loading user data:{" "}
          {userErrorData?.data?.message || userErrorData?.message}
        </p>
      </div>
    );
  }

  if (purchasedError) {
    console.error(
      "MyLearning: Error fetching purchased courses:",
      purchasedErrorData
    );
    if (purchasedErrorData?.status === 401) {
      console.log(
        "MyLearning: Unauthorized purchased courses, redirecting to login"
      );
      navigate("/login", { replace: true });
      return null;
    }
    return (
      <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
        <p className="text-red-600">
          Error loading courses:{" "}
          {purchasedErrorData?.data?.message || purchasedErrorData?.message}
        </p>
      </div>
    );
  }

  const enrolledCourses = Array.isArray(userData?.user?.enrolledCourses)
    ? userData.user.enrolledCourses
    : [];
  const purchasedCourses = Array.isArray(purchasedData?.purchases)
    ? purchasedData.purchases
    : [];

  console.log("MyLearning: Enrolled and Purchased Courses:", {
    enrolledCourses,
    purchasedCourses,
  });

  const courses = enrolledCourses.map((courseId) => {
    const purchasedCourse = purchasedCourses.find((p) => {
      if (!p.courseId || !p.courseId._id) return false;
      return p.courseId._id.toString() === courseId.toString();
    });
    if (
      !purchasedCourse ||
      !purchasedCourse.courseId ||
      !purchasedCourse.courseId.courseTitle
    ) {
      console.warn(
        "MyLearning: Missing course data for courseId:",
        courseId,
        purchasedCourse
      );
    }
    return {
      _id: courseId,
      courseTitle:
        purchasedCourse?.courseId?.courseTitle || "Course Data Missing",
      courseThumbnail: purchasedCourse?.courseId?.courseThumbnail,
      courseLevel: purchasedCourse?.courseId?.courseLevel,
      coursePrice: purchasedCourse?.courseId?.coursePrice,
      creator: purchasedCourse?.courseId?.creator,
    };
  });

  console.log("MyLearning: Rendered Courses:", courses);

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
      <h1 className="font-bold text-2xl text-black dark:text-white">
        MY LEARNING
      </h1>

      <div className="my-5">
        {courses.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            You are not enrolled in any course.
          </p>
        ) : (
          <>
            <h1 className="font-medium text-lg text-black dark:text-white">
              Courses you're enrolled in.
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
              {courses.map((course) => (
                <Course key={course._id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Skeleton Component for Loading State
const MyLearningSkeleton = () => (
  <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
    <h1 className="font-bold text-2xl text-black dark:text-white">
      MY LEARNING
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

export default MyLearning;
