import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,                                             # Set the logging level
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',  # Format of the log messages
    datefmt='%Y-%m-%d %H:%M:%S'                                     # Format of the date and time
)

# Load environment variables from .env file
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")

API_PORT = os.getenv("API_PORT")
API_HOST = os.getenv("API_HOST")

MONGO_URI = os.getenv("MONGO_URI")