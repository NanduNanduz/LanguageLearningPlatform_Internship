import courseModel from "../models/courseModel.js";
import userModel from "../models/userModel.js";
import Quiz from "../models/quizModel.js";
import Submission from "../models/submissionModel.js";  
import Stripe from "stripe";
import dotenv from "dotenv";

// export const enrollCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const userId = req.user.id; // Extract user ID from JWT authentication

//     const course = await courseModel.findById(courseId);
//     if (!course) return res.status(404).json({ message: "Course not found" });

//     const user = await userModel.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Check if the user is already enrolled
//     if (user.enrolledCourses.includes(courseId)) {
//       return res
//         .status(400)
//         .json({ message: "Already enrolled in this course" });
//     }

//     // If the course is free, enroll the user immediately
//     if (course.price === 0) {
//       user.enrolledCourses.push(courseId);
//       course.studentsEnrolled.push(userId);
//       await user.save();
//       await course.save();
//       return res.status(200).json({ message: "Successfully enrolled", course });
//     }

//     // If the course is paid, redirect to the payment gateway
//     return res.status(402).json({ message: "Payment required for enrollment" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };


// export const enrollCourse = async (req, res) => {
//   try {
//     const { courseId } = req.params;

//     // Hardcoded user ID for testing (Replace with a valid user _id from your DB)
//     const userId = "67cda74f2f65ad3915f910e4";

//     const course = await courseModel.findById(courseId);
//     if (!course) return res.status(404).json({ message: "Course not found" });

//     const user = await userModel.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Check if the user is already enrolled
//     if (user.enrolledCourses.includes(courseId)) {
//       return res
//         .status(400)
//         .json({ message: "Already enrolled in this course" });
//     }

//     // If the course is free, enroll the user immediately
//     if (course.price === 0) {
//       user.enrolledCourses.push(courseId);
//       course.studentsEnrolled.push(userId);
//       await user.save();
//       await course.save();
//       return res.status(200).json({ message: "Successfully enrolled", course });
//     }

//     // If the course is paid, return a payment response
//     return res.status(402).json({ message: "Payment required for enrollment" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };

dotenv.config();

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Hardcoded user ID for testing (Replace with a valid user _id from your DB)
    const userId = "67cda74f2f65ad3915f910e4";

    const course = await courseModel.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the user is already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // If the course is free, enroll the user immediately
    if (course.price === 0) {
      user.enrolledCourses.push(courseId);
      course.studentsEnrolled.push(userId);
      await user.save();
      await course.save();
      return res.status(200).json({ message: "Successfully enrolled", course });
    }

    // If the course is paid, create a Stripe checkout session
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
              images: [course.thumbnail], // Optional
            },
            unit_amount: course.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
    });

    return res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Payment failed", error });
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
    const { userId, quizId, timeTaken } = req.body;
    let selectedAnswers = req.body.selectedAnswers;

    console.log("Raw selectedAnswers:", selectedAnswers); // Debugging

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
      timeTaken: timeTaken ? parseInt(timeTaken, 10) : null,
      isBestAttempt: true, // Since it's the only attempt, it's the best
    });

    await submission.save();

    // ✅ Update the `submissions` array in the Quiz model
    quiz.submissions.push(submission._id);
    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      score: percentageScore,
      correctAnswersCount,
      passed,
      attemptNumber: 1,
      timeTaken,
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

    // Find the user's enrolled course progress
    const user = await userModel.findById(userId);
    const enrolledCourse = user.enrolledCourses.find((ec) => ec.courseId.toString() === courseId);

    if (!enrolledCourse) {
      return res.status(404).json({ success: false, message: "User not enrolled in this course" });
    }

    res.status(200).json({ success: true, quizScores: enrolledCourse.quizScores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};