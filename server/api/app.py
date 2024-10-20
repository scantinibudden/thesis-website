from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from models import Session, Trial
from config import MONGO_URI
from bson import ObjectId

# Initialize FastAPI
app = FastAPI()

# Connect to MongoDB
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_default_database()  # Specify your database name if necessary

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
    
    user_exists = await db.users.find_one({"userId": user_id})
    if user_exists:
        raise HTTPException(status_code=400, detail="User already exists")

    new_session = Session(
        userId=user_id,
        loginTime=login_time
    ).dict()
    
    await db.users.insert_one(new_session)
    
    return {"message": "User added successfully"}


@app.post("/api/getUser")
async def get_user(request: Request):
    data = await request.json()
    user_id = data["userId"]
    user = await db.users.find_one({"userId": user_id})
    if user:
        user = convert_objectid_to_str(user)
    return user or {"message": "User not found"}


@app.post("/api/checkUser")
async def check_user(request: Request):
    data = await request.json()
    user_id = data["userId"]

    user_exists = await db.users.find_one({"userId": user_id})
    return {"userExists": bool(user_exists)}


@app.post("/api/addTutorialTime")
async def add_tutorial_time(request: Request):
    data = await request.json()
    user_id = data["userId"]
    tutorial_time = data["tutorialTime"]
    result = await db.users.update_one(
        {"userId": user_id},
        {"$set": {"tutorialTime": tutorial_time,
                  "is_new": False}}
    )
    return {"message": "Tutorial time added successfully" if result.modified_count > 0 else "User not found"}


@app.post("/api/addTrial")
async def add_trial(request: Request):
    data = await request.json()

    # Extract userId from request data
    user_id = data["userId"]

    # Parse the trial data into the Trial model
    try:
        trial = Trial(
            trialId=str(data["trialId"]),
            trialName=data["trialName"],
            startTime=data["startTime"],
            submitTime=data["submitTime"],
            missingWordIds=data["missingWordIds"],
            missingWords=data["missingWords"],
            guessedWords=data["guessedWords"],
            hasFinished=data["hasFinished"]
        )
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing field in trial data: {str(e)}")

    # Find if the trial already exists
    existing_trial = await db.users.find_one(
        {"userId": user_id, "trials.trialId": trial.trialId},
        {"trials.$": 1}  # Only retrieve the matching trial
    )

    if existing_trial:
        # Update only guessedWords if the trial exists
        result = await db.users.update_one(
            {"userId": user_id, "trials.trialId": trial.trialId},
            {"$set": {"trials.$.guessedWords": trial.guessedWords,
                      "trials.$.hasFinished": trial.hasFinished}}
        )
    else:
        # Insert the trial if it does not exist
        result = await db.users.update_one(
            {"userId": user_id},
            {"$push": {"trials": trial.dict()}}
        )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or trial not updated")

    return {"message": "Trial updated successfully" if existing_trial else "Trial added successfully"}


def convert_objectid_to_str(data):
    if isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, list):
        return [convert_objectid_to_str(item) for item in data]
    elif isinstance(data, dict):
        return {k: convert_objectid_to_str(v) for k, v in data.items()}
    return data