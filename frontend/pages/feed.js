import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ImageCard from '../components/ImageCard';
import Chatbot from '../components/Chatbot';

export default function Feed() {  
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Petición al Backend (Python)
    fetch('http://127.0.0.1:8000/feed')
      .then((res) => res.json())
      .then((data) => {
        setMemories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error conectando con el backend:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        {/* Título de la sección */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recuerdos recientes
        </h2>

        {/* Mensaje si no hay fotos o falló la conexión */}
        {!loading && memories.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <p>No se encontraron recuerdos.</p>
                <p className="text-sm">Asegúrate de que el servidor Python (uvicorn) esté corriendo.</p>
            </div>
        )}

        {/* GRID DE FOTOS REALES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {memories.map((memory) => (
            <ImageCard 
              key={memory.id}
              image={memory.image_path} // Ahora viene la URL real desde Python
              description={memory.description}
              date={memory.date}
              emotion={memory.emotion}
            />
          ))}
        </div>
      </main>
      {/* Aquí va el componente flotante */}
      <Chatbot />
    </div>
  );
}