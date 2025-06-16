import User from "../models/user.model.js"; // Adjust path if needed

const isAdmin = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    console.log("🔍 Checking Admin Role:", req.user.role);

    // Fetch user from DB if necessary (already done in isAuthenticated)
    const user = await User.findById(req.user.id);

    // Check if user exists and has an admin role
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access Denied! Admins only." });
    }

    next(); // Proceed if admin
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default isAdmin;
