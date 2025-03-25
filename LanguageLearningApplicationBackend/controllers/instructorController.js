import courseModel from "../models/courseModel.js";
import cloudinary from "cloudinary";
import userModel from "../models/userModel.js";
import streamifier from "streamifier";
import PDFDocument from "pdfkit";
import Quiz from "../models/quizModel.js";
import fs from "fs";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Get all instructors
export const getInstuctors = async (req, res) => {
  const instructors = await userModel.find({ role: "instructor" });
  res.json(instructors);
};

//GET route for fetching instructor details

export const getInstructorDetails = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const instructor = await userModel
      .findOne({ _id: instructorId, role: "instructor" })

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json(instructor);
  } catch (error) {
    console.error("Error fetching instructor details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get one instructors courses
export const getInstructorCourses = async (req, res) => {
  try {
    const { instructorId } = req.params; // Get instructorId from request params

    // Find all courses created by this instructor
    const courses = await courseModel.find({ instructorId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: "No courses found for this instructor" });
    }

    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get one course details
export const getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const Course = await courseModel.findById(courseId);
    if (!Course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    const instructorId = Course.instructorId
    await courseModel.findByIdAndDelete(courseId);
    await userModel.findByIdAndUpdate(
      instructorId,
      {
        $pull: { courseCreated: { courseId: courseId } } // Removes the entire object that matches
      },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit course details
export const editCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedData = req.body;
    const newThumbnail = req.files?.thumbnail?.[0]; // Extract file from array

    // Find the course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // If a new thumbnail is provided, upload it to Cloudinary
    if (newThumbnail) {
      // Upload new thumbnail to Cloudinary
      const thumbnailUpload = await cloudinary.v2.uploader.upload(newThumbnail.path, {
        folder: "course_thumbnails",
      });

      // Just update the course model with the new thumbnail URL
      updatedData.thumbnail = thumbnailUpload.secure_url;

      
    }

    // Update the course details
    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, updatedData, { new: true });
    res.status(200).json({ success: true, message: "Course details updated", course: updatedCourse });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Adding new course and uploading video with it
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, instructorName} = req.body;
    const { instructorId } = req.params;

    if (!req.files || !req.files.thumbnail) {
      return res.status(400).json({ success: false, message: "Course thumbnail is required" });
    }

    // Upload course thumbnail
    const thumbnailUpload = await cloudinary.v2.uploader.upload(req.files.thumbnail[0].path, {
      folder: "course_thumbnails",
    });

    let videoUploads = [];

    // Convert videoTitle to an array if it's a single string
    let videoTitles = req.body.videoTitle;
    if (typeof videoTitles === "string") {
      videoTitles = [videoTitles]; // Convert to array
    }

    if (req.files.videos && req.files.videos.length > 0) {
      if (!Array.isArray(videoTitles) || videoTitles.length !== req.files.videos.length) {
        return res.status(400).json({ success: false, message: "Each video must have a corresponding title" });
      }

      videoUploads = await Promise.all(
        req.files.videos.map(async (videoFile, index) => {
          const videoUpload = await cloudinary.v2.uploader.upload(videoFile.path, {
            folder: "course_videos",
            resource_type: "video",
          });

          return {
            videoTitle: videoTitles[index] || "Untitled Video",
            videoUrl: videoUpload.secure_url,
          };
        })
      );
    }

    const newCourse = new courseModel({
      title,
      price,
      category,
      description,
      thumbnail: thumbnailUpload.secure_url,
      instructorId,
      instructorName,
      videos: videoUploads,
      status: "Pending",
    });

    await newCourse.save();

    await userModel.findByIdAndUpdate(
      instructorId,
      {
        $push: {
          courseCreated: { courseId: newCourse._id , courseTitle:newCourse.title},
        },
      },
      { new: true }
    );

    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//Deleting videos inside a course
export const deleteVideoFromCourse = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    // Find the course by ID
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Find the video inside the course
    const videoIndex = course.videos.findIndex(video => video._id.toString() === videoId);
    if (videoIndex === -1) {
      return res.status(404).json({ success: false, message: "Video not found in this course" });
    }

    // Extract video details
    const { videoUrl, videoThumbnail } = course.videos[videoIndex];

    // Remove video from the videos array
    course.videos.splice(videoIndex, 1);

    // Save updated course
    await course.save();

    res.status(200).json({ success: true, message: "Video deleted successfully", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//editing videos inside a course
export const updateVideoInCourse = async (req, res) => {
  const { courseId, videoId } = req.params;
  const newVideoTitle = req.body?.newVideoTitle;

  try {
    console.log(`Updating video in course: ${courseId}, Video: ${videoId}`);

    // Validate IDs
    if (!courseId.match(/^[0-9a-fA-F]{24}$/) || !videoId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid courseId or videoId" });
    }

    // Find the course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Find the video inside the course
    const videoIndex = course.videos.findIndex((v) => v._id.toString() === videoId);
    if (videoIndex === -1) {
      return res.status(404).json({ success: false, message: "Video not found in course" });
    }

    // Update video title if provided
    if (newVideoTitle) {
      course.videos[videoIndex].videoTitle = newVideoTitle;
      console.log("Video title updated");
    }

    // Mark the videos array as modified
    course.markModified("videos");

    // Save updated course
    await course.save();

    res.status(200).json({ success: true, message: "Video updated successfully", course });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//adding videos and assignments as pdf after creating course
export const addVideosAndResources = async (req, res) => {
  try {
    const { courseId } = req.params;
    let { videoTitle, resourceName } = req.body;

    // Find the course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let videoUploads = [];
    let resourceUploads = [];

    // Convert videoTitle to an array if it's a single string
    if (typeof videoTitle === "string") {
      videoTitle = [videoTitle];
    }

    // Convert resourceName to an array if it's a single string
    if (typeof resourceName === "string") {
      resourceName = [resourceName];
    }

    // Upload videos (if provided)
    if (req.files.videos && req.files.videos.length > 0) {
      if (!Array.isArray(videoTitle) || videoTitle.length !== req.files.videos.length) {
        return res.status(400).json({ success: false, message: "Each video must have a corresponding title" });
      }

      videoUploads = await Promise.all(req.files.videos.map(async (videoFile, index) => {
        const videoUpload = await cloudinary.v2.uploader.upload(videoFile.path, {
          folder: "course_videos",
          resource_type: "video",
        });

        return {
          videoTitle: videoTitle[index] || "Untitled Video",
          videoUrl: videoUpload.secure_url,
        };
      }));
    }

    // Upload resources (PDFs) (if provided)
    if (req.files.resources && req.files.resources.length > 0) {
      if (!Array.isArray(resourceName) || resourceName.length !== req.files.resources.length) {
        return res.status(400).json({ success: false, message: "Each resource must have a corresponding name" });
      }

      resourceUploads = await Promise.all(req.files.resources.map(async (pdfFile, index) => {
        const pdfUpload = await cloudinary.v2.uploader.upload(pdfFile.path, {
          folder: "course_resources",
          resource_type: "raw",
        });

        return {
          resourceName: resourceName[index] || "Unnamed Resource",
          resourceUrl: pdfUpload.secure_url,
        };
      }));
    }

    // Update the course with new videos and resources
    course.videos.push(...videoUploads);
    course.resources.push(...resourceUploads);
    await course.save();

    res.status(200).json({ success: true, message: "Videos and resources added successfully", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//generating certificate
export const generateCertificate = async (userName, courseTitle, instructorName) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: [842, 595], margin: 50 }); // Landscape A4
      let buffers = [];

      // Collect PDF chunks
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", async () => {
        const pdfBuffer = Buffer.concat(buffers);

        // Upload to Cloudinary
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "raw", folder: "certificates", format: "pdf" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            resolve(result.secure_url); // Return the certificate URL
          }
        );

        // Convert buffer to readable stream and upload
        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
      });

      // Background Gradient (light blue to white)
      const gradient = doc.linearGradient(0, 0, 842, 595);
      gradient.stop(0, "#dfe9f3").stop(1, "#ffffff"); // Light blue to white
      doc.rect(0, 0, 842, 595).fill(gradient);

      // Border Design
      doc.rect(20, 20, 802, 555).lineWidth(8).stroke("#003366"); // Dark blue border

      // Decorative Lines
      doc.moveTo(50, 80).lineTo(792, 80).lineWidth(3).stroke("#003366"); // Top line
      doc.moveTo(50, 515).lineTo(792, 515).lineWidth(3).stroke("#003366"); // Bottom line

      // Certificate Title
      doc
        .font("Helvetica-Bold")
        .fontSize(34)
        .fillColor("#003366")
        .text("Certificate of Completion", 0, 110, { align: "center" });

      // Subtitle
      doc
        .font("Helvetica")
        .fontSize(18)
        .fillColor("#333")
        .text("This is to certify that", 0, 170, { align: "center" });

      // User's Name
      doc
        .font("Helvetica-Bold")
        .fontSize(26)
        .fillColor("#0056b3")
        .text(userName, 0, 210, { align: "center", underline: true });

      // Course Title
      doc
        .font("Helvetica")
        .fontSize(18)
        .fillColor("#333")
        .text("has successfully completed the course", 0, 260, { align: "center" });

      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#d9534f")
        .text(courseTitle, 0, 300, { align: "center", underline: true });

      // Instructor Name
      doc
        .font("Helvetica")
        .fontSize(16)
        .fillColor("#333")
        .text(`Course by: ${instructorName}`, 0, 340, { align: "center" });

      // Issue Date
      doc
        .font("Helvetica")
        .fontSize(14)
        .fillColor("#555")
        .text("Issued on: " + new Date().toDateString(), 0, 380, { align: "center" });

        doc.image("./public/logo.png", 50, 450, { width: 120 });
        doc.image("./public/verified.png", 650, 395, { width: 120 });

      // Finalize PDF document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};



//certificate issue
export const issueCertificate = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    // Find user and course
    const user = await userModel.findById(userId);
    const course = await courseModel.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ success: false, message: "User or Course not found" });
    }

    // Check if the studentsEnrolled array exists and is an array
    if (!Array.isArray(course.studentsEnrolled)) {
      return res.status(400).json({ success: false, message: "No enrolled students found for this course." });
    }

    // Find the student in the enrolled list
    const student = course.studentsEnrolled.find((s) => s?.studentId?.toString() === userId);

    if (!student) {
      return res.status(400).json({ success: false, message: "User is not enrolled in this course" });
    }

    if (!student.isCompleted) {
      return res.status(400).json({ success: false, message: "Course not yet completed" });
    }

    // Check if the certificate already exists
    const existingCertificate = user.certificates?.find(
      (cert) => cert.courseId.toString() === courseId
    );

    if (existingCertificate) {
      return res.status(200).json({
        success: true,
        message: "Certificate already issued",
        certificateUrl: existingCertificate.certificateUrl,
      });
    }

    // Generate and upload certificate (returns Cloudinary URL)
    const certificateUrl = await generateCertificate(user.name, course.title, course.instructorName);

    // Store certificate details in the user's document
    user.certificates.push({ courseId, certificateUrl });

    // Ensure completedStudents array exists in the course model
    if (!Array.isArray(course.completedStudents)) {
      course.completedStudents = [];
    }

    // Store certificate details in the course's document
    course.completedStudents.push({ userId, certificateUrl });

    // Save both models
    await user.save();
    await course.save();

    res.status(200).json({
      success: true,
      message: "Certificate issued successfully",
      certificateUrl,
    });

  } catch (error) {
    console.error("Error issuing certificate:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



//Create Quiz
export const createQuizQuestions = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Extract questions from form-data
    const questionTexts = req.body.questionText;
    const option1 = req.body.option1;
    const option2 = req.body.option2;
    const option3 = req.body.option3;
    const option4 = req.body.option4;
    const correctAnswers = req.body.correctAnswer;

    if (
      !questionTexts ||
      !option1 ||
      !option2 ||
      !option3 ||
      !option4 ||
      !correctAnswers
    ) {
      return res.status(400).json({ success: false, message: "Invalid data format" });
    }

    const questions = [];
    const numQuestions = Array.isArray(questionTexts) ? questionTexts.length : 1;

    for (let i = 0; i < numQuestions; i++) {
      const questionText = Array.isArray(questionTexts) ? questionTexts[i] : questionTexts;
      const options = [
        { text: Array.isArray(option1) ? option1[i] : option1 },
        { text: Array.isArray(option2) ? option2[i] : option2 },
        { text: Array.isArray(option3) ? option3[i] : option3 },
        { text: Array.isArray(option4) ? option4[i] : option4 },
      ];
      const correctAnswerIndex = parseInt(Array.isArray(correctAnswers) ? correctAnswers[i] : correctAnswers, 10);

      if (!questionText || options.some((opt) => !opt.text) || isNaN(correctAnswerIndex)) {
        return res.status(400).json({ success: false, message: `Invalid data for question ${i + 1}` });
      }

      questions.push({ questionText, options, correctAnswerIndex });
    }

    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: "At least one question is required" });
    }

    let quiz = await Quiz.findOne({ courseId });

    if (!quiz) {
      quiz = new Quiz({ courseId, questions });
    } else {
      quiz.questions.push(...questions);
    }

    await quiz.save();

    if (!course.quizzes.includes(quiz._id)) {
      course.quizzes.push(quiz._id);
      await course.save();
    }

    res.status(201).json({
      success: true,
      message: "Questions added successfully to quiz",
      quiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//getting the quiz of a course
export const getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ courseId }).populate("courseId", "title");

    if (!quizzes.length) {
      return res.status(404).json({ success: false, message: "No quizzes found for this course" });
    }

    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit quiz details (title, maxAttempts, passingScore, etc.) and add new questions
export const editQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { maxAttempts, passingScore, timeLimit } = req.body;

    let questions = [];
    if (Array.isArray(req.body.questions)) {
      questions = req.body.questions.map((q) => ({
        questionText: q.questionText,
        options: q.options.map((opt) => ({ text: opt })),
        correctAnswerIndex: q.correctAnswerIndex,
      }));
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        $set: { maxAttempts, passingScore, timeLimit }, // Update quiz details
        $push: { questions: { $each: questions } }, // Add new questions
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    res.status(200).json({ success: true, message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit an individual question in an existing quiz
export const editQuizQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    // Log the received form-data
    console.log("Form Data Received:", req.body);

    const { questionText, option1, option2, option3, option4, correctAnswer } = req.body;

    if (!questionText || !option1 || !option2 || !option3 || !option4 || correctAnswer === undefined) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Find the question inside the quiz
    const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex === -1) {
      return res.status(404).json({ success: false, message: "Question not found in quiz" });
    }

    // Convert options to required format
    const optionsArray = [{ text: option1 }, { text: option2 }, { text: option3 }, { text: option4 }];

    // Update the question
    quiz.questions[questionIndex].questionText = questionText;
    quiz.questions[questionIndex].options = optionsArray;
    quiz.questions[questionIndex].correctAnswerIndex = parseInt(correctAnswer);

    // Save the updated quiz
    await quiz.save();

    res.status(200).json({ success: true, message: "Question updated successfully", quiz });
  } catch (error) {
    console.error("Error updating quiz question:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteResource = async (req, res) => {
  try {
    const { courseId, resourceId } = req.params;

    // Find the course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if resource exists
    const resourceIndex = course.resources.findIndex(resource => resource._id.toString() === resourceId);
    if (resourceIndex === -1) {
      return res.status(404).json({ message: "Resource not found in the course" });
    }

    // Remove the resource from the array
    course.resources.splice(resourceIndex, 1);

    // Save the updated course
    await course.save();

    res.status(200).json({ message: "Resource deleted successfully", course });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course with enrolled students
    const course = await courseModel.findById(courseId).populate("studentsEnrolled.studentId");

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Fetch additional details from the User model
    const enrolledStudents = await Promise.all(
      course.studentsEnrolled.map(async (student) => {
        const user = await userModel.findById(student.studentId._id).select("name email profilePicture enrolledCourses");
        return {
          studentId: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          enrolledCourses: user.enrolledCourses,
          completedVideos: student.completedVideos,
          quizScores: student.quizScores,
          assignments: student.assignments,
          progressPercentage: student.progressPercentage,
          isCompleted: student.isCompleted,
        };
      })
    );

    res.status(200).json({ success: true, enrolledStudents });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Controller to delete a specific question from a quiz
export const deleteQuizQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;

    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Find the question index
    const questionIndex = quiz.questions.findIndex(
      q => q._id.toString() === questionId
    );
    
    if (questionIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Question not found in quiz" 
      });
    }

    // Remove the question from the array
    quiz.questions.splice(questionIndex, 1);

    // Save the updated quiz
    await quiz.save();

    res.status(200).json({ 
      success: true, 
      message: "Question deleted successfully",
      updatedQuiz: quiz
    });
  } catch (error) {
    console.error("Error deleting quiz question:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};