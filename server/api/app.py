from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
# from config import MONGO_URI

# Initialize FastAPI
app = FastAPI()

# Connect to MongoDB
# client = AsyncIOMotorClient(MONGO_URI)
# db = client.get_default_database()  # Specify your database name if necessary

# Configure CORS
allowed_origins = [
    "http://localhost:3000",
    "http://192.168.0.55:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/addTutorialTime")
async def add_tutorial_time():
    return {"message": "Tutorial time added succesfully"}


@app.post("/api/addUser")
async def add_user():
    return {"message": "Tutorial time added succesfully"}

@app.post("/api/getUser")
async def get_user():
    return {"message": "Tutorial time added succesfully"}

@app.post("/api/addRating")
async def add_rating():
    return {"message": "Tutorial time added succesfully"}


@app.post("/api/checkUser")
async def check_user():
    return {"message": "Tutorial time added succesfully"}


@app.post("/api/hasRated")
async def has_rated():
    return {"message": "Tutorial time added succesfully"}


@app.post("/api/getCurrentSerie")
async def get_current_serie():
    return {"message": "Tutorial time added succesfully"}