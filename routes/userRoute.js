import express from "express";
import { getUsers,registerUser,loginUser,blockAndUnblockUser,updateUserProfile,loginwithGoogle } from "../Controllers/userController.js";
import authentication from "../middleware/authentication.js";
import authorization from "../middleware/authorization.js";
let userRoute = express.Router();

userRoute.get('/',authentication,authorization("admin"),async (req,res)=>{
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
            "message" : err.message || "error while saving user"
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
        if(err.message === "You are blocked from accessing the application"){
            return res.status(403).json({ "message": err.message });
        }
        res.status(500).json({
            "message" : err.message || "error while logging in"
        });
    }
});

userRoute.put('/profile',authentication,async (req,res)=>{
    try{
        let result = await updateUserProfile(req.user.id,req.body);
        res.json({
            "message" : "Profile updated successfully",
            "user" : result.user,
            "token": result.token
        })
    }catch(err){
        res.status(500).json({
            "message" : err.message || "error while updating profile"
        });
    }
});

userRoute.put('/:key',authentication,authorization("admin"),async (req,res)=>{
    try{
        let result = await blockAndUnblockUser(req.params.key,req.body.status);
        res.json({
            "message" : "User blocked and unblocked successfully",
            "user" : result
        })
    }catch(err){
        res.status(500).json({
            "message" : err.message || "error while blocking and unblocking user"
        });
    }
});

userRoute.post('/google', async(req,res) => {
    try {
        let result = await loginwithGoogle(req);
        res.status(200).json({
            "message" : "Login successful",
            "token":result.token,
            "user":result.user
        })
    } catch (error) {
        res.status(500).json({
            "message" : error.message || "error while logging in with google"
        });
    }
});


export default userRoute;