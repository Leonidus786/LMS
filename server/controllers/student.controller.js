import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendEmail, sendSMS } from "../utils/notifications.js";

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("getAllStudents - Fetching students for admin");
    }

    const students = await User.find({ role: "student" }).select("-password");
    if (process.env.NODE_ENV !== "production") {
      console.log("getAllStudents - Fetched students:", students);
    }

    return res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in getAllStudents:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students.",
      error: error.message,
    });
  }
};

// Add new student
export const addStudent = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone number are required.",
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Generate a temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8); // e.g., "a1b2c3d4"
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Create the new student
    const newStudent = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student",
      phoneNumber,
      forcePasswordChange: true,
      enrolledCourses: [],
      batches: [],
      photoUrl: "",
    });

    // Send email with userId (email) and temporary password
    const emailSubject = "Welcome to Digital CourseAI - Your Account Details";
    const emailText = `
      Dear ${name},

      Your account has been created successfully. Here are your login details:

      User ID (Email): ${email}
      Temporary Password: ${temporaryPassword}

      Please log in at http://localhost:5173/login and change your password after your first sign-in.

      Best regards,
      Digital CourseAI Team
    `;
    await sendEmail(email, emailSubject, emailText);

    // Send SMS with userId (email) and temporary password
    const smsText = `Welcome to Digital CourseAI! Your User ID: ${email}, Temporary Password: ${temporaryPassword}. Log in at http://localhost:5173/login and change your password.`;
    await sendSMS(phoneNumber, smsText);

    return res.status(201).json({
      success: true,
      message: "Student added successfully. Email and SMS sent.",
      student: {
        _id: newStudent._id,
        name: newStudent.name,
        email: newStudent.email,
        phoneNumber: newStudent.phoneNumber,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in addStudent:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to add student.",
      error: error.message,
    });
  }
};

// Edit student
export const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body, role: "student" }, // Ensure role remains "student"
      { new: true }
    ).select("-password");
    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      student: updatedStudent,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in updateStudent:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update student.",
      error: error.message,
    });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in deleteStudent:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to delete student.",
      error: error.message,
    });
  }
};
