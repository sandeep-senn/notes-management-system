import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { requireAuth } from "@clerk/express";

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true  
  })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//To make input as json
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true                // allow cookies
}));
app.listen(PORT, () => {
  console.log(`Server Started on localhost:${PORT}`);
});
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);
import noteRouter from "./routes/noteRoutes.js";

// Protect routes like this:
app.use("/api/note", requireAuth(), noteRouter); // ✅ Auth protection


// Error Handling

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log(err)
  return res.status(statusCode).json({
    statusCode,
    message,
  });
});
