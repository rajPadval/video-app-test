import { useEffect, useState } from "react";

const Home = () => {
  const [videoUrl, setVideoUrl] = useState("");

  const getVideo = async () => {
    const res = await fetch("http://localhost:5000/video",{
      headers: {
        range: "bytes=0-",
      },
    });
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div>
      <h3>Hello</h3>

      <video width={500} controls>
        <source
          src="https://res.cloudinary.com/diouxllrj/video/upload/v1707159939/video-app-test/tqsyqk56nxd40anaw0g4.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default Home;
