from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from core.config import settings
# DATABASE_URL = "mysql+mysqlconnector://root:123456@localhost:3307/bank"
# DATABASE_URL = "mysql+mysqlconnector://mck0506:123456@mysql:3306/student"

DATABASE_URL = "mysql+mysqlconnector://root:123456@localhost:3307/bank"


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()