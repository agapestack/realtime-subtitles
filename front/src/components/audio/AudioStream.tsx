import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";

const AudioStream = () => {
  const { ws } = useWebSocket();
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // MICROPHONE CAPTURE
  const startCapture = async () => {
    try {
      // get microphone media device
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioStream(userMedia);

      // create audio context and stream souce
      const audioContext = new AudioContext();
      const mediaStreamSource = audioContext.createMediaStreamSource(userMedia);

      const analyser = audioContext.createAnalyser();
      mediaStreamSource.connect(analyser);

      const dataArray = new Uint8Array(analyser.fftSize);

      const processAudio = () => {
        analyser.getByteTimeDomainData(dataArray);
        // sending new audio data
        if (ws) {
          ws.send(dataArray);
        }
        setAudioChunks((prevChunks) => [...prevChunks, new Blob([dataArray])]);
        requestAnimationFrame(processAudio);
      };

      processAudio();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  useEffect(() => {}, [audioChunks]);

  return <div>AudioStream</div>;
};

export default AudioStream;
