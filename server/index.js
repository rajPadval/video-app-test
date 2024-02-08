const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");

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
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
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

app.get("/video", async (req, res) => {
  const range = req.headers.range;
  // if (!range) {
  //   return res.status(400).send("Requires Range header");
  // }

  const videoUrl =
    "https://res.cloudinary.com/diouxllrj/video/upload/v1707159939/video-app-test/tqsyqk56nxd40anaw0g4.mp4";

  // Fetch video from URL
  const videoStream = request.get(videoUrl);

  videoStream.on("response", (videoResponse) => {
    const videoSize = parseInt(videoResponse.headers["content-length"], 10);

    // Set appropriate headers for streaming
    res.writeHead(206, {
      "Content-Type": "video/mp4",
      "Content-Length": videoSize,
      "Accept-Ranges": "bytes",
    });

    // Stream the video to the client
    videoStream.pipe(res);
  });

  videoStream.on("error", (err) => {
    console.error("Error fetching video:", err);
    res.status(500).send("Error fetching video");
  });
});

app.listen(port, () => console.log(`server running at port ${port}`));
