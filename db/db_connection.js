import mongoose from "mongoose";

let mongourl = "mongodb://admin:123@ac-x3owh2u-shard-00-00.wzvlsik.mongodb.net:27017,ac-x3owh2u-shard-00-01.wzvlsik.mongodb.net:27017,ac-x3owh2u-shard-00-02.wzvlsik.mongodb.net:27017/?ssl=true&replicaSet=atlas-148w92-shard-0&authSource=admin&appName=Cluster0"

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

