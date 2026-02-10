// Import packages
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const contentRoutes = require("./Route/contentRoutes");
// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); 

app.use("/api/content", contentRoutes);
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
  res.send("MERN Backend is Running...");
});
