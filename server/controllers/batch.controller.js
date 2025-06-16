import { Batch } from "../models/batch.model.js";
import { Course } from "../models/course.model.js"; // Import Course model
import User from "../models/user.model.js";

// ✅ Create a new batch
export const createBatch = async (req, res) => {
  try {
    const { batchName, courseId, instructorId, startDate, endDate } = req.body;

    // Validate required fields
    if (!batchName || !courseId || !instructorId || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the instructor exists and has the "instructor" role
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== "instructor") {
      return res.status(403).json({
        error: "Instructor not found or user is not an instructor",
      });
    }

    // Check if a batch with the same name already exists
    const existingBatch = await Batch.findOne({ batchName });
    if (existingBatch) {
      return res.status(400).json({ error: "Batch name already exists" });
    }

    // Create the batch
    const newBatch = new Batch({
      batchName,
      course: courseId,
      instructor: instructorId,
      startDate,
      endDate,
      students: [],
    });

    await newBatch.save();

    // Add the batch to the course's batches array
    course.batches = course.batches || [];
    course.batches.push(newBatch._id);
    await course.save();

    res.status(201).json({
      message: "Batch created successfully!",
      batch: newBatch,
    });
  } catch (error) {
    console.error("Error creating batch:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Failed to create batch" });
  }
};

// ✅ Assign Students to a Batch
export const addStudentsToBatch = async (req, res) => {
  try {
    const { batchId, studentIds } = req.body;

    // Validate required fields
    if (
      !batchId ||
      !studentIds ||
      !Array.isArray(studentIds) ||
      studentIds.length === 0
    ) {
      return res.status(400).json({
        error: "Batch ID and a non-empty array of student IDs are required",
      });
    }

    // Check if the batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }

    // Verify that all student IDs are valid and have the "student" role
    const students = await User.find({
      _id: { $in: studentIds },
      role: "student",
    });
    if (students.length !== studentIds.length) {
      return res.status(400).json({
        error: "One or more student IDs are invalid or not students",
      });
    }

    // Add students to the batch (avoid duplicates)
    const studentIdsToAdd = students.map((s) => s._id.toString());
    batch.students = [
      ...new Set([
        ...batch.students.map((id) => id.toString()),
        ...studentIdsToAdd,
      ]),
    ];
    await batch.save();

    // Add the batch to each student's batches array (avoid duplicates)
    await User.updateMany(
      { _id: { $in: studentIds } },
      { $addToSet: { batches: batchId } }
    );

    res.status(200).json({
      message: "Students added to batch successfully",
      batch,
    });
  } catch (error) {
    console.error("Error adding students:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Failed to add students to batch" });
  }
};

// ✅ Get All Batches
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate(
      "course instructor students",
      "courseTitle name email"
    );

    if (!batches || batches.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No batches found",
        batches: [],
      });
    }

    res.status(200).json({
      success: true,
      batches,
    });
  } catch (error) {
    console.error("Error fetching batches:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
};
