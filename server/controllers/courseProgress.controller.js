import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    console.log("getCourseProgress - Course ID:", courseId, "User ID:", userId);

    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");
    if (!courseDetails) {
      console.log("Course not found for ID:", courseId);
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in getCourseProgress:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course progress.",
      error: error.message,
    });
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    console.log(
      "updateLectureProgress - Course ID:",
      courseId,
      "Lecture ID:",
      lectureId,
      "User ID:",
      userId
    );

    if (!userId) {
      console.log("No userId found in request.");
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    if (!courseId || !lectureId) {
      console.log("Missing courseId or lectureId.");
      return res.status(400).json({
        success: false,
        message: "Course ID and Lecture ID are required.",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found for ID:", courseId);
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Verify the lecture exists in the course
    const lectureExists = course.lectures.some(
      (lecture) => lecture._id.toString() === lectureId
    );
    if (!lectureExists) {
      console.log(
        "Lecture not found for ID:",
        lectureId,
        "in Course:",
        courseId
      );
      return res.status(404).json({
        success: false,
        message: "Lecture not found in this course.",
      });
    }

    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: course.lectures.map((lecture) => ({
          lectureId: lecture._id,
          viewed: false,
        })),
      });
      console.log("Created new CourseProgress:", courseProgress);
    }

    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId.toString() === lectureId
    );

    if (lectureIndex !== -1) {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed
    ).length;

    if (course.lectures.length === lectureProgressLength) {
      courseProgress.completed = true;
    }

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in updateLectureProgress:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture progress.",
      error: error.message,
    });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    console.log("markAsCompleted - Course ID:", courseId, "User ID:", userId);

    if (!userId) {
      console.log("No userId found in request.");
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found for ID:", courseId);
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    console.log("Course Progress Found:", courseProgress);

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: course.lectures.map((lecture) => ({
          lectureId: lecture._id,
          viewed: false,
        })),
      });
      console.log("Created new CourseProgress:", courseProgress);
    }

    courseProgress.lectureProgress = courseProgress.lectureProgress.map(
      (lectureProgress) => ({
        ...lectureProgress,
        viewed: true,
      })
    );
    courseProgress.completed = true;
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as completed.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in markAsCompleted:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as completed.",
      error: error.message,
    });
  }
};

export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    console.log("markAsInCompleted - Course ID:", courseId, "User ID:", userId);

    if (!userId) {
      console.log("No userId found in request.");
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("Course not found for ID:", courseId);
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    console.log("Course Progress Found:", courseProgress);

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: course.lectures.map((lecture) => ({
          lectureId: lecture._id,
          viewed: false,
        })),
      });
      console.log("Created new CourseProgress:", courseProgress);
    }

    courseProgress.lectureProgress = courseProgress.lectureProgress.map(
      (lectureProgress) => ({
        ...lectureProgress,
        viewed: false,
      })
    );
    courseProgress.completed = false;
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as incompleted.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error in markAsInCompleted:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as incompleted.",
      error: error.message,
    });
  }
};
