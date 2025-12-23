# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import mysql.connector
from transformers import pipeline
import os
from datetime import date

app = FastAPI()

# --- 1. CONFIGURACIÓN CORS ---
# Esto permite que Next.js (localhost:3000) haga peticiones aquí
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambiar esto por la URL real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. SERVIR IMÁGENES ESTÁTICAS ---
# Las fotos en /static serán accesibles vía http://localhost:8000/static/foto.jpg
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- 3. CONFIGURACIÓN BASE DE DATOS ---
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="", # Por defecto en XAMPP es vacío
        database="proyecto_insta_db"
    )

# --- 4. CONFIGURACIÓN IA (Zero-Shot) ---
# Usamos un modelo "Tiny" o "Small" para que corra rápido en tu PC
print("Cargando modelo de IA... espera un momento...")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Etiquetas posibles en tu base de datos
LABELS_MAP = {
    "celebration": "celebración",
    "family": "familia",
    "nostalgia": "nostalgia",
    "travel": "viajes",
    "achievement": "logros",
    "joy": "alegría",
}
LABELS_EN = list(LABELS_MAP.keys())

# --- MODELOS DE DATOS (Pydantic) ---
class ChatRequest(BaseModel):
    message: str

class Memory(BaseModel):
    id: int
    image_path: str
    description: str
    emotion: str
    date: str

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "API Familia funcionando 🚀"}

@app.get("/feed", response_model=List[Memory])
def get_feed():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Traemos las fotos más recientes primero
        cursor.execute("SELECT * FROM memories ORDER BY date DESC")
        memories = cursor.fetchall()
        conn.close()
        print(memories)
        # Ajustar la ruta de la imagen para que sea una URL completa
        for mem in memories:
            # Aseguramos que la ruta empiece con /static/
            if not mem['image_path'].startswith("http"):
                mem['image_path'] = f"http://localhost:8000/static/{mem['image_path']}"
            # CONVERTIR FECHA A STRING (La solución definitiva)
            if mem['date']:
                mem['date'] = str(mem['date']) 
                # Esto transforma el objeto date(2025, 12, 22) en "2025-12-22"

        return memories
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat_intent(req: ChatRequest):
    print(f"Recibido mensaje: {req.message}")
    
    # 1. Clasificar Intención
    result = classifier(req.message, LABELS_EN)
    top_intent_en = result['labels'][0]
    score = result['scores'][0]
    intent_es = LABELS_MAP.get(top_intent_en, "familia")

    print(f"Intención detectada: {intent_es} ({score:.2f})")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # 2. Lógica de respuesta
    images = []
    text_response = ""

    # Si la confianza es baja, buscamos aleatorio o preguntamos
    if score < 0.3:
        text_response = "No estoy seguro de qué buscar exactamente, pero mira estos recuerdos aleatorios:"
        cursor.execute("SELECT * FROM memories ORDER BY RAND() LIMIT 3")
    else:
        text_response = f"¡Claro! Aquí tengo algunos recuerdos sobre {intent_es}:"
        # Buscar fotos con esa emoción
        query = "SELECT * FROM memories WHERE emotion = %s ORDER BY RAND() LIMIT 5"
        cursor.execute(query, (intent_es,))
    
    images_db = cursor.fetchall()
    conn.close()

    # Formatear URLs de imágenes
    for img in images_db:
        if not img['image_path'].startswith("http"):
            img['image_path'] = f"http://localhost:8000/static/{img['image_path']}"
        images.append(img)

    if not images and score >= 0.3:
         text_response = f"Vaya, parece que no tengo fotos etiquetadas como '{intent_es}' todavía."

    return {
        "text": text_response,
        "images": images,
        "intent": intent_es
    }