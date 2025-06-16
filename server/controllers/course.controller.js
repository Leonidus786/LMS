// import { Course } from "../models/course.model.js";
// import { Lecture } from "../models/lecture.model.js";
// import {
//   deleteMediaFromCloudinary,
//   deleteVideoFromCloudinary,
//   uploadMedia,
// } from "../utils/cloudinary.js";

// export const createCourse = async (req, res) => {
//   try {
//     const { courseTitle, category } = req.body;
//     if (!courseTitle || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "Course title and category are required",
//       });
//     }

//     const course = await Course.create({
//       courseTitle,
//       category,
//       creator: req.user.id,
//     });

//     return res.status(201).json({
//       success: true,
//       course,
//       message: "Course created.",
//     });
//   } catch (error) {
//     console.error(`Error in createCourse: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create course",
//       error: error.message,
//     });
//   }
// };

// export const searchCourse = async (req, res) => {
//   try {
//     const { query = "", categories = [], sortByPrice = "" } = req.query;
//     console.log("Categories received:", categories);

//     const searchCriteria = {
//       isPublished: true,
//       $or: [
//         { courseTitle: { $regex: query, $options: "i" } },
//         { subTitle: { $regex: query, $options: "i" } },
//         { category: { $regex: query, $options: "i" } },
//       ],
//     };

//     if (categories.length > 0) {
//       searchCriteria.category = { $in: categories };
//     }

//     const sortOptions = {};
//     if (sortByPrice === "low") {
//       sortOptions.coursePrice = 1;
//     } else if (sortByPrice === "high") {
//       sortOptions.coursePrice = -1;
//     }

//     const courses = await Course.find(searchCriteria)
//       .populate({ path: "creator", select: "name photoUrl" })
//       .sort(sortOptions);

//     return res.status(200).json({
//       success: true,
//       courses: courses || [],
//     });
//   } catch (error) {
//     console.error(`Error in searchCourse: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to search courses",
//       error: error.message,
//     });
//   }
// };

// export const getPublishedCourse = async (_, res) => {
//   try {
//     const courses = await Course.find({ isPublished: true }).populate({
//       path: "creator",
//       select: "name photoUrl",
//     });

//     return res.status(200).json({
//       success: true,
//       courses: courses || [],
//       message: courses.length ? undefined : "No published courses found.",
//     });
//   } catch (error) {
//     console.error(`Error in getPublishedCourse: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to get published courses",
//       error: error.message,
//     });
//   }
// };

// export const getCreatorCourses = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const courses = await Course.find({ creator: userId });

//     return res.status(200).json({
//       success: true,
//       courses: courses || [],
//       message: courses.length ? undefined : "No courses found.",
//     });
//   } catch (error) {
//     console.error(`Error in getCreatorCourses: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch courses",
//       error: error.message,
//     });
//   }
// };

// export const editCourse = async (req, res) => {
//   try {
//     const courseId = req.params.courseId;
//     const {
//       courseTitle,
//       subTitle,
//       description,
//       category,
//       courseLevel,
//       coursePrice,
//     } = req.body;
//     const thumbnail = req.file;

//     let course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     let courseThumbnail;
//     if (thumbnail) {
//       if (course.courseThumbnail) {
//         const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
//         console.log(`Deleting old thumbnail with publicId: ${publicId}`);
//         await deleteMediaFromCloudinary(publicId);
//       }
//       courseThumbnail = await uploadMedia(thumbnail.path);
//     }

//     const updateData = {
//       courseTitle,
//       subTitle,
//       description,
//       category,
//       courseLevel,
//       coursePrice,
//       courseThumbnail: courseThumbnail?.secure_url || course.courseThumbnail,
//     };

//     course = await Course.findByIdAndUpdate(courseId, updateData, {
//       new: true,
//     });

//     return res.status(200).json({
//       success: true,
//       course,
//       message: "Course updated successfully.",
//     });
//   } catch (error) {
//     console.error(`Error in editCourse: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update course",
//       error: error.message,
//     });
//   }
// };

// export const getCourseById = async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     const course = await Course.findById(courseId);

//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     // Ensure category is a string (not an array)
//     course.category = Array.isArray(course.category)
//       ? course.category[0]
//       : course.category;

//     return res.status(200).json({
//       success: true,
//       course,
//     });
//   } catch (error) {
//     console.error(`Error in getCourseById: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to get course by id",
//       error: error.message,
//     });
//   }
// };

// export const createLecture = async (req, res) => {
//   try {
//     const { lectureTitle } = req.body;
//     const { courseId } = req.params;

//     if (!lectureTitle || !courseId) {
//       return res.status(400).json({
//         success: false,
//         message: "Lecture title and course ID are required",
//       });
//     }

//     const lecture = await Lecture.create({ lectureTitle });
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     course.lectures.push(lecture._id);
//     await course.save();

//     return res.status(201).json({
//       success: true,
//       lecture,
//       message: "Lecture created successfully.",
//     });
//   } catch (error) {
//     console.error(`Error in createLecture: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create lecture",
//       error: error.message,
//     });
//   }
// };

// export const getCourseLecture = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const course = await Course.findById(courseId).populate("lectures");
//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       lectures: course.lectures || [],
//     });
//   } catch (error) {
//     console.error(`Error in getCourseLecture: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to get lectures",
//       error: error.message,
//     });
//   }
// };

// export const editLecture = async (req, res) => {
//   try {
//     const { lectureTitle, videoInfo, isPreviewFree } = req.body;
//     const { courseId, lectureId } = req.params;

//     const lecture = await Lecture.findById(lectureId);
//     if (!lecture) {
//       return res.status(404).json({
//         success: false,
//         message: "Lecture not found",
//       });
//     }

//     if (lectureTitle) lecture.lectureTitle = lectureTitle;
//     if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
//     if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
//     if (typeof isPreviewFree !== "undefined")
//       lecture.isPreviewFree = isPreviewFree;

//     await lecture.save();

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     if (!course.lectures.includes(lecture._id)) {
//       course.lectures.push(lecture._id);
//       await course.save();
//     }

//     return res.status(200).json({
//       success: true,
//       lecture,
//       message: "Lecture updated successfully.",
//     });
//   } catch (error) {
//     console.error(`Error in editLecture: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to edit lecture",
//       error: error.message,
//     });
//   }
// };

// export const removeLecture = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const lecture = await Lecture.findByIdAndDelete(lectureId);
//     if (!lecture) {
//       return res.status(404).json({
//         success: false,
//         message: "Lecture not found",
//       });
//     }

//     if (lecture.publicId) {
//       console.log(`Deleting lecture video with publicId: ${lecture.publicId}`);
//       await deleteVideoFromCloudinary(lecture.publicId);
//     }

//     await Course.updateOne(
//       { lectures: lectureId },
//       { $pull: { lectures: lectureId } }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Lecture removed successfully.",
//     });
//   } catch (error) {
//     console.error(`Error in removeLecture: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to remove lecture",
//       error: error.message,
//     });
//   }
// };

// export const getLectureById = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const lecture = await Lecture.findById(lectureId);
//     if (!lecture) {
//       return res.status(404).json({
//         success: false,
//         message: "Lecture not found",
//       });
//     }
//     return res.status(200).json({
//       success: true,
//       lecture,
//     });
//   } catch (error) {
//     console.error(`Error in getLectureById: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to get lecture by id",
//       error: error.message,
//     });
//   }
// };

// export const togglePublishCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const { publish } = req.query;

//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     course.isPublished = publish === "true";
//     await course.save();

//     const statusMessage = course.isPublished ? "Published" : "Unpublished";
//     return res.status(200).json({
//       success: true,
//       message: `Course is ${statusMessage}`,
//     });
//   } catch (error) {
//     console.error(`Error in togglePublishCourse: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update status",
//       error: error.message,
//     });
//   }
// };

// export const deleteCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     console.log(`Attempting to delete course with ID: ${courseId}`);

//     const course = await Course.findById(courseId);
//     if (!course) {
//       console.log(`Course with ID ${courseId} not found`);
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     console.log(`Course found: ${course.courseTitle}`);

//     // Check if the authenticated user is the creator of the course
//     if (course.creator.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized: You can only delete your own courses",
//       });
//     }

//     // Delete associated lectures
//     if (course.lectures && course.lectures.length > 0) {
//       console.log(
//         `Deleting ${course.lectures.length} lectures for course ${courseId}`
//       );
//       for (const lectureId of course.lectures) {
//         const lecture = await Lecture.findById(lectureId);
//         if (lecture) {
//           console.log(`Deleting lecture with ID: ${lectureId}`);
//           if (lecture.publicId) {
//             console.log(
//               `Deleting lecture video from Cloudinary with publicId: ${lecture.publicId}`
//             );
//             await deleteVideoFromCloudinary(lecture.publicId);
//           }
//           await Lecture.findByIdAndDelete(lectureId);
//           console.log(`Lecture ${lectureId} deleted`);
//         } else {
//           console.log(`Lecture with ID ${lectureId} not found`);
//         }
//       }
//     } else {
//       console.log(`No lectures found for course ${courseId}`);
//     }

//     // Delete course thumbnail from Cloudinary
//     if (course.courseThumbnail) {
//       const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
//       console.log(
//         `Deleting course thumbnail from Cloudinary with publicId: ${publicId}`
//       );
//       await deleteMediaFromCloudinary(publicId);
//     } else {
//       console.log(`No thumbnail found for course ${courseId}`);
//     }

//     // Delete the course
//     console.log(`Deleting course ${courseId} from database`);
//     await Course.findByIdAndDelete(courseId);
//     console.log(`Course ${courseId} deleted successfully`);

//     return res.status(200).json({
//       success: true,
//       message: "Course deleted successfully.",
//     });
//   } catch (error) {
//     console.error(`Error in deleteCourse: ${error.message}`);
//     console.error(error.stack);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete course",
//       error: error.message,
//     });
//   }
// };

import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
  uploadMedia,
} from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and category are required",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.user.id,
    });

    return res.status(201).json({
      success: true,
      course,
      message: "Course created.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in createCourse: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;
    if (process.env.NODE_ENV !== "production") {
      console.log("Categories received:", categories);
    }

    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1;
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1;
    }

    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in searchCourse: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to search courses",
      error: error.message,
    });
  }
};

export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });

    return res.status(200).json({
      success: true,
      courses: courses || [],
      message: courses.length ? undefined : "No published courses found.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in getPublishedCourse: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to get published courses",
      error: error.message,
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const courses = await Course.find({ creator: userId });

    return res.status(200).json({
      success: true,
      courses: courses || [],
      message: courses.length ? undefined : "No courses found.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in getCreatorCourses: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        if (process.env.NODE_ENV !== "production") {
          console.log(`Deleting old thumbnail with publicId: ${publicId}`);
        }
        await deleteMediaFromCloudinary(publicId);
      }
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url || course.courseThumbnail,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      course,
      message: "Course updated successfully.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in editCourse: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Ensure category is a string (not an array)
    course.category = Array.isArray(course.category)
      ? course.category[0]
      : course.category;

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in getCourseById: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to get course by id",
      error: error.message,
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Lecture title and course ID are required",
      });
    }

    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      success: true,
      lecture,
      message: "Lecture created successfully.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in createLecture: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture",
      error: error.message,
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      lectures: course.lectures || [],
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in getCourseLecture: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to get lectures",
      error: error.message,
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (typeof isPreviewFree !== "undefined")
      lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      success: true,
      lecture,
      message: "Lecture updated successfully.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in editLecture: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to edit lecture",
      error: error.message,
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    if (lecture.publicId) {
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `Deleting lecture video with publicId: ${lecture.publicId}`
        );
      }
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    await Course.updateOne(
      { lectures: lectureId },
      { $pull: { lectures: lectureId } }
    );

    return res.status(200).json({
      success: true,
      message: "Lecture removed successfully.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in removeLecture: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to remove lecture",
      error: error.message,
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in getLectureById: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture by id",
      error: error.message,
    });
  }
};

export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Course is ${statusMessage}`,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in togglePublishCourse: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (process.env.NODE_ENV !== "production") {
      console.log(`Attempting to delete course with ID: ${courseId}`);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Course with ID ${courseId} not found`);
      }
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`Course found: ${course.courseTitle}`);
    }

    // Check if the authenticated user is the creator of the course
    if (course.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own courses",
      });
    }

    // Delete associated lectures
    if (course.lectures && course.lectures.length > 0) {
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `Deleting ${course.lectures.length} lectures for course ${courseId}`
        );
      }
      for (const lectureId of course.lectures) {
        const lecture = await Lecture.findById(lectureId);
        if (lecture) {
          if (process.env.NODE_ENV !== "production") {
            console.log(`Deleting lecture with ID: ${lectureId}`);
          }
          if (lecture.publicId) {
            if (process.env.NODE_ENV !== "production") {
              console.log(
                `Deleting lecture video from Cloudinary with publicId: ${lecture.publicId}`
              );
            }
            await deleteVideoFromCloudinary(lecture.publicId);
          }
          await Lecture.findByIdAndDelete(lectureId);
          if (process.env.NODE_ENV !== "production") {
            console.log(`Lecture ${lectureId} deleted`);
          }
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.log(`Lecture with ID ${lectureId} not found`);
          }
        }
      }
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log(`No lectures found for course ${courseId}`);
      }
    }

    // Delete course thumbnail from Cloudinary
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `Deleting course thumbnail from Cloudinary with publicId: ${publicId}`
        );
      }
      await deleteMediaFromCloudinary(publicId);
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.log(`No thumbnail found for course ${courseId}`);
      }
    }

    // Delete the course
    if (process.env.NODE_ENV !== "production") {
      console.log(`Deleting course ${courseId} from database`);
    }
    await Course.findByIdAndDelete(courseId);
    if (process.env.NODE_ENV !== "production") {
      console.log(`Course ${courseId} deleted successfully`);
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error in deleteCourse: ${error.message}`);
      console.error(error.stack);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};
