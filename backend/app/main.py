from fastapi import FastAPI

from app.database import Base, engine
from app.models import User
from app.routes import router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Inventory Management API",
    version="1.0.0"
)

# Include routes
app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "Welcome to Smart Inventory Management API"
    }


@app.get("/health")
def health():
    return {
        "status": "Server is running successfully!"
    }