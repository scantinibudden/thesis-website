# Pull de la imagen base oficial
FROM python:3.9.6-alpine

# setup del directorio de trabajo
WORKDIR /app
COPY . /app

# Configuración de las variables de ambiente
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies in a single layer and ensure necessary build tools are available
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Run the main.py script when the container launches
CMD ["python", "main.py"]