import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    batchName: { type: String, required: true, unique: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of students
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Batch = mongoose.model("Batch", batchSchema);
