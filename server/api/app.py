from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import logging

from models import Session, Trial, Email # Ensure your models are compatible with this structure
from config import MONGO_URI, ALLOWED_ORIGINS

# Initialize Flask
app = Flask(__name__)

# Configure CORS
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGINS}})

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client.mydatabase

@app.route("/api/addUser", methods=["POST"])
def add_user():
    logging.info("Adding user")
    data = request.json
    user_id = data["userId"]
    login_time = data["loginTime"]
    age = data["age"]
    gender = data["gender"]
    country = data["country"]
    first_lang = data["firstLang"]
    
    if data["email"]:
        logging.debug("Storing email")
        new_mail = Email(email=data["email"]).dict()
        db.mails.insert_one(new_mail)

            
    user_exists = db.users.find_one({"userId": user_id})
    if user_exists:
        logging.error("User already exists")
        return jsonify({"detail": "User already exists"}), 400

    logging.debug("User is new, constructing model")
    new_session = Session(
        userId=user_id,
        loginTime=login_time,
        age=age,
        gender=gender,
        country=country,
        firstLang=first_lang
    ).dict()

    logging.debug("Inserting user")
    db.users.insert_one(new_session)
    
    return jsonify({"message": "User added successfully"})

@app.route("/api/getUser", methods=["POST"])
def get_user():
    logging.info("Getting user")
    data = request.json
    user_id = data["userId"]
    user = db.users.find_one({"userId": user_id})
    if user:
        logging.debug("User found")
        user = convert_objectid_to_str(user)
    return jsonify(user) if user else jsonify({"message": "User not found"})

@app.route("/api/checkUser", methods=["POST"])
def check_user():
    logging.info("Checking if user exists")
    data = request.json
    user_id = data["userId"]

    user_exists = db.users.find_one({"userId": user_id})
    return jsonify({"userExists": bool(user_exists)})

@app.route("/api/addTutorialTime", methods=["POST"])
def add_tutorial_time():
    logging.info("Adding tutorial time")
    data = request.json
    user_id = data["userId"]
    tutorial_time = data["tutorialTime"]
    result = db.users.update_one(
        {"userId": user_id},
        {"$set": {"tutorialTime": tutorial_time, "isNew": False}}
    )
    return jsonify({"message": "Tutorial time added successfully" if result.modified_count > 0 else "User not found"})

@app.route("/api/addTrials", methods=["POST"])
def add_trials():
    logging.info("Adding trials")
    data = request.json["trials"]

    user_id = data[0]["userId"]

    trials = []

    for trial in data:
        try:
            trial = Trial(
                trialId=str(trial["trialId"]),
                trialName=trial["trialName"],
                submitTime=trial["submitTime"],
                missingWordIds=trial["missingWordIds"],
                missingWords=trial["missingWords"]
            )

            trials.append(trial.dict())

        except KeyError as e:
            return jsonify({"detail": f"Missing field in trial data: {str(e)}"}), 400

    result = db.users.update_one(
        {"userId": user_id},
        {"$set": {"trials": trials}}
    )

    if result.modified_count == 0:
        return jsonify({"detail": "User not found or trial not updated"}), 404

    return jsonify({"message": "Trial added successfully"}), 200

@app.route("/api/updateTrial", methods=["POST"])
def update_trial():
    logging.info("Adding trial data")
    data = request.json

    user_id = data["userId"]

    try:
        trial = Trial(
            trialId=str(data["trialId"]),
            trialName=data["trialName"],
            startTime=data["startTime"],
            submitTime=data["submitTime"],
            missingWordIds=data["missingWordIds"],
            missingWords=data["missingWords"],
            guessedWords=data["guessedWords"],
            guessTimestamps=data["guessTimestamps"],
            hasFinished=data["hasFinished"]
        )
    except KeyError as e:
        return jsonify({"detail": f"Missing field in trial data: {str(e)}"}), 400
    
    print(trial.hasFinished)

    result = db.users.update_one(
        {"userId": user_id, "trials.trialId": trial.trialId},
        {"$set": {"trials.$.guessedWords": trial.guessedWords,
                    "trials.$.guessTimestamps": trial.guessTimestamps,
                    "trials.$.hasFinished": trial.hasFinished}},
        upsert=True
    )

    if result.modified_count == 0:
        return jsonify({"detail": "User not found or trial not updated"}), 404

    return jsonify({"message": "Trial updated successfully"})

def convert_objectid_to_str(data):
    if isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, list):
        return [convert_objectid_to_str(item) for item in data]
    elif isinstance(data, dict):
        return {k: convert_objectid_to_str(v) for k, v in data.items()}
    return data