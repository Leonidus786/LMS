import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
  let token; // Declare token at the top level to make it accessible in the catch block

  try {
    token = req.cookies?.token;

    if (process.env.NODE_ENV !== "production") {
      console.log("🔍 Checking authentication...");
      console.log("Request Method:", req.method, "URL:", req.url);
      console.log("Cookies:", req.cookies);
      console.log("Headers:", req.headers);
      console.log("JWT_SECRET:", process.env.JWT_SECRET);
    }

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
      if (process.env.NODE_ENV !== "production") {
        console.log("Using token from Authorization header:", token);
      }
    }

    if (!token) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("❌ No authentication token found!");
      }
      return res.status(401).json({
        message: "Authentication required. Please log in.",
        success: false,
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not defined in environment variables!");
      return res.status(500).json({
        message: "Server configuration error.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Token Verified:", decoded);
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("❌ User not found in database for ID:", decoded.id);
      }
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    req.id = user._id;
    req.role = user.role;
    req.email = user.email;

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Authenticated User:", {
        id: req.id,
        role: req.role,
        email: req.email,
        name: user.name,
      });
    }

    next();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ Authentication Middleware Error:", error);
      console.error("Token used:", token); // Now token is accessible
      console.error("JWT_SECRET:", process.env.JWT_SECRET);
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
        success: false,
      });
    }

    return res.status(401).json({
      message: "Invalid or malformed token.",
      success: false,
    });
  }
};

export default isAuthenticated;
