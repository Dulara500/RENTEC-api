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
import dotenv from "dotenv";


const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to MongoDB
await connectToDatabase();

// Use the user route
app.use("/api/users", userRoute);
// Use the product route
app.use("/api/products", productRoute);
// Use the review route
app.use("/api/reviews", reviewRoute);

app.use("/api/inquiry",inquiryRorte);

app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
