import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  try {
    // Generate a JWT for the user
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Unique payload
      process.env.JWT_SECRET, // Use the constant secret key
      { expiresIn: "1d" } // Token valid for 1 day
    );

    // Log token only in development for debugging
    if (process.env.NODE_ENV !== "production") {
      console.log(`🔍 Generated JWT for user ${user._id}:`, token);
    }

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "Lax", // Allows cross-site login without CSRF issues
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json({
      success: true,
      message,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Token Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
