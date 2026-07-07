from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import User, Product
from app.routes import router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Inventory Management API",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def home():
    return {"message": "Welcome to Smart Inventory Management API"}


@app.get("/health")
def health():
    return {"status": "Server is running successfully!"}