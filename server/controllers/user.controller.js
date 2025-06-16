import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { sendEmail, sendSMS } from "../utils/notifications.js";

export const register = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("Register endpoint hit");
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Register - Missing fields:", { name, email, password });
      }
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase();
    if (process.env.NODE_ENV !== "production") {
      console.log("Register - Received data:", {
        name,
        email: normalizedEmail,
        password,
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Register - User already exists:", existingUser);
      }
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (process.env.NODE_ENV !== "production") {
      console.log("Register - Hashed password before save:", hashedPassword);
    }

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
      enrolledCourses: [],
      photoUrl: "",
    });
    if (process.env.NODE_ENV !== "production") {
      console.log("Register - Created user:", newUser);
    }

    // Verify the user was saved by querying the database
    const savedUser = await User.findOne({ email: normalizedEmail });
    if (process.env.NODE_ENV !== "production") {
      console.log("Register - Verified saved user:", savedUser);
    }

    // Test password comparison immediately after creation
    const isPasswordMatchAfterCreation = await bcrypt.compare(
      password,
      savedUser.password
    );
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "Register - Password match result after creation:",
        isPasswordMatchAfterCreation
      );
    }

    generateToken(res, newUser, "Account created successfully.");
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Register - Error:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to register.",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("Login endpoint hit");
    }
    const { email, password } = req.body;
    if (!email || !password) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Login - Missing fields:", { email, password });
      }
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase();
    if (process.env.NODE_ENV !== "production") {
      console.log("Login - Received data:", {
        email: normalizedEmail,
        password,
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Login - User not found with email:", normalizedEmail);
      }
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password." });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Login - Found user:", {
        email: user.email,
        password: user.password,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (process.env.NODE_ENV !== "production") {
      console.log("Login - Password match result:", isPasswordMatch);
    }
    if (!isPasswordMatch) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Login - Password mismatch for user:", user.email);
      }
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email or password." });
    }

    generateToken(
      res,
      user,
      `Welcome back, ${user.name}`,
      user.forcePasswordChange
    );
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Login - Error:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to login.",
      error: error.message,
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.log(error);
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to logout." });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found." });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.log(error);
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to load user." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;
    const profilePhoto = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    let updatedData = { name, email: email ? email.toLowerCase() : user.email };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (profilePhoto) {
      if (user.photoUrl) {
        const publicId = user.photoUrl.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      const cloudResponse = await uploadMedia(profilePhoto.path);
      updatedData.photoUrl = cloudResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");
    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.log(error);
    }
    return res
      .status(500)
      .json({ success: false, message: "Failed to update profile." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new passwords are required" });
    }

    // Find the user (req.user is set by isAuthenticated middleware)
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and reset forcePasswordChange flag
    user.password = hashedPassword;
    user.forcePasswordChange = false;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

export const addStudent = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone number are required.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

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

export const generateToken = (
  res,
  user,
  message,
  forcePasswordChange = false
) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Changed from "1d" to "7d"
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    sameSite: "strict", // Add sameSite to prevent CSRF issues
  });

  return res.status(200).json({
    success: true,
    message,
    token, // Include the token in the response body
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      forcePasswordChange,
    },
  });
};
