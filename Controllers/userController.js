
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

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
    let user = await User.findOne({email});
    console.log(user);

    if(!user){
        return null;
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
}