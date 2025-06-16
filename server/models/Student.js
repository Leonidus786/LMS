import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  courseEnrolled: { type: String, required: true },
});

// ✅ Named Export (NOT Default)
export const Student = mongoose.model("Student", StudentSchema);
