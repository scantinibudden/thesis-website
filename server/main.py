import uvicorn
from config import API_HOST, API_PORT

if __name__ == "__main__":
    uvicorn.run("api.app:app", host=API_HOST, port=int(API_PORT), reload=True)