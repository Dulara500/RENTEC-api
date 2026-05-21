import express from "express";
import { getUsers,registerUser,loginUser } from "../Controllers/userController.js";

let userRoute = express.Router();

userRoute.get('/',async (req,res)=>{
    try{
        let users =await getUsers();
        res.json(users);
    }catch(err){
        res.status(500).json({
            "message" : "error while fetching users"
        })
    }
}); 


userRoute.post('/',async (req,res)=>{
    try{
        await registerUser(req.body);
        res.status(201).json({
            "message" : "User saved successfully"
        })
    }catch(err){
        res.status(500).json({
            "message" : "error while saving user"
        })
    }
}); 

userRoute.post('/login',async (req,res)=>{
    try{
        let result = await loginUser(req.body.email,req.body.password);
        if(result){
            res.json({
                "message" : "Login successful",
                "token" : result.token,
                "user" : result.user
            })
        }else{
            res.status(401).json({
                "message" : "Invalid email or password"
            })
        }
    }catch(err){
        res.status(500).json({
            "message" : "error while logging in"
        });
    }
});
export default userRoute;