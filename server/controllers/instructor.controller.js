import { Instructor } from "../models/Instructor.js"; // ✅ Correct Named Import

// ✅ Get all instructors
export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find();
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add new instructor
export const addInstructor = async (req, res) => {
  try {
    const { name, email, phone, expertise } = req.body;
    const newInstructor = new Instructor({ name, email, phone, expertise });
    await newInstructor.save();
    res.status(201).json(newInstructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Edit instructor
export const updateInstructor = async (req, res) => {
  try {
    const updatedInstructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedInstructor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete instructor
export const deleteInstructor = async (req, res) => {
  try {
    await Instructor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
