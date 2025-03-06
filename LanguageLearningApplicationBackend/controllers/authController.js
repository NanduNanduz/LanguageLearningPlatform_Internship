import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register =async (req,res , next)=>{

    try {
        // Hash the password using bcrypt (async version)
        const hash=await bcrypt.hash(req.body.password,5);

        // Create a new user with hashed password
        const newUser=new userModel({
            ...req.body,// Spread all user details
            password:hash, // Replace plain password with hash
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).send("User has been created");
    } catch (err) {
        next(err);
    }
}

//LOGIN FUNCTIONALITY
export const login =async (req,res,next)=>{
    const user = await userModel.findOne({ email: req.body.Email });
  if (!user) {
    return res.status(400).json({ message: "not found" });
  }

  try {
    const isCorrect = await bcrypt.compare(req.body.password,user.password)
    if (user.password === req.body.password) {
      const payload = { Email: user.email, password: user.password };
      const token = jwt.sign(payload,process.env.JWT_KEY);
      return res.status(200).send({ user: user, token: token });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Invalid Login" });
  }
}

//CHECKING AVAILABILITY OF EXISTING USERNAME AND EMIAL
export const checkAvailability = async (req, res, next) => {
    try {
        const { username, email } = req.body;

        // Check if the username exists
        if (username) {
            const existingUser = await userModel.findOne({ username });
            if (existingUser) return res.status(400).json({ message: "Username already taken." });
        }

        // Check if the email exists
        if (email) {
            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) return res.status(400).json({ message: "Email already registered." });
        }

        res.status(200).json({ message: "Available" });
    } catch (err) {
        next(err);
    }
};
