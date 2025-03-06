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
    if (isCorrect) {
      const payload = { Email: user.email, password: user.password };
      const token = jwt.sign(payload,process.env.JWT_KEY);
      return res.status(200).send({ user: user, token: token }).json({message:"Login success"});
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Invalid Login" });
  }
}

