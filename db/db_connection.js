import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let mongourl = process.env.MONGO_URL

export async function connectToDatabase() {
    const connectWithRetry = async () => {
        try {
            console.log("Attempting to connect to MongoDB...");
            await mongoose.connect(mongourl);
            console.log("Connected to MongoDB successfully");
        } catch (error) {
            console.error("Error connecting to MongoDB. Retrying in 5 seconds...", error.message || error);
            setTimeout(connectWithRetry, 5000);
        }
    };

    connectWithRetry();
    console.log("Database connection process initiated in background");
}

