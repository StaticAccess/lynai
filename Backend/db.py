from sqlalchemy import Column, String, Integer, create_engine, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
import datetime
import os
import sqlite3
# SQLAlchemy setup
DATABASE_URL = "sqlite:///./chat_rooms.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
# Password encryption context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Room model
class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    roomId = Column(String, unique=True, index=True)
    password_hash = Column(String)

#message model
class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String, index=True)
    username = Column(String)
    content = Column(String)
    timestamp = Column(DateTime)



def create_room_database(room_id):
    db_file = f"chat_rooms/{room_id}.db"
    os.makedirs(os.path.dirname(db_file), exist_ok=True)
    engine = create_engine(f"sqlite:///{db_file}", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    return engine, SessionLocal

def get_room_db(room_id):
    engine, SessionLocal = create_room_database(room_id)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def delete_room_database(room_id):
    db_file = f"chat_rooms/{room_id}.db"
    if os.path.exists(db_file):
        os.remove(db_file)
# Create database tables
Base.metadata.create_all(bind=engine)