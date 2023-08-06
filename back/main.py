from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

import os

app = FastAPI()

origins = ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins)

if os.getenv('APP_PORT'):
    APP_PORT = int(os.getenv('APP_PORT'))
else:
    APP_PORT = 4444
    

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=APP_PORT)