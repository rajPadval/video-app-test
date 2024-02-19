import { useState } from "react";
import axios from "axios";

function VideoUpload() {
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleVideoFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleThumbnailFileChange = (event) => {
    setThumbnailFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !videoFile || !thumbnailFile) {
      setUploadMessage(
        "Please enter title, select a video file, and select a thumbnail."
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      const response = await axios.post("http://localhost:5000/api/post-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadMessage("Error uploading video. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label htmlFor="videoFile">Video File:</label>
          <input
            type="file"
            id="videoFile"
            accept="video/mp4"
            onChange={handleVideoFileChange}
          />
        </div>
        <div>
          <label htmlFor="thumbnailFile">Thumbnail File:</label>
          <input
            type="file"
            id="thumbnailFile"
            accept="image/*"
            onChange={handleThumbnailFileChange}
          />
        </div>
        <button type="submit">Upload Video</button>
      </form>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
}

export default VideoUpload;
