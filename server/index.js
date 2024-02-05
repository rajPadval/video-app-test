const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const mongoose = require("mongoose");

// Connect to database
const connectDb = async () =>
  await mongoose.connect("mongodb://127.0.0.1:27017/video-app-demo");
connectDb();

// Video model
const Video = mongoose.model(
  "video",
  new mongoose.Schema({
    title: String,
    url: String,
  })
);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/post-video", async (req, res) => {
  const { url, title } = req.body;
  const video = new Video({ url, title });
  await video.save();
  return res
    .status(200)
    .json({ success: true, message: "Video posted successfully" });
});

app.get("/api/get-videos", async (req, res) => {
  const videos = await Video.find();
  return res.status(200).json({
    success: true,
    message: "Videos fetched successfully",
    data: videos,
  });
});

app.listen((port) => console.log(`server running at port ${port}`));
