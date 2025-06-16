import express from "express";
import axios from "axios";
import { getZoomToken } from "../utils/zoom.js";
import { Lecture } from "../models/lecture.model.js"; // Import the Lecture model

const router = express.Router();

router.post("/create-meeting", async (req, res) => {
  try {
    const { topic, startTime, duration, instructorId, courseId } = req.body;

    const token = await getZoomToken();

    // Create Zoom Meeting
    const meetingDetails = {
      topic: topic || "LMS Live Class",
      type: 2, // Scheduled meeting
      start_time: startTime,
      duration: duration || 60, // Duration in minutes
      timezone: "UTC",
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
      },
    };

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      meetingDetails,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Save Meeting Details in MongoDB
    const newLecture = new Lecture({
      lectureTitle: topic,
      isLiveClass: true,
      meetingId: response.data.id,
      startUrl: response.data.start_url,
      joinUrl: response.data.join_url,
      password: response.data.password,
      startTime,
      duration,
      instructor: instructorId,
      course: courseId,
    });

    await newLecture.save();

    res.json({
      success: true,
      lecture: newLecture,
    });
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create meeting" });
  }
});

export default router;
