import express from "express";
import {
  getUserProfile,
  login,
  logout,
  register,
  updateProfile,
  addStudent,
  changePassword,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

// User Authentication Routes
router.post("/register", register);
router.post("/login", (req, res, next) => {
  console.log("User Route: /login endpoint hit");
  login(req, res, next);
});
router.get("/logout", logout);

// Protected Routes (Only authenticated users can access)
router.get("/profile", isAuthenticated, (req, res, next) => {
  console.log("User Route: /profile endpoint hit");
  getUserProfile(req, res, next);
});
router.put(
  "/profile/update",
  isAuthenticated,
  upload.single("profilePhoto"),
  updateProfile
);
router.post("/add-student", isAuthenticated, addStudent);
router.post("/change-password", isAuthenticated, changePassword);

// Handle Invalid Routes
router.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "🚫 Invalid Route. Please check the API documentation.",
  });
});

export default router;
