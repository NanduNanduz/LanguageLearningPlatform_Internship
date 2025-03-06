import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

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

export const login =async (req,res,next)=>{
    try {
        // Find the user in the database by username
        const user= await userModel.findOne({username:req.body.username});
        
        if (!user) return next(createError(404,"User Not Found!"));

        // Compare the entered password with the hashed password in the database (Async version)
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrect) 
            return next(createError(404,"Wrong password or username!"));


        
        //  Generate a JWT token with user ID & isSeller flag
        const token = jwt.sign(
            {   id:user._id, isSeller:user.isSeller, },  // Payload (Data stored in token)
                process.env.JWT_KEY);  // Secret key from environment variables


         // Destructure user data to exclude password before sending the response
        const {password, ...userInfo}=user._doc;

        //  Store JWT token in a **HTTP-only cookie** (prevents XSS attacks)
        res.cookie("accessToken", token , { httpOnly:true,})
            .status(200)
            .send(userInfo);   // Send user info (without password) as response
    } catch (err) {
        next(err);
    }
}


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
