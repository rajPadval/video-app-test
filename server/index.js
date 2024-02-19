const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const request = require("request");
const axios = require("axios");
const { Transform } = require("stream");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { stat } = fs.promises;

// Connect to database
const connectDb = async () =>
  await mongoose.connect("mongodb+srv://rajpadval145:rajpadval145@cluster0.pmznzkg.mongodb.net/video-app?retryWrites=true&w=majority");
connectDb();

// Video model
const Video = mongoose.model(
  "video",
  new mongoose.Schema({
    title: String,
    videoUrl: String,
    thumbnailUrl: String,
  })
);

// Middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Firebase setup
const multer = require("multer");
const firebase = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAFAKtVcLQQJTs9GMHt_W3oY3t7q9i9ouI",
  authDomain: "video-streaming-app-81666.firebaseapp.com",
  projectId: "video-streaming-app-81666",
  storageBucket: "video-streaming-app-81666.appspot.com",
  messagingSenderId: "523967552433",
  appId: "1:523967552433:web:fa26527c8814bc78db7b90",
};

firebase.initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({
  storage: multer.memoryStorage(),
});

// Define function to transcode video into multiple resolutions
async function transcodeVideo(inputPath, outputPath) {
  try {
    const resolutions = ["1920x1080", "1280x720", "854x480", "640x360"];
    for (const resolution of resolutions) {
      const command = `ffmpeg -i ${inputPath} -vf scale=${resolution} -c:a copy ${outputPath}-${resolution}.mp4`;
      await exec(command);
    }
    console.log("Video transcoding complete.");

    // Count the number of transcoded files
    const files = await fs.promises.readdir(".");
    const transcodedFiles = files.filter(file => file.startsWith(outputPath));
    console.log("Number of transcoded files:", transcodedFiles.length);

    // Calculate storage utilization of transcoded files
    let totalSize = 0;
    for (const file of transcodedFiles) {
      const fileStats = await stat(file);
      totalSize += fileStats.size;
    }
    const totalSizeInMB = totalSize / (1024 * 1024);
    console.log("Total storage utilized by transcoded files:", totalSizeInMB.toFixed(2), "MB");
  } catch (error) {
    console.error("Error transcoding video:", error);
    throw error;
  }
}

// Route for uploading video with automatic transcoding
app.post(
  "/api/post-video",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({
        success: false,
        message: "No video or thumbnail found",
      });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];

    const videoStorageRef = ref(storage, videoFile.originalname);
    const thumbnailStorageRef = ref(storage, thumbnailFile.originalname);

    const videoMetadata = {
      contentType: "video/mp4",
    };

    const thumbnailMetadata = {
      contentType: thumbnailFile.mimetype,
    };

    try {
      await Promise.all([
        uploadBytes(videoStorageRef, videoFile.buffer, videoMetadata),
        uploadBytes(
          thumbnailStorageRef,
          thumbnailFile.buffer,
          thumbnailMetadata
        ),
      ]);

      const [videoUrl, thumbnailUrl] = await Promise.all([
        getDownloadURL(videoStorageRef),
        getDownloadURL(thumbnailStorageRef),
      ]);

      console.log("videoUrl : ", videoUrl, "thumbnailUrl : ", thumbnailUrl);

      // Transcode uploaded video into multiple resolutions
      await transcodeVideo(videoFile.originalname, videoUrl);

      const video = new Video({
        title: req.body.title,
        videoUrl,
        thumbnailUrl,
      });

      await video.save();

      return res.status(200).json({
        success: true,
        message: "Video uploaded successfully",
        data: video,
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      return res.status(500).json({
        success: false,
        message: "Error uploading video",
        data: error.message,
      });
    }
  }
);

app.get("/api/get-videos", async (req, res) => {
  const videos = await Video.find();
  return res.status(200).json({
    success: true,
    message: "Videos fetched successfully",
    data: videos,
  });
});

app.get("/api/stream-video/:videoId", async (req, res) => {
  const video = await Video.findById(req.params.videoId);
  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  try {
    const videoUrl = video.videoUrl;
    const range = req.headers.range;

    if (range) {
      const options = {
        url: videoUrl,
        headers: {
          Range: range,
        },
      };

      request
        .get(options)
        .on("error", (error) => {
          console.error("Error streaming video:", error);
          res.status(500).json({
            success: false,
            message: "Error streaming video",
            data: error.message,
          });
        })
        .pipe(res);
    } else {
      const response = request.get(videoUrl);
      response.on("response", (videoResponse) => {
        if (videoResponse.headers["content-length"]) {
          res.setHeader("Content-Type", "video/mp4");
          res.setHeader(
            "Content-Length",
            videoResponse.headers["content-length"]
          );
          response.pipe(res);
        } else {
          console.error(
            "Error streaming video: Content-Length header not found"
          );
          res.status(500).json({
            success: false,
            message: "Error streaming video: Content-Length header not found",
          });
        }
      });
    }
  } catch (error) {
    console.error("Error streaming video:", error);
    res.status(500).json({
      success: false,
      message: "Error streaming video",
      data: error.message,
    });
  }
});
app.listen(port, () => console.log(`server running at port ${port}`));
