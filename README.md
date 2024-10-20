## AI Generativa vs. Humanos

Esta es una app web diseñada para tomar datos sobre la performance de humanos y de modelos de generación de imágenes como Stable Diffusion.


## Usage

### Client
- Stand in client folder
- fill .env file with the following environment variables:
    - REACT_APP_SERVER_BASE_ROUTE (example: http://localhost:8000)
- use 'npm install'
- use 'npm start'

### Server (Backend)
- Stand in server folder
- fill .env file with the following environment variables:
    - API_HOST (example: 0.0.0.0)
    - API_PORT (example: 8000)
    - MONGO_URI (example: "mongodb://root:example@localhost:27017/your_database_name?authSource=admin")
- install requirements in requirements.txt with pip (pip install -r requirements.txt)
- use 'python main.py'