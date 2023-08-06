import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext";
import { AUDIO_TIMESLICE } from "../../config/config";

const AudioRecord = () => {
  const { ws } = useWebSocket();
  const [isCaptureEnable, setIsCaptureEnable] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

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
        if (event.data.size > 0) {
          if (ws) {
            blobToBase64(event.data).then((data: string) => {
              ws.send(data);
            });
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

  // MICROPHONE AUDIO CAPTURE
  const toggleCapture = () => {
    setIsCaptureEnable(!isCaptureEnable);
  };

  // UTILS
  async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onerror = (e) => reject(fileReader.error);
      fileReader.onloadend = (e) => {
        const dataUrl = fileReader.result as string;
        // remove "data:mime/type;base64," prefix from data url
        const base64 = dataUrl.substring(dataUrl.indexOf(",") + 1);
        resolve(base64);
      };
      fileReader.readAsDataURL(blob);
    });
  }

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
