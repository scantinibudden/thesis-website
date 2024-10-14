import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI
from api.get_trial import get_trial

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


@app.post("/api/addUser")
async def add_user(request: Request):
    data = await request.json()
    user_id = data["userId"]
    login_time = data["loginTime"]
    return {"message": "User added succesfully"}


@app.post("/api/getUser")
async def get_user(request: Request):
    data = await request.json()
    user_id = data["userId"]
    return {}


@app.post("/api/checkUser")
async def check_user(request: Request):
    data = await request.json()
    user_id = data["userId"]
    return {"userExists": False}


@app.post("/api/addTutorialTime")
async def add_tutorial_time(request: Request):
    data = await request.json()
    user_id = data["userId"]
    tutorial_time = data["userId"]
    return {"message": "Tutorial time added succesfully"}


@app.post("/api/addTrial")
async def add_trial(request: Request):
    data = await request.json()
    user_id = data["userId"]
    trial_number = data["trialNumber"]
    word_id = data["wordID"]
    meaning_id = data["meaningID"]
    word = data["word"]
    context = data["context"]
    answers = data["answers"]
    word_order = data["wordOrder"]
    last_trial_submitted = data["lastTrialSubmitted"]
    start_time = data["startTime"]
    submit_time = data["submitTime"]
    has_finished = data["hasFinished"]
    return {"message": "Trial added succesfully"}

@app.post("/api/getTrial")
async def get_new_trial():
    return get_trial()