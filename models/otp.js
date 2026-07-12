import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    "email": {
        type : String,
        required : true
    },
    "otp" : {
        type : Number,
        required : true
    },
    "expire_at" : {
        type : Date,
        default: Date.now,
        expires : 120
    }
});

const Otp = mongoose.model("Otp",otpSchema);
export default Otp;