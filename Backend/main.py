from fastapi import FastAPI, HTTPException, Depends, WebSocket, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import uuid4
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from utils import generate_random_username
from routers import ws
import db
from routers import database_operations

from db import Room, SessionLocal, engine

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify certain domains instead of "*" to restrict access
    allow_credentials=True,
    allow_methods=["*"],  # ["GET", "POST"] if you want to restrict
    allow_headers=["*"],  # ["Authorization", "Content-Type"] if you want to restrict
)
app.include_router(ws.router)
app.include_router(database_operations.router, prefix="/database")

# Create a database session
get_db = db.get_db
@app.on_event("startup")
async def startup_event():
    app.state.ws_manager = ws.ConnectionManager()
# Password encryption context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models
class CreateRoom(BaseModel):
    password: str

class JoinRoom(BaseModel):
    roomId: str
    password: str

# 1. Room Creation with SQLite storage
@app.post("/create-room/")
async def create_room(room: CreateRoom, db: Session = Depends(get_db)):
    room_id = str(uuid4())  # Generate a unique room ID
    hashed_password = pwd_context.hash(room.password)  # Hash the password

    # Create a new room entry
    db_room = Room(roomId=room_id, password_hash=hashed_password)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)

    return {"roomId": db_room.roomId}

# 2. Join Room by checking the password from SQLite
@app.post("/join-room/")
async def join_room(join: JoinRoom, db: Session = Depends(get_db)):
    db_room = db.query(Room).filter(Room.roomId == join.roomId).first()
    if db_room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"success": False, "error": "Room not found"}
        )

    if not pwd_context.verify(join.password, db_room.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"success": False, "error": "Invalid password"}
        )

    return {"success": True, "roomId": db_room.roomId}
