import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";
import { AUDIO_TIMESLICE } from "../../config/config";

const AudioRecord = () => {
  const { ws } = useWebSocket();
  const [isCaptureEnable, setIsCaptureEnable] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
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
      setRecorder(recorder);
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

  useEffect(() => {
    if (isCaptureEnable) {
      startCapture();
    } else {
      stopCapture();
    }
  }, [isCaptureEnable]);

  // // MICROPHONE AUDIO CAPTURE
  const toggleCapture = () => {
    setIsCaptureEnable(!isCaptureEnable);
  };

  useEffect(() => {
    const captureInterval = setInterval(() => {
      if (recorder && stream) {
        recorder.requestData();
      }
    }, AUDIO_TIMESLICE);
    return () => {
      clearInterval(captureInterval);
    };
  }, [stream]);

  return (
    <div>
      <h1>Audio Record</h1>
      <button onClick={toggleCapture}>
        {isCaptureEnable ? "Stop capture" : "Start capture"}
      </button>
    </div>
  );
};

export default AudioRecord;
