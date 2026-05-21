import express from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "./db/db_connection.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import authentication from "./middleware/authentication.js";
import authorization from "./middleware/authorization.js";
import reviewRoute from "./routes/reviewRoute.js";
import inquiryRorte from "./routes/inquiryRoute.js";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
await connectToDatabase();

// Use the user route
app.use("/api/users", userRoute);
// Use the product route
app.use("/api/products", productRoute);
// Use the review route
app.use("/api/reviews", reviewRoute);

app.use("/api/inquiry",inquiryRorte);


app.listen(3000,()=>{
    console.log("Server is running on port 3000 http://localhost:3000");
});

