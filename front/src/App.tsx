import { useEffect, useState } from "react";
import { WebSocketProvider } from "./context/WebSocketContext";
import AudioStream from "./components/audio/AudioStream";
import AudioRecord from "./components/audio/AudioRecord";

function App() {
  return (
    <WebSocketProvider url="ws://localhost:4444">
      {/* <AudioStream /> */}
      <AudioRecord />
    </WebSocketProvider>
  );
}

export default App;
