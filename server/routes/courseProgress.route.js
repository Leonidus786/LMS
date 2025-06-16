import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  getCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  updateLectureProgress,
} from "../controllers/courseProgress.controller.js";

const router = express.Router();

router.route("/:courseId").get(isAuthenticated, getCourseProgress);
router
  .route("/:courseId/lecture/:lectureId/view")
  .put(isAuthenticated, updateLectureProgress); // Change POST to PUT
router.route("/completed/:courseId").put(isAuthenticated, markAsCompleted); // Match frontend
router.route("/incompleted/:courseId").put(isAuthenticated, markAsInCompleted); // Match frontend

export default router;
