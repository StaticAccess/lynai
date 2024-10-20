from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
import os
import sqlite3
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        self.active_connections[room_id].remove(websocket)

    async def broadcast(self, message: str, room_id: str):
        for connection in self.active_connections[room_id]:
            await connection.send_text(message)

def get_temp_db_connection(room_id: str):
    db_file = f"chat_rooms/{room_id}.db"
    os.makedirs(os.path.dirname(db_file), exist_ok=True)
    conn = sqlite3.connect(db_file)
    conn.execute('''CREATE TABLE IF NOT EXISTS messages
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                     username TEXT,
                     content TEXT,
                     timestamp DATETIME)''')
    return conn

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    manager = websocket.app.state.ws_manager
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Store message in the temporary database
            conn = get_temp_db_connection(room_id)
            cursor = conn.cursor()
            cursor.execute('''INSERT INTO messages (username, content, timestamp)
                              VALUES (?, ?, ?)''',
                           (message_data['username'], message_data['message'], datetime.now()))
            conn.commit()
            conn.close()
            
            # Broadcast the message
            await manager.broadcast(data, room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
