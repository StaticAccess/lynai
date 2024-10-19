from sqlalchemy import Column, String, Integer, create_engine, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
import datetime
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

# Create database tables
Base.metadata.create_all(bind=engine)
