import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import axios from "axios";

dotenv.config();

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
            phone : user.phone
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
            profilePic : user.profilePic
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
                profilePic:response.data.picture             
            })
            const savedUser = await newUser.save();
            const token = jwt.sign({
                id : savedUser._id,
                name: savedUser.firstName + " " + savedUser.lastName,
                email : savedUser.email,
                role : savedUser.role,
                profilePic : savedUser.profilePic
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