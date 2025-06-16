import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  expertise: { type: String, required: true },
});

// ✅ Named Export (Not Default)
export const Instructor = mongoose.model("Instructor", InstructorSchema);
