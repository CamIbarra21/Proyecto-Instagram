# backend/seed_db.py
import os
import mysql.connector
from datetime import date

# CONFIGURACIÓN
STATIC_FOLDER = "static"
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "proyecto_insta_db"
}

def seed():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    # Obtener lista de archivos en static
    files = [f for f in os.listdir(STATIC_FOLDER) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    print(f"**** Encontré {len(files)} fotos en la carpeta static. ****")
    print("Vamos a etiquetarlas una por una. (Presiona Enter vacío para saltar una foto)")

    for filename in files:
        print(f"\n--- Procesando: {filename} ---")
        
        # Verificar si ya existe en la BD para no duplicar
        cursor.execute("SELECT id FROM memories WHERE image_path = %s", (filename,))
        if cursor.fetchone():
            print("   -> Ya existe en BD. Saltando.")
            continue

        # Pedir datos al usuario
        desc = input("1. Descripción (La historia): ")
        if not desc: continue # Si das enter vacío, salta

        print("2. Emociones: [celebración, familia, nostalgia, viajes, logros, alegría, tristeza]")
        emotion = input("   Escribe la emoción: ").lower().strip()
        
        fecha = input("3. Fecha (YYYY-MM-DD) o Enter para hoy: ")
        if not fecha:
            fecha = str(date.today())

        # Insertar
        sql = "INSERT INTO memories (image_path, description, emotion, date) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (filename, desc, emotion, fecha))
        conn.commit()
        print("Guardado!")

    print("\n¡Listo! Todas las fotos procesadas.")
    conn.close()

if __name__ == "__main__":
    seed()