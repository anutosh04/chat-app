import User from "../models/user.model.js"
import bycrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";

const signup = async (req, res)=>{
    try {
        const {username, gender, password, confirmPassword, fullName}= req.body;

        const existingUser= await User.findOne({username})
        if(existingUser)
            return res.status(400).json({error:"username already exists"});

        if(password!=confirmPassword)
            return res.status(400).json({error:"Paswwords do not match"});

        const salt= await bycrypt.genSalt(10)
        const hashedPassword= await bycrypt.hash(password, salt)

        const newUser= await User.create({
            fullName,
            username,
            password:hashedPassword,
            gender
        })

        generateTokenAndSetCookie(newUser._id, res);
        await newUser.save()
        return res.status(201).json({
            _id:newUser._id, 
            username:newUser.username,
            fullName:newUser.fullName
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:"Internal server error"})
        
    }
}

const login =async (req, res)=>{
    try {
        const {username,password}= req.body;
        
        const user= await User.find({username})
        const passwordMatch= await bycrypt.compare(password, user?.password || "")
        
        if(!user || !passwordMatch)
            return res.status(400).json({error:"Invalid credentials"});

        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            _id:user._id, 
            username:user.username,
            fullName:user.fullName
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:"Internal server error"})
    }
}

const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export {signup, login, logout}