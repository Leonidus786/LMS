import React, { useEffect } from "react";
import { Button } from "./ui/button";
import {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
} from "@/features/api/purchaseApi.js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  // Fetch course details with enrollment status
  const {
    data: courseStatus,
    isLoading: isCheckingStatus,
    isError: isStatusError,
  } = useGetCourseDetailWithStatusQuery(courseId);
  const isEnrolled = courseStatus?.purchased; // Use 'purchased' based on the API response

  const [
    createCheckoutSession,
    { data, isLoading, isSuccess, isError, error },
  ] = useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    await createCheckoutSession(courseId);
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe checkout URL
      } else {
        toast.error("Invalid response from server.");
        console.log("Success but no URL:", data); // Add logging for debugging
      }
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to create checkout session");
      console.error("Error creating checkout session:", error); // Add logging for debugging
    }
  }, [data, isSuccess, isError, error]);

  // Show loading state while checking enrollment status
  if (isCheckingStatus) {
    return <div>Checking enrollment status...</div>;
  }

  // Handle error when checking status
  if (isStatusError) {
    return <div>Error checking enrollment status.</div>;
  }

  // Hide the button if the user is enrolled
  if (isEnrolled) {
    return null; // Or you can show a message: <div>You are already enrolled!</div>
  }

  return (
    <div>
      <Button
        disabled={isLoading}
        onClick={purchaseCourseHandler}
        className="w-full bg-[#C70039] text-white rounded-full hover:bg-black"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Buy Course Button"
        )}
      </Button>
    </div>
  );
};

export default BuyCourseButton;
