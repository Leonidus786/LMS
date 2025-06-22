import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./database/db.js";

// Import Routes
import userRoutes from "./routes/user.route.js";
import courseRoutes from "./routes/course.route.js";
import mediaRoutes from "./routes/media.route.js";
import purchaseCourseRoutes from "./routes/purchaseCourse.route.js";
import courseProgressRoutes from "./routes/courseProgress.route.js";
import zoomRoutes from "./routes/zoom.route.js";
import batchRoutes from "./routes/batch.route.js";
import instructorRoutes from "./routes/instructor.routes.js";
import studentRoutes from "./routes/student.routes.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const _dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Register API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/purchase", purchaseCourseRoutes);
app.use("/api/v1/progress", courseProgressRoutes);
app.use("/api/v1/zoom", zoomRoutes);
app.use("/api/v1/batches", batchRoutes);
app.use("/api/v1/instructors", instructorRoutes);
app.use("/api/v1/students", studentRoutes);

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("💥 Error:", err.message);
  }
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Performing graceful shutdown...");
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("Received SIGINT. Performing graceful shutdown...");
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});
