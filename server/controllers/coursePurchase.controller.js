import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { CourseProgress } from "../models/courseProgress.js";
import { Lecture } from "../models/lecture.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5174";

console.log("[coursePurchase.controller] Loaded CLIENT_URL:", CLIENT_URL);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    if (process.env.NODE_ENV !== "production") {
      console.log("[createCheckoutSession] User ID from req.id:", userId);
    }

    if (!userId) {
      console.log(
        "[createCheckoutSession] Validation failed: User ID not found"
      );
      return res.status(401).json({
        success: false,
        message: "User ID not found. Please log in again.",
      });
    }

    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      console.log(
        "[createCheckoutSession] Validation failed: Invalid course ID",
        courseId
      );
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.log(
        "[createCheckoutSession] Validation failed: Stripe secret key not configured"
      );
      return res
        .status(500)
        .json({ success: false, message: "Stripe secret key not configured" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      console.log("[createCheckoutSession] Course not found for ID:", courseId);
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("[createCheckoutSession] Course data:", {
        courseId: course._id,
        courseTitle: course.courseTitle,
        coursePrice: course.coursePrice,
        courseThumbnail: course.courseThumbnail,
      });
    }

    if (!course.courseTitle) {
      console.log(
        "[createCheckoutSession] Validation failed: Course title is required"
      );
      return res
        .status(400)
        .json({ success: false, message: "Course title is required" });
    }

    if (!course.coursePrice || course.coursePrice <= 0) {
      console.log(
        "[createCheckoutSession] Validation failed: Course price must be greater than 0"
      );
      return res.status(400).json({
        success: false,
        message: "Course price must be greater than 0",
      });
    }

    const unitAmount = course.coursePrice * 100;
    if (unitAmount < 50) {
      console.log(
        "[createCheckoutSession] Validation failed: Course price must be at least 0.50 INR"
      );
      return res.status(400).json({
        success: false,
        message: "Course price must be at least 0.50 INR",
      });
    }

    const existingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });
    if (existingPurchase) {
      console.log(
        "[createCheckoutSession] User already purchased this course:",
        userId,
        courseId
      );
      return res.status(400).json({
        success: false,
        message: "You have already purchased this course",
      });
    }

    const successUrl = `${CLIENT_URL}/course-progress/${courseId}`;
    const cancelUrl = `${CLIENT_URL}/course-detail/${courseId}`;
    if (process.env.NODE_ENV !== "production") {
      console.log("[createCheckoutSession] Success URL:", successUrl);
      console.log("[createCheckoutSession] Cancel URL:", cancelUrl);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: course.courseThumbnail ? [course.courseThumbnail] : [],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    if (!session.url) {
      console.log(
        "[createCheckoutSession] Failed to create Stripe session: session.url is missing"
      );
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: session.id,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[createCheckoutSession] Created Stripe session with ID:",
        session.id
      );
      console.log(
        "[createCheckoutSession] New CoursePurchase data:",
        newPurchase
      );
    }

    await newPurchase.save();
    console.log("[createCheckoutSession] CoursePurchase saved:", newPurchase);

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[createCheckoutSession] Error:", error);
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    console.log("[stripeWebhook] Webhook request received");
    const payload = req.body;
    const payloadString = JSON.stringify(payload, null, 2);
    const signature = req.headers["stripe-signature"];
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[stripeWebhook] Webhook received with payload:",
        payloadString
      );
      console.log("[stripeWebhook] Webhook signature:", signature);
      console.log("[stripeWebhook] Webhook secret:", secret);
    }

    event = stripe.webhooks.constructEvent(payload, signature, secret);
    console.log("[stripeWebhook] Webhook event constructed:", event.type);
  } catch (error) {
    console.error(
      "[stripeWebhook] Webhook signature verification failed:",
      error.message
    );
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("[stripeWebhook] Checkout session completed event triggered");
    try {
      const session = event.data.object;
      console.log("[stripeWebhook] Session data:", session);

      // Log metadata to verify userId and courseId
      console.log("[stripeWebhook] Session metadata:", session.metadata);

      // Verify session.id format
      console.log("[stripeWebhook] Session ID:", session.id);

      // Find the purchase by paymentId
      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId", select: "courseTitle lectures" });

      if (!purchase) {
        console.error(
          "[stripeWebhook] Purchase not found for paymentId:",
          session.id
        );
        // Log all CoursePurchase documents to debug
        const allPurchases = await CoursePurchase.find().limit(10);
        console.log(
          "[stripeWebhook] All CoursePurchase documents:",
          allPurchases
        );
        return res.status(404).json({ message: "Purchase not found" });
      }

      console.log("[stripeWebhook] Found purchase:", purchase);

      // Verify courseId exists and is populated
      if (!purchase.courseId) {
        console.error(
          "[stripeWebhook] Course not found for purchase:",
          purchase._id
        );
        return res
          .status(404)
          .json({ message: "Course not found for this purchase" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      // Update lectures if they exist
      if (purchase.courseId.lectures && purchase.courseId.lectures.length > 0) {
        const lectureUpdateResult = await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
        console.log(
          "[stripeWebhook] Updated lectures to set isPreviewFree to true:",
          lectureUpdateResult
        );
      } else {
        console.log(
          "[stripeWebhook] No lectures to update for course:",
          purchase.courseId._id
        );
      }

      await purchase.save();
      console.log(
        "[stripeWebhook] Updated purchase status to completed:",
        purchase
      );

      // Update user's enrolledCourses
      const updatedUser = await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );
      console.log(
        "[stripeWebhook] Updated user enrolledCourses:",
        updatedUser?.enrolledCourses || "User not found"
      );

      if (!updatedUser) {
        console.error(
          "[stripeWebhook] User not found for ID:",
          purchase.userId
        );
        return res.status(404).json({ message: "User not found" });
      }

      // Update course's enrolledStudents
      const updatedCourse = await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );
      console.log(
        "[stripeWebhook] Updated course enrolledStudents:",
        updatedCourse?.enrolledStudents || "Course update failed"
      );

      // Create a CourseProgress document if it doesn't exist
      let courseProgress = await CourseProgress.findOne({
        userId: purchase.userId,
        courseId: purchase.courseId._id,
      });
      if (!courseProgress) {
        courseProgress = new CourseProgress({
          userId: purchase.userId,
          courseId: purchase.courseId._id,
          completed: false,
          lectureProgress:
            purchase.courseId.lectures?.map((lecture) => ({
              lectureId: lecture._id || lecture, // Handle populated vs ObjectId
              viewed: false,
            })) || [],
        });
        await courseProgress.save();
        console.log(
          `[stripeWebhook] Created CourseProgress for user ${purchase.userId} and course ${purchase.courseId._id}:`,
          courseProgress
        );
      } else {
        console.log(
          "[stripeWebhook] CourseProgress already exists:",
          courseProgress
        );
      }
    } catch (error) {
      console.error("[stripeWebhook] Error handling event:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    console.log("[stripeWebhook] Unhandled event type:", event.type);
  }

  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    console.log(
      "[getCourseDetailWithPurchaseStatus] Fetching course for ID:",
      courseId,
      "and user:",
      userId
    );

    const course = await Course.findById(courseId)
      .populate({ path: "creator", select: "name" })
      .populate({ path: "lectures" });

    const purchased = await CoursePurchase.findOne({ userId, courseId });
    console.log(
      "[getCourseDetailWithPurchaseStatus] Purchase status:",
      purchased
    );

    if (!course) {
      console.log(
        "[getCourseDetailWithPurchaseStatus] Course not found for ID:",
        courseId
      );
      return res.status(404).json({ message: "Course not found!" });
    }

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.error("[getCourseDetailWithPurchaseStatus] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
      error: error.message,
    });
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;
    const userRole = req.user.role;

    console.log(
      "[getAllPurchasedCourse] Fetching purchased courses for user:",
      userId,
      "with role:",
      userRole
    );

    if (!userId) {
      console.log(
        "[getAllPurchasedCourse] Validation failed: User ID not found"
      );
      return res.status(401).json({
        success: false,
        message: "User ID not found. Please log in again.",
      });
    }

    let purchasedCourses;
    if (userRole === "instructor") {
      purchasedCourses = await CoursePurchase.find({
        status: "completed",
      })
        .populate("courseId")
        .populate("userId", "name email");
    } else {
      purchasedCourses = await CoursePurchase.find({
        userId,
        status: "completed",
      }).populate("courseId");
    }

    console.log(
      "[getAllPurchasedCourse] Raw purchased courses after population:",
      purchasedCourses
    );

    // Check each course for courseTitle
    purchasedCourses.forEach((purchase, index) => {
      console.log(`[getAllPurchasedCourse] Purchase ${index}:`, {
        courseId: purchase.courseId?._id,
        courseTitle: purchase.courseId?.courseTitle,
        status: purchase.status,
      });
      if (!purchase.courseId) {
        console.warn(
          `[getAllPurchasedCourse] Purchase ${index} has no courseId!`
        );
      } else if (!purchase.courseId.courseTitle) {
        console.warn(
          `[getAllPurchasedCourse] Purchase ${index} courseId has no courseTitle!`,
          purchase.courseId
        );
      }
    });

    // Filter out purchases with invalid courseId or missing courseTitle
    const validPurchasedCourses = purchasedCourses.filter((purchase) => {
      if (!purchase.courseId || !purchase.courseId.courseTitle) {
        console.warn(
          "[getAllPurchasedCourse] Filtering out invalid purchase:",
          purchase
        );
        return false;
      }
      return true;
    });

    console.log(
      "[getAllPurchasedCourse] Filtered purchased courses:",
      validPurchasedCourses
    );

    if (validPurchasedCourses.length === 0 && purchasedCourses.length > 0) {
      console.warn(
        "[getAllPurchasedCourse] All purchases filtered out due to invalid course data!"
      );
      return res.status(404).json({
        success: false,
        message:
          "No valid purchased courses found. Course data may be missing or invalid.",
        purchases: [],
      });
    }

    return res.status(200).json({
      success: true,
      purchases: validPurchasedCourses || [],
    });
  } catch (error) {
    console.error("[getAllPurchasedCourse] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchased courses",
      error: error.message,
    });
  }
};
