import courseModel from "../models/courseModel.js";
import userModel from "../models/userModel.js";
import Quiz from "../models/quizModel.js";
import Submission from "../models/submissionModel.js";  
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();





const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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
      course.studentsEnrolled.push({ userId: studentId });

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
    course.studentsEnrolled.push({ userId });

    // Save the updated user and course
    await user.save();
    await course.save();

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