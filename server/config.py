from scripts import get_stories
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

API_PORT = os.getenv("API_PORT")
API_HOST = os.getenv("API_HOST")

MONGO_URI = os.getenv("MONGODB_URI")

STORIES_FOLDER = 'stories'
STORIES = get_stories(STORIES_FOLDER)