import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Loader2, ExternalLink } from "lucide-react";
import { DateTimePicker } from "./DateTimePicker";
import { useCreateZoomMeetingMutation } from "@/features/api/zoomApi"; // Import Redux mutation

const ZoomMeetingForm = ({ courseId }) => {
  const [formData, setFormData] = useState({
    topic: "",
    startTime: null,
    duration: "",
  });
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [createZoomMeeting, { isLoading }] = useCreateZoomMeetingMutation(); // Use RTK Query

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startTime) {
      toast.error("Please select a date and time");
      return;
    }
    setErrorMessage(null);

    const zoomData = {
      topic: formData.topic || `Live Class for Course ${courseId}`,
      startTime: formData.startTime.toISOString(),
      duration: parseInt(formData.duration, 10) || 60,
    };

    console.log("Zoom data being sent:", zoomData); // Debug log

    try {
      const response = await createZoomMeeting(zoomData).unwrap(); // Use RTK Query API call
      setMeetingDetails(response); // Store meeting details
      toast.success("Live class scheduled successfully!");
    } catch (err) {
      const errorMsg = err?.data?.error || "Failed to schedule live class";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.error("Zoom meeting creation error:", err);
    }
  };

  const handleReset = () => {
    setFormData({
      topic: "",
      startTime: null,
      duration: "",
    });
    setMeetingDetails(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-4" key={courseId}>
      <h3 className="text-lg font-semibold text-black">
        Schedule a Live Class
      </h3>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <Label htmlFor="topic" className="text-black">
            Meeting Topic
          </Label>
          <Input
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder={`e.g., Live Class for Course ${courseId}`}
            className="w-full bg-white text-black border-gray-300 focus:border-[#C70039]"
            disabled={isLoading}
          />
        </div>
        <div>
          <Label className="text-black">Start Time (UTC)</Label>
          <DateTimePicker
            value={formData.startTime}
            onChange={(date) => setFormData({ ...formData, startTime: date })}
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="duration" className="text-black">
            Duration (minutes)
          </Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 60"
            min="1"
            className="w-full bg-white text-black border-gray-300 focus:border-[#C70039]"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#C70039] text-white hover:bg-gray-800 hover:text-[#C70039]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            "Schedule Live Class"
          )}
        </Button>
      </form>

      {errorMessage && (
        <div className="mt-4 p-4 border rounded-md bg-red-50 text-red-700">
          <h4 className="text-md font-medium">Error</h4>
          <p>{errorMessage}</p>
        </div>
      )}

      {meetingDetails && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100 text-black">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium">Live Class Details</h4>
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-[#C70039] border-[#C70039] hover:bg-[#C70039] hover:text-white"
            >
              Schedule Another
            </Button>
          </div>
          <p className="mt-2">
            <strong>Topic:</strong> {meetingDetails.topic}
          </p>
          <p>
            <strong>Start Time:</strong>{" "}
            {new Date(meetingDetails.startTime).toLocaleString()}
          </p>
          <p>
            <strong>Duration:</strong> {meetingDetails.duration} minutes
          </p>
          {meetingDetails.joinUrl && (
            <p className="mt-2">
              <strong>Join URL:</strong>{" "}
              <a
                href={meetingDetails.joinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C70039] hover:underline flex items-center"
              >
                {meetingDetails.joinUrl}{" "}
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </p>
          )}
          {meetingDetails.startUrl && (
            <p className="mt-2">
              <strong>Start URL (Host):</strong>{" "}
              <a
                href={meetingDetails.startUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C70039] hover:underline flex items-center"
              >
                {meetingDetails.startUrl}{" "}
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ZoomMeetingForm;
