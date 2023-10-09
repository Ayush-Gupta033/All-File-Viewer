import React, { useState } from "react";

const VideoPlayer = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Function to handle when a video file is selected
  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes("video")) {
      // Ensure the selected file is a video
      const videoURL = URL.createObjectURL(file);
      setSelectedVideo(videoURL);
    } else {
      // Handle invalid file type (not a video)
      alert("Please select a valid video file (e.g., MP4, WebM, etc.)");
    }
  };

  return (
    <div>
      <h1>Video Player</h1>
      <input type="file" accept="video/*" onChange={handleVideoChange} />
      {selectedVideo && (
        <div>
          <video controls width="100%">
            <source src={selectedVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
