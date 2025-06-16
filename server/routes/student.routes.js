import express from "express";
import {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Student Management Routes
router.get("/", isAuthenticated, getAllStudents);
router.post("/add", isAuthenticated, addStudent);
router.put("/:id", isAuthenticated, updateStudent);
router.delete("/:id", isAuthenticated, deleteStudent);

// Handle Invalid Routes
router.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "🚫 Invalid Route. Please check the API documentation.",
  });
});

export default router;
