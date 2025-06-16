import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({});

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

export const uploadMedia = async (
  file,
  resourceType = "auto",
  folder = "media"
) => {
  try {
    console.log("[uploadMedia] Uploading file:", file);
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: resourceType,
      folder: folder,
    });
    console.log("[uploadMedia] Upload successful:", uploadResponse);
    fs.unlinkSync(file); // Clean up the local file
    return uploadResponse;
  } catch (error) {
    console.error("[uploadMedia] Error:", error);
    throw error; // Throw the error so the route handler can catch it
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    console.log("[deleteMediaFromCloudinary] Deleting:", publicId);
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("[deleteMediaFromCloudinary] Error:", error);
    throw error;
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    console.log("[deleteVideoFromCloudinary] Deleting:", publicId);
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.error("[deleteVideoFromCloudinary] Error:", error);
    throw error;
  }
};
