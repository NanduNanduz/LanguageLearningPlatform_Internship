import courseModel from "../models/courseModel.js";
import userModel from "../models/userModel.js";
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