// Import packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// After app.use(express.json());
const authRoutes = require("./Route/authRoutes");
const userRoutes = require("./Route/UserRoute");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 


const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error.message);
  });

// Testing 
app.get("/", (req, res) => {
  res.send("MERN backend is Running...");
});
