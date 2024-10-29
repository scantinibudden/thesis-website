from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import logging

from models import Session, Trial  # Ensure your models are compatible with this structure
from config import MONGO_URI

# Initialize Flask
app = Flask(__name__)

# Configure CORS
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
CORS(app, resources={r"/api/*": {"origins": "https://thesis-experiment.vercel.app"}})

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client.mydatabase

@app.route("/api/test", methods=["GET"])
def test():
    logging.info("Testing call received")
    return 'Hello, World!'

@app.route("/api/addUser", methods=["POST"])
def add_user():
    logging.info("Adding user")
    data = request.json
    user_id = data["userId"]
    login_time = data["loginTime"]
    
    user_exists = db.users.find_one({"userId": user_id})
    if user_exists:
        logging.error("User already exists")
        return jsonify({"detail": "User already exists"}), 400

    logging.debug("User is new, constructing model")
    new_session = Session(
        userId=user_id,
        loginTime=login_time
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
        {"$set": {"tutorialTime": tutorial_time, "is_new": False}}
    )
    return jsonify({"message": "Tutorial time added successfully" if result.modified_count > 0 else "User not found"})

@app.route("/api/addTrial", methods=["POST"])
def add_trial():
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
            hasFinished=data["hasFinished"]
        )
    except KeyError as e:
        return jsonify({"detail": f"Missing field in trial data: {str(e)}"}), 400

    existing_trial = db.users.find_one(
        {"userId": user_id, "trials.trialId": trial.trialId},
        {"trials.$": 1}
    )

    if existing_trial:
        result = db.users.update_one(
            {"userId": user_id, "trials.trialId": trial.trialId},
            {"$set": {"trials.$.guessedWords": trial.guessedWords,
                       "trials.$.hasFinished": trial.hasFinished}}
        )
    else:
        result = db.users.update_one(
            {"userId": user_id},
            {"$push": {"trials": trial.dict()}}
        )

    if result.modified_count == 0:
        return jsonify({"detail": "User not found or trial not updated"}), 404

    return jsonify({"message": "Trial updated successfully" if existing_trial else "Trial added successfully"})

def convert_objectid_to_str(data):
    if isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, list):
        return [convert_objectid_to_str(item) for item in data]
    elif isinstance(data, dict):
        return {k: convert_objectid_to_str(v) for k, v in data.items()}
    return data