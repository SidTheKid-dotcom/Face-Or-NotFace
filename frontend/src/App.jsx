import React, { useRef, useState, useEffect } from 'react';

function CameraComponent() {
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = new WebSocket('ws://localhost:3000');

    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socketRef.current.onmessage = (data) => {
      setMessage(data.data);
    };

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        const captureFrame = () => {
          const canvas = document.createElement('canvas');
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL('image/jpeg');

          // Send the frame to the server via WebSocket
          if (socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(imageData);
          }

          // Capture frames at intervals
          setTimeout(captureFrame, 100); // Adjust interval as needed
        };

        captureFrame();
      })
      .catch((err) => console.error('Error accessing the camera: ', err));

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <>
      <video ref={videoRef} />
      <div>{message}</div>
    </>
  )
}

export default CameraComponent;
