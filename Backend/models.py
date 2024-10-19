from sqlalchemy import Column, String, Integer, DateTime
from db import Base
import datetime
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(String, index=True)
    username = Column(String)
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    

