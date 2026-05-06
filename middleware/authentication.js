import jwt from "jsonwebtoken";

const authentication = (req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(401).json({
            "message" : "login required"
        });
    }
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,"kvaudio123",(err,decoded)=>{
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