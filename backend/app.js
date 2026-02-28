import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./Config/DB.js";
import courseRoutes from "./Routes/CourseRoute.js";
import subjectRoute from './Routes/SubjectRoutes.js'
import userRoutes from './Routes/UserRoutes.js'
import noticeRoute from './Routes/NoticeRoutes.js'

  

const app = express();
const PORT = process.env.PORT || 5050;

 
await connectDB();

 
app.use(helmet());

 
app.use(
  cors({
    origin: "*", // Change to frontend URL in production
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(morgan("dev"));

// Rate limiting (Anti abuse protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

 // Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LMS Course API OK!"
  });
});

app.use("/api", courseRoutes);
app.use("/api/subjects", subjectRoute);
app.use("/api/users", userRoutes);
app.use("/api/notice", noticeRoute)


 


 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

 
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

 
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
