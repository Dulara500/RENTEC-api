import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function getUsers(){
    return User.find();
}

export async function registerUser(data){
        let user = new User(data);
        user.password = bcrypt.hashSync(user.password,10);
        return user.save();
}

export async function loginUser(email,password){
    let user = await User.findOne({email});

    if(!user){
        return null;
    }

    let isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
        return null;
    }

    let token = jwt.sign({
        id : user._id,
        email : user.email,
        role : user.role
    },process.env.token_secret,{
        expiresIn : "1h"
    })

    return token;
}