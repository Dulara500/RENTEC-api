import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authentication = (req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(401).json({
            "message" : "login required"
        });
    }
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,process.env.token_secret,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                "message" : "invalid token"
            });
        }
        req.user = decoded;
        next();
    })
};

export default authentication;