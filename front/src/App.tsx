import { useEffect, useState } from "react";
import { WebSocketProvider } from "./context/WebSocketContext";
import AudioStream from "./components/audio/AudioStream";
import AudioRecord from "./components/audio/AudioRecord";
import { WS_ENDPOINT } from "./config/config";

function App() {
  return (
    <WebSocketProvider url={WS_ENDPOINT}>
      {/* <AudioStream /> */}
      <AudioRecord />
    </WebSocketProvider>
  );
}

export default App;
