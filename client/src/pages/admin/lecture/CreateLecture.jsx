import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { useCreateZoomMeetingMutation } from "@/features/api/zoomApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";
import ZoomMeetingForm from "@/components/ZoomMeetingForm";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [isLiveClass, setIsLiveClass] = useState(false);
  const [zoomDetails, setZoomDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { isLoading: lectureLoading, isSuccess, error }] =
    useCreateLectureMutation();
  const {
    data: lectureData,
    isLoading: lecturesLoading,
    isError: lecturesError,
    refetch,
  } = useGetCourseLectureQuery(courseId);
  const [createZoomMeeting] = useCreateZoomMeetingMutation();

  const handleZoomSubmit = async (zoomData) => {
    try {
      const response = await createZoomMeeting(zoomData).unwrap();
      console.log("Zoom meeting response:", response);
      setZoomDetails(response);
      toast.success("Live class scheduled successfully!");
      return response;
    } catch (err) {
      const errorMsg = err?.data?.error || "Failed to schedule live class";
      toast.error(errorMsg);
      console.error("Zoom meeting error:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      setErrorMessage("Lecture title is required");
      return;
    }
    if (isLiveClass && !zoomDetails) {
      toast.error("Please schedule a live class before creating the lecture");
      setErrorMessage(
        "Please schedule a live class before creating the lecture"
      );
      return;
    }

    const lecturePayload = {
      lectureTitle,
      courseId,
      ...(zoomDetails && {
        zoomMeetingId: zoomDetails.meetingId,
        joinUrl: zoomDetails.joinUrl,
        startUrl: zoomDetails.startUrl,
      }),
    };
    console.log("Lecture payload being sent:", lecturePayload);

    try {
      await createLecture(lecturePayload).unwrap();
      toast.success("Lecture created successfully!");
      refetch(); // Refresh lectures list
      // Reset form
      setLectureTitle("");
      setZoomDetails(null);
      setIsLiveClass(false);
      setErrorMessage(null);
    } catch (err) {
      const errorMsg = err?.data?.message || "Failed to create lecture";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.error("Lecture creation error:", err);
    }
  };

  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl text-black">
          Add Lectures or Schedule Live Classes
        </h1>
        <p className="text-sm text-gray-600">
          Add a lecture or schedule a live class. Enable the live class option
          to set a date and time.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-4 border rounded-md bg-red-50 text-red-700">
          <h4 className="text-md font-medium">Error</h4>
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-black">Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Lecture or Live Class Title"
            className="bg-white text-black border-gray-300 focus:border-[#C70039]"
            disabled={lectureLoading}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="liveClass"
            checked={isLiveClass}
            onChange={() => setIsLiveClass(!isLiveClass)}
            className="accent-[#C70039]"
            disabled={lectureLoading}
          />
          <Label htmlFor="liveClass" className="text-black">
            Schedule as a Live Class (Zoom)
          </Label>
        </div>

        {isLiveClass && (
          <ZoomMeetingForm courseId={courseId} onSubmit={handleZoomSubmit} />
        )}

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className="mt-2 bg-[#C70039] text-white cursor-pointer hover:bg-gray-800 hover:text-[#C70039]"
            disabled={lectureLoading}
          >
            Back to Course
          </Button>
          <Button
            type="submit"
            disabled={
              lectureLoading ||
              (isLiveClass && !zoomDetails) ||
              !lectureTitle.trim()
            }
            className="ml-2 mt-2 bg-[#C70039] text-white cursor-pointer hover:bg-gray-800 hover:text-[#C70039]"
          >
            {lectureLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-10">
        {lecturesLoading ? (
          <p className="text-black">Loading lectures...</p>
        ) : lecturesError ? (
          <p className="text-red-500">Failed to load lectures.</p>
        ) : lectureData?.lectures.length === 0 ? (
          <p className="text-black">No lectures available</p>
        ) : (
          lectureData.lectures.map((lecture, index) => (
            <Lecture
              key={lecture._id}
              lecture={lecture}
              courseId={courseId}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
