import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Course from "./Course";
import {
  useUpdateUserMutation,
  useLoadUserQuery,
} from "@/features/api/authApi";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import { setUser } from "@/features/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState();

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    token,
  } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
    error: userErrorData,
    refetch,
    isSuccess: userSuccess,
    isUninitialized: userUninitialized,
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
    console.log("Profile: Authentication State:", {
      isAuthenticated,
      user,
      token,
    });
    console.log("Profile: User Query State:", {
      userLoading,
      userError,
      userErrorData,
      userSuccess,
      userData,
      userUninitialized,
    });
    console.log("Profile: Purchased Courses Query State:", {
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
      console.log("Profile: Not authenticated, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (userSuccess && userData?.user) {
      dispatch(setUser(userData.user));
    }
    if (userError) {
      console.error("Error fetching user profile:", userErrorData);
      if (userErrorData?.status === 401) {
        navigate("/login", { replace: true });
      }
    }
  }, [userSuccess, userData, userError, userErrorData, dispatch, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    console.log("Updating User with:", { name, profilePhoto });

    await updateUser(formData);
    refetch();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(updateUserData?.message || "Profile updated successfully.");
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to update profile.");
      if (error?.status === 401) {
        navigate("/login", { replace: true });
      }
    }
  }, [updateUserData, isSuccess, isError, error, navigate]);

  if (
    authLoading ||
    (userLoading && !userUninitialized) ||
    (purchasedLoading && !purchasedUninitialized)
  ) {
    console.log("Profile: Rendering loading state");
    return <h1>Profile Loading...</h1>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (userError) {
    console.error("Error fetching user profile:", userErrorData);
    if (userErrorData?.status === 401) {
      navigate("/login", { replace: true });
      return null;
    }
    return (
      <div className="max-w-4xl mx-auto px-4 my-10">
        <p className="text-red-600">
          Error loading user data:{" "}
          {userErrorData?.data?.message || userErrorData?.message}
        </p>
      </div>
    );
  }

  if (purchasedError) {
    console.error("Error fetching purchased courses:", purchasedErrorData);
    if (purchasedErrorData?.status === 401) {
      navigate("/login", { replace: true });
      return null;
    }
    return (
      <div className="max-w-4xl mx-auto px-4 my-10">
        <p className="text-red-600">
          Error loading courses:{" "}
          {purchasedErrorData?.data?.message || purchasedErrorData?.message}
        </p>
      </div>
    );
  }

  const enrolledCourses = userData?.user?.enrolledCourses || [];
  const purchasedCourses = purchasedData?.purchases || [];

  const courses = enrolledCourses.map((courseId) => {
    const purchasedCourse = purchasedCourses.find(
      (p) => p.courseId?._id.toString() === courseId.toString()
    );
    if (
      !purchasedCourse ||
      !purchasedCourse.courseId ||
      !purchasedCourse.courseId.courseTitle
    ) {
      console.warn(
        "Profile: Missing course data for courseId:",
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

  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="Profile"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-[#C70039] ml-2">
              Name:
              <span className="font-normal text-gray-700 dark:text-[#C70039] ml-2">
                {user?.name || "N/A"}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-[#C70039] ml-2">
              Email:
              <span className="font-normal text-gray-700 dark:text-[#C70039] ml-2">
                {user?.email || "N/A"}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-[#C70039] ml-2">
              Role:
              <span className="font-normal text-gray-700 dark:text-[#C70039] ml-2">
                {user?.role?.toUpperCase() || "USER"}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="mt-2 bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="col-span-1 text-right">Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="col-span-3 border rounded-md px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="col-span-1 text-right">Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3 border rounded-md px-3 py-2 file:bg-gray-100 file:rounded-md"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                  className="mt-2 bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please Wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in.</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {courses.length > 0 ? (
            courses.map((course) => <Course course={course} key={course._id} />)
          ) : (
            <h1>You haven't enrolled yet</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
