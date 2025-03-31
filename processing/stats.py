import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Clear the console
os.system('cls' if os.name == 'nt' else 'clear')

# Load environment variables
load_dotenv()

# Connect to MongoDB
client_source = MongoClient(os.getenv("MONGO_URI_RAW"))
db = client_source.mydatabase
users_collection = db.users
mails_collection = db.mails

# Get the number of users
session_count = users_collection.count_documents({})

# Find a user with trials
user_with_trials = users_collection.find_one({"trials": {"$exists": True}}, {"trials.trialName": 1})
if user_with_trials and "trials" in user_with_trials:
    trial_names = [trial["trialName"] for trial in user_with_trials["trials"]]
    trial_names.sort()
else:
    raise ValueError("No user with trials found in the database.")

# Count completed stories
completed_stories = {}
total_completions = 0
for trial_name in trial_names:
    completed_count = users_collection.count_documents({
        "trials": {
            "$elemMatch": {
                "trialName": trial_name,
                "hasFinished": True
            }
        }
    })
    completed_stories[trial_name] = completed_count
    total_completions += completed_count

# Print statistics
print(f"Total number of users: {session_count}")
print("Total Completed Stories:", total_completions)
print("Average Completed Stories:", total_completions/session_count)
print("\nCompleted Stories:")
for name, count in completed_stories.items():
    print(f"{name}: {count}")

# Retrieve all emails from the mails collection
emails = mails_collection.find({}, {"email": 1})

# Write emails to a file
# with open("mails.txt", "w") as file:
#     for email in emails:
#         file.write(email["email"] + "\n")

# print("Emails have been written to mails.txt")