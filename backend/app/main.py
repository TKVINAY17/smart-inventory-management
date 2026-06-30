from fastapi import FastAPI

from app.database import Base, engine
import app.models

print("Tables found:", Base.metadata.tables.keys())

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {"message": "API Running"}