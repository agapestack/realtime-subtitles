import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";

const AUDIO_TIMESLICE = 1000; // time in ms between audio record

const AudioRecord = () => {
  const { ws } = useWebSocket();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const startCapture = async () => {
    try {
      // get microphone media device
      const userMedia = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(userMedia);

      // init recorder, getting new audio chunks
      const recorder = new MediaRecorder(userMedia);
      recorder.ondataavailable = (event) => {
        console.log(event);
        if (event.data.size > 0) {
          setAudioChunks((prevChunks) => [...prevChunks, event.data]);
          if (ws) {
            console.log("sending audio chunk...");
            ws.send(event.data);
          } else {
            console.log("ws not connected");
          }
        }
      };
      setMediaRecorder(recorder);
      recorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopCapture = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // MICROPHONE AUDIO CAPTURE
  useEffect(() => {
    startCapture();

    const intervalId = setInterval(() => {
      console.log(mediaRecorder);
      if (mediaRecorder && stream) {
        mediaRecorder.stop();
        mediaRecorder.start();
      }
    }, AUDIO_TIMESLICE);
    return () => {
      clearInterval(intervalId);
      stopCapture();
    };
  }, [mediaRecorder]);

  return (
    <div>
      <h1>Audio Record</h1>
    </div>
  );
};

export default AudioRecord;
