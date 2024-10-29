from config import API_HOST, API_PORT
from api import app

if __name__ == "__main__":
    app.run(host=API_HOST, port=int(API_PORT), debug=True)