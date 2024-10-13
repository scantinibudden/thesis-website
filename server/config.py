from scripts import get_stories
import os

# Load environment variables from .env file
API_PORT = os.getenv("API_PORT")
API_HOST = os.getenv("API_HOST")

MONGO_URI = os.getenv("MONGO_URI")

STORIES_FOLDER = 'stories'
STORIES = get_stories(STORIES_FOLDER)