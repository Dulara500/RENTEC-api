import express from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "./db/db_connection.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import authentication from "./middleware/authentication.js";
import authorization from "./middleware/authorization.js";

const app = express();
app.use(express.json());

// Connect to MongoDB
await connectToDatabase();

// Use the user route
app.use("/api/users", userRoute);
// Use the product route
app.use("/api/products",authentication, authorization("admin"), productRoute);

app.listen(3000,()=>{
    console.log("Server is running on port 3000 http://localhost:3000");
});

