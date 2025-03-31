from dotenv import load_dotenv
from pymongo import MongoClient
from models import *
from typing import List
import os

load_dotenv()

# MongoDB connections
MONGO_URI_RAW = os.getenv("MONGO_URI_RAW")
MONGO_URI_PROCESSED = os.getenv("MONGO_URI_PROCESSED")

db_raw = MongoClient(MONGO_URI_RAW).mydatabase
db_processed = MongoClient(MONGO_URI_PROCESSED).mydatabase

def transform_sessions(sessions: List[Session]) -> List[Story]:
    story_map = {}
    
    for session in sessions:
        for trial in session.trials:
            if trial.trialName not in story_map:
                story_map[trial.trialName] = {}
            
            for i, word_id in enumerate(trial.missingWordIds):
                word = trial.missingWords[i]
                if word_id not in story_map[trial.trialName]:
                        story_map[trial.trialName][word_id] = {"word": word, "guesses": []}

                if i < len(trial.guessedWords):
                    guess = trial.guessedWords[i]                    
                    story_map[trial.trialName][word_id]["guesses"].append(guess)
    
    for story_name in story_map.keys():
        story_map[story_name] = dict(sorted(story_map[story_name].items()))
    
    # Construct processed stories
    processed_stories = []
    for name, words in story_map.items():
        word_list = []
        for word_id, data in words.items():
            correct_guesses = 0
            for guess in data["guesses"]:
                if guess == data["word"]:
                    correct_guesses += 1

            guessed_ratio = correct_guesses / max(1, len(data["guesses"]))
            
            word_list.append(Word(id=word_id, word=data["word"], guesses=data["guesses"], guessed_ratio=guessed_ratio))
        
        processed_stories.append(Story(name=name, words=word_list))
    
    return processed_stories

def main():
    raw_sessions = list(db_raw.users.find())
    parsed_sessions = [Session(**session) for session in raw_sessions]
    processed_stories = transform_sessions(parsed_sessions)
    
    db_processed.stories.insert_many([story.dict() for story in processed_stories])
    print(f"Processed {len(processed_stories)} stories.")

if __name__ == "__main__":
    main()
