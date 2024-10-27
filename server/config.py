import os
import logging
from scripts import get_stories
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,                                             # Set the logging level
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',  # Format of the log messages
    datefmt='%Y-%m-%d %H:%M:%S'                                     # Format of the date and time
)

# Load environment variables from .env file
API_PORT = os.getenv("API_PORT")
API_HOST = os.getenv("API_HOST")

MONGO_URI = os.getenv("MONGO_URI")

STORIES_FOLDER = 'stories'
STORIES = get_stories(STORIES_FOLDER)
WORD_SKIP = 30