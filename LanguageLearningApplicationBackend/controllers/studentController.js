import courseModel from "../models/courseModel.js";
import userModel from "../models/userModel.js";
import reviewModel from "../models/reviewModel.js"
import paymentModel from "../models/paymentModel.js";
import Quiz from "../models/quizModel.js";
import Submission from "../models/submissionModel.js";  
import Stripe from "stripe";
import dotenv from "dotenv";
import notificationModel from "../models/notificationModel.js";
import cloudinary from "cloudinary";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const enrollCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    console.log("Course ID:", courseId);
    console.log("Student ID:", studentId);

    const course = await courseModel.findById(courseId);
    if (!course) {
      console.error("Course not found");
      return res.status(404).json({ message: "Course not found" });
    }

    const user = await userModel.findById(studentId);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Log the enrolledCourses array for debugging
    console.log("User's enrolledCourses:", user.enrolledCourses);

    // Check if the user is already enrolled
    if (
      user.enrolledCourses.some(
        (enrollment) =>
          enrollment.courseId && enrollment.courseId.toString() === courseId
      )
    ) {
      console.error("User already enrolled");
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // If the course is free, enroll the user immediately
    if (course.price === 0) {
      user.enrolledCourses.push({ courseId });
      course.studentsEnrolled.push({ studentId });

      console.log("Saving user and course...");
      await user.save();
      await course.save();

      return res.status(200).json({ message: "Successfully enrolled", course });
    }

    // If the course is paid, create a Stripe checkout session
    console.log("Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              images: [course.thumbnail],
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: course._id.toString(),
        userId: user._id.toString(),
      },
      success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment-failed`,
    });

    return res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if the payment was successful
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Extract metadata (courseId and userId)
    if (
      !session.metadata ||
      !session.metadata.courseId ||
      !session.metadata.userId
    ) {
      return res.status(400).json({ message: "Payment metadata missing" });
    }

    const courseId = session.metadata.courseId;
    const userId = session.metadata.userId;

    // Fetch the course and user
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log the enrolledCourses array for debugging
    console.log("User's enrolledCourses:", user.enrolledCourses);

    // Check if the user is already enrolled
    if (
      user.enrolledCourses.some(
        (enrollment) =>
          enrollment.courseId && enrollment.courseId.toString() === courseId
      )
    ) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Enroll the user
    user.enrolledCourses.push({ courseId });
    course.studentsEnrolled.push({ studentId : userId });

    // Save the updated user and course
    await user.save();
    await course.save();

    // Save payment details in the Payment model
    const payment = new paymentModel({
      studentId: userId,
      courseId: courseId,
      amount: course.price, // Amount in dollars
      paymentStatus: "Completed", // Payment is completed
      transactionId: session.payment_intent, // Stripe payment intent ID
    });

    await payment.save();

    return res.json({ message: "Payment verified, enrolled successfully!" });
  } catch (error) {
    console.error("🚨 Payment Verification Error:", error);
    res.status(500).json({ message: "Error verifying payment", error });
  }
};




export const getAllStudents = async (req, res) => {
  try {
    const students = await userModel
      .find({ role: "student" })
      .select("-password");
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel
      .findById(userId)
      .populate("enrolledCourses.courseId")
      .populate("favourites")
      .populate("certificates.courseId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//viewing a quiz by student
export const getQuizByCourse = async (req, res) => {  
  try {  
    const { courseId } = req.params;  

    // Find the quiz for the selected course  
    const quiz = await Quiz.findOne({ courseId }).populate("courseId");  

    if (!quiz) {  
      return res.status(404).json({ success: false, message: "Quiz not found for this course" });  
    }  

    res.status(200).json({ success: true, quiz });  
  } catch (error) {  
    res.status(500).json({ success: false, message: error.message });  
  }  
};
//submitting quiz by student
export const submitQuiz = async (req, res) => {
  try {
    const { userId, quizId } = req.body;
    let selectedAnswers = req.body.selectedAnswers;


    // ✅ Check if the student has already attempted this quiz
    const existingAttempt = await Submission.findOne({ userId, quizId });
    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: "You have already attempted this quiz. Only one attempt is allowed.",
      });
    }

    // ✅ Ensure `selectedAnswers` is treated as an array
    if (!Array.isArray(selectedAnswers)) {
      selectedAnswers = [selectedAnswers]; 
    }

    // ✅ Convert text values to numbers
    selectedAnswers = selectedAnswers.map((ans) => {
      const parsed = parseInt(ans, 10);
      return isNaN(parsed) ? null : parsed;
    });

    // ✅ Check if any answer is invalid
    if (selectedAnswers.includes(null)) {
      return res.status(400).json({
        success: false,
        message: "Invalid answer format. Answers must be numbers.",
      });
    }

    // ✅ Fetch the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // ✅ Calculate score
    let correctAnswersCount = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswerIndex === selectedAnswers[index]) {
        correctAnswersCount++;
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentageScore = (correctAnswersCount / totalQuestions) * 100;
    const passed = percentageScore >= quiz.passingScore;

    // ✅ Save submission
    const submission = new Submission({
      userId,
      quizId,
      selectedAnswers,
      score: percentageScore,
      correctAnswersCount,
      passed,
      attemptNumber: 1, // Always 1 since only 1 attempt is allowed
      isBestAttempt: true, // Since it's the only attempt, it's the best
    });

    await submission.save();

    // ✅ Update the `submissions` array in the Quiz model
    quiz.submissions.push(submission._id);
    await quiz.save();

    // ✅ Update the `enrolledCourses` section in the user model
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Find the enrolled course
    const enrolledCourse = user.enrolledCourses.find(
      (ec) => ec.courseId.toString() === quiz.courseId.toString()
    );

    if (enrolledCourse) {
      // ✅ Check if quiz score already exists
      const existingQuizScore = enrolledCourse.quizScores.find(
        (qs) => qs.quizId.toString() === quizId
      );

      if (existingQuizScore) {
        // ✅ Update existing quiz score
        existingQuizScore.score = percentageScore;
        existingQuizScore.passed = passed;
      } else {
        // ✅ Add new quiz score
        enrolledCourse.quizScores.push({
          quizId,
          score: percentageScore,
          passed,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "User is not enrolled in this course.",
      });
    }

    // ✅ Save updated user document
    await user.save();

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      score: percentageScore,
      correctAnswersCount,
      passed,
      attemptNumber: 1,
      isBestAttempt: true,
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//viewing result by the student
export const getUserQuizResults = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Fetch user with enrolled courses and populate quiz scores
    const user = await userModel.findById(userId)
      .populate({
        path: "enrolledCourses.courseId", // Ensure course details are available
        select: "title",
      })
      .populate({
        path: "enrolledCourses.quizScores.quizId",
        select: "title",
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find the specific course
    const enrolledCourse = user.enrolledCourses.find(
      (ec) => ec.courseId._id.toString() === courseId
    );

    if (!enrolledCourse) {
      return res.status(404).json({ success: false, message: "User not enrolled in this course" });
    }

    // Format quiz scores with proper data
    const formattedQuizScores = enrolledCourse.quizScores.map((quiz) => ({
      score: quiz.score
    }));

    res.status(200).json({ success: true, quizScores: formattedQuizScores });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//GET route for fetching one student details

export const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await userModel
      .findOne({ _id: studentId, role: "student" })

    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all approved courses
export const getApprovedCourses = async (req, res) => {
  try {
    const courses = await courseModel.find({ status: "Approved" }); // Fetch only approved courses
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

//get enrolled course of a particular student
export const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find student by ID and populate enrolled courses
    const student = await userModel.findById(studentId).populate("enrolledCourses");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ courses: student.enrolledCourses });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Ensure req.user is defined

    // Fetch notifications where the user is a recipient
    const notifications = await notificationModel
      .find({
        recipients: userId,
      })
      .populate("sentBy", "name");

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};


export const uploadAssignment = async (req, res) => {
  try {
      const { studentId, courseId } = req.params;
      const {title} = req.body;

      // Ensure a file is uploaded
      if (!req.file) {
          return res.status(400).json({ message: "Please upload a PDF file." });
      }

      // Find student
      const student = await userModel.findById(studentId);
      if (!student) {
          return res.status(404).json({ message: "Student not found." });
      }

      // Check if student is enrolled in the course
      const enrolledCourse = student.enrolledCourses.find(course => course.courseId.toString() === courseId);
      if (!enrolledCourse) {
          return res.status(403).json({ message: "You are not enrolled in this course." });
      }

      // Upload file to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "assignments",
          resource_type: "raw"
      });


      // Add assignment to student model
      const newAssignment = {
          courseId,
          title,
          assignmentId: studentId, // Assuming assignmentId refers to the student who submitted
          fileUrl: result.secure_url, // Cloudinary file URL
          submittedAt: new Date(),
          feedback: "" // Instructor can update feedback later
      };
      enrolledCourse.assignments.push(newAssignment);
      await student.save();

      // Add assignment to course model
      const course = await courseModel.findById(courseId);
      if (course) {
          course.studentsEnrolled.forEach(studentData => {
              if (studentData.studentId.toString() === studentId) {
                  studentData.assignments.push(newAssignment);
              }
          });
          await course.save();
      }

      return res.status(201).json({ message: "Assignment uploaded successfully!", fileUrl: result.secure_url });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error, please try again." });
  }
};

export const updateVideoProgress = async (req, res) => {
  try {
    const { userId, courseId, videoId } = req.body;

    // Find user
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Find course
    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });

    // Find enrolled course in user document
    const enrolledCourse = user.enrolledCourses.find((c) => c.courseId.toString() === courseId);
    if (!enrolledCourse) return res.status(404).json({ message: "Course not found for user." });

    // Find the student in the course's studentsEnrolled array
    let enrolledStudent = course.studentsEnrolled.find((s) => s.studentId.toString() === userId);
    if (!enrolledStudent) return res.status(404).json({ message: "Student not enrolled in course." });

    // Check if the video is already marked as completed
    if (!enrolledCourse.completedVideos.includes(videoId)) {
      enrolledCourse.completedVideos.push(videoId);
      enrolledStudent.completedVideos.push(videoId); // Update in course model too

      // Fetch total videos in the course
      const totalVideos = course.videos.length;

      // Calculate progress percentage
      const progressPercentage = Math.round(
        (enrolledCourse.completedVideos.length / totalVideos) * 100
      );

      enrolledCourse.progressPercentage = progressPercentage;
      enrolledStudent.progressPercentage = progressPercentage; // Update in course model too

      // If progress reaches 100%, mark course as completed
      if (progressPercentage === 100) {
        enrolledCourse.completedAt = new Date();
        enrolledStudent.isCompleted = true;
      }

      await user.save();
      await course.save();
    }

    res.status(200).json({
      message: "Progress updated successfully",
      progress: enrolledCourse.progressPercentage,
    });

  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Server error while updating progress" });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    // Find user and get enrolled courses
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find progress for the specific course
    const enrolledCourse = user.enrolledCourses.find(
      (course) => course.courseId.toString() === courseId
    );

    if (!enrolledCourse) {
      return res.status(404).json({ message: "Progress not found for this course" });
    }

    // Send progress data
    res.status(200).json({
      completedVideos: enrolledCourse.completedVideos || [],
      progressPercentage: enrolledCourse.progressPercentage || 0,
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const submitReview = async (req, res) => {
  try {
    const { studentId, courseId, rating, comment } = req.body;

    // Check if the student has already submitted a review for this course
    const existingReview = await reviewModel.findOne({ studentId, courseId });
    if (existingReview) {
      return res
        .status(400)
        .json({
          error: "You have already submitted a review for this course.",
        });
    }

    // Create a new review
    const review = new reviewModel({
      studentId,
      courseId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};

export const getReviewsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await reviewModel.find({ courseId }).populate(
      "studentId",
      "name"
    );

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};