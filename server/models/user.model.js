import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["instructor", "student"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
      },
    ],
    photoUrl: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    forcePasswordChange: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving, but only if it's not already hashed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Check if the password is already hashed (starts with $2a$ or $2b$)
  if (this.password && this.password.startsWith("$2a$")) {
    return next(); // Skip re-hashing if the password is already hashed
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Exclude password field when returning user data
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
export default User;
