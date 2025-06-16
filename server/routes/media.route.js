import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("video"), async (req, res) => {
  try {
    console.log("[media.route] Received video upload request");

    if (!req.file) {
      console.log("[media.route] No video file provided");
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }

    console.log("[media.route] Uploading video to Cloudinary:", req.file);

    const result = await uploadMedia(req.file.path, "video", "lectures");
    if (!result?.secure_url) {
      console.error("[media.route] Video upload to Cloudinary failed");
      return res.status(500).json({
        success: false,
        message: "Failed to upload video to Cloudinary",
      });
    }

    console.log("[media.route] Video uploaded successfully:", {
      secure_url: result.secure_url,
      public_id: result.public_id,
    });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      videoUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("[media.route] Error uploading file:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
});

export default router;
