import axios from "axios";
import { useState, useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = async () => {
    try {
      const res = await axios.get("https://video-app-x4ma.onrender.com/api/get-videos");
      // const res = await axios.get("http://localhost:5000/api/get-videos");
      setVideos(res.data.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleVideoSelect = (videoId) => {
    setSelectedVideo(videoId);
  };

  return (
    <div className="flex justify-center items-center flex-col w-full h-screen">
      <h3 className="text-2xl lg:text-4xl font-bold font-sans mt-10 lg:mt-12 hover:text-gray-600 text-green-500">
        Video Stream Prototype
      </h3>
      <AliceCarousel disableButtonsControls>
        {videos.map((video) => (
          <div key={video._id} style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <video
                  width={800}
                  height={600}
                  controls
                  controlsList="nodownload"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    borderRadius: "10px",
                  }}
                  onClick={() => handleVideoSelect(video._id)}
                >
                  <source
                    src={`https://video-app-x4ma.onrender.com/api/stream-video/${video._id}`}
                    // src={`http://localhost:5000/api/stream-video/${video._id}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        ))}
      </AliceCarousel>
    </div>
  );
};

export default Home;
