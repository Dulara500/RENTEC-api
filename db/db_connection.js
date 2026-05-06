import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let mongourl = process.env.MONGO_URL

export async function connectToDatabase() {

    try{
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(mongourl);
        console.log("Connected to MongoDB");
    }catch(error){
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with an error code
        
    };
    console.log("Database connection function executed");
}

