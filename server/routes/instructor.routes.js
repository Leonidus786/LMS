import express from "express";
import {
  getAllInstructors,
  addInstructor,
  updateInstructor,
  deleteInstructor,
} from "../controllers/instructor.controller.js"; // ✅ Correct import

const router = express.Router();

router.get("/", getAllInstructors);
router.post("/add", addInstructor);
router.put("/edit/:id", updateInstructor);
router.delete("/delete/:id", deleteInstructor);

export default router; // ✅ Ensure it's an ES module export
