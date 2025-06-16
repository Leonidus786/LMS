import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String, // For pre-recorded lectures
    },
    publicId: { type: String }, // Cloudinary video storage
    isPreviewFree: { type: Boolean },

    // 🔹 Live Class Fields (New)
    isLiveClass: { type: Boolean, default: false }, // Identify if it's a live lecture
    meetingId: { type: String }, // Zoom Meeting ID
    startUrl: { type: String }, // Instructor Start URL
    joinUrl: { type: String }, // Student Join URL
    password: { type: String },
    startTime: { type: Date }, // Scheduled meeting time
    duration: { type: Number }, // Duration in minutes

    // 🔹 Relationships
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Link to Instructor
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Link to Course
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);
