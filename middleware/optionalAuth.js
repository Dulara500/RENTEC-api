import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const optionalAuth = (req,res,next)=>{
    if(!req.headers.authorization){
        req.user = null;
        return next();
    }
    let token = req.headers.authorization.split(" ")[1];
    
    jwt.verify(token,process.env.token_secret,(err,decoded)=>{
        if(err){
            res.status(401).json({
                "message" : "Invalid token"
            }); 
        }
        req.user = decoded;
    
    })
    next();
}

export default optionalAuth;