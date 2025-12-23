# Usamos una versión de Python ligera y estable (3.10)
FROM python:3.10-slim

# Directorio de trabajo
WORKDIR /app

# Copiamos solo los requisitos primero para aprovechar la caché
COPY requirements.txt .

# Instalamos las librerías (versión CPU de Torch explícitamente para que no pese 2GB)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copiamos el resto del código
COPY . .

# Comando para iniciar el servidor usando el puerto que nos dé Railway
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]