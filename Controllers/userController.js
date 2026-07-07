import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import axios from "axios";
import nodemailer from "nodemailer";
import Otp from "../models/otp.js";

dotenv.config();

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export function getUsers(){
    return User.find();
}

export function registerUser(data){
    let user = new User(data);
    user.password = bcrypt.hashSync(user.password,10);
    return user.save();
}

export async function loginUser(email,password){
    try{
        let user = await User.findOne({email});
        if(!user){
            return null;
        }
    
        if(user.isBlocked){
            throw new Error("You are blocked from accessing the application");
        }
    
    
    
        let isPasswordValid = await bcrypt.compare(password,user.password);
    
        if(!isPasswordValid){
            return null;
        }
    
    
    
        let token = jwt.sign({
            id : user._id,
            name: user.firstName + " " + user.lastName,
            email : user.email,
            role : user.role,
            phone : user.phone,
            emailVarified : user.emailVarified
        },process.env.token_secret,{
            expiresIn : "24h"
        })
        return {token:token,user:user};

    }catch(err){
        throw err instanceof Error ? err : new Error("error while logging in");
    }
}

export async function blockAndUnblockUser(email,status){
    const user = await User.findOneAndUpdate({email},{$set:{isBlocked:status}},{new:true});
    return user;
}

export async function updateUserProfile(id, data){
    const { firstName, lastName, phone, address, profilePic } = data;
    const user = await User.findById(id);
    if(!user){
        throw new Error("User not found");
    }
    
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profilePic !== undefined) user.profilePic = profilePic;
    
    const updatedUser = await user.save();
    
    const token = jwt.sign({
        id : updatedUser._id,
        name: updatedUser.firstName + " " + updatedUser.lastName,
        email : updatedUser.email,
        role : updatedUser.role,
        phone : updatedUser.phone
    },process.env.token_secret,{
        expiresIn : "24h"
    });
    
    return { user: updatedUser, token: token };
}

export async function loginwithGoogle(req){
    const accessToken = req.body.accessToken;
    console.log(accessToken)
    try{
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
            headers: {
                Authorization : `Bearer ${accessToken}`
            }
        })
        console.log(response.data);
        const user = await User.findOne({email:response.data.email})
        if(user){
           let token = jwt.sign({
            id : user._id,
            name: user.firstName + " " + user.lastName,
            email : user.email,
            role : user.role,
            profilePic : user.profilePic,
            emailVarified : true
        },process.env.token_secret,{
            expiresIn : "24h"
        })
        return {token:token,user:user};
        }else{
            let newUser = new User({
                email:response.data.email,
                password:"123",
                firstName:response.data.given_name,
                lastName:response.data.family_name,
                address:"Not given",
                phone:"Not given",
                profilePic:response.data.picture,
                emailVarified : true           
            })
            const savedUser = await newUser.save();
            const token = jwt.sign({
                id : savedUser._id,
                name: savedUser.firstName + " " + savedUser.lastName,
                email : savedUser.email,
                role : savedUser.role,
                profilePic : savedUser.profilePic,
                emailVarified : true
            },process.env.token_secret,{
                expiresIn : "24h"
            })
            return {token:token,user:savedUser};
        }
    }catch(e){
        console.log(e)
        throw e instanceof Error ? e : new Error("Error during Google authentication");
    }
}

export async function sendOtp(req){
    if(!req.user){
        throw new Error("Unauthorized");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Delete any existing OTP for this email first to prevent duplicates
    await Otp.deleteMany({ email: req.user.email });

    const newOtp = new Otp({
        email : req.user.email,
        otp : otp
    })

    await newOtp.save();

    const message = {
        from : process.env.EMAIL_USER,
        to : req.user.email,
        subject : "Validating OTP",
        text : `This code expires in 2 minutes : ${otp}`
    }

    try {
        await transport.sendMail(message);
        return "OTP sent successfully";
    } catch (err) {
        console.error("Error sending OTP email:", err);
        throw new Error("Error while sending OTP email: " + err.message);
    }
}

export async function verifyOtp(req){
    const otp = req.body.otp;
    const user = await User.findOne({email:req.user.email});
    if(!user){
        throw new Error("User not found");
    }
    const otpData = await Otp.findOne({
        email : user.email
    })
    if(!otpData){
        throw new Error("OTP expired or not found");
    }
    if(otpData.otp !== otp){
        throw new Error("Invalid OTP");
    }
    const updatedUser = await User.findOneAndUpdate({email:user.email},{$set:{emailVarified:true}},{ returnDocument: 'after' });
    
    // Delete OTP once verified
    await Otp.deleteOne({ email: user.email });

    const token = jwt.sign({
        id : updatedUser._id,
        name: updatedUser.firstName + " " + updatedUser.lastName,
        email : updatedUser.email,
        role : updatedUser.role,
        phone : updatedUser.phone,
        emailVarified : true
    },process.env.token_secret,{
        expiresIn : "24h"
    });

    return { user: updatedUser, token: token };
}