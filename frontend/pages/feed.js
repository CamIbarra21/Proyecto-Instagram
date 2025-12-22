// pages/feed.js
import Navbar from '../components/Navbar';
import ImageCard from '../components/ImageCard';

export default function Feed() {
  
  // DATOS DE PRUEBA (MOCK DATA)
  // Usamos picsum.photos para tener imágenes aleatorias automáticas
  const mockMemories = [
    { id: 1, image: "https://picsum.photos/400/400?random=1", description: "Cena de Navidad del año pasado", date: "24/12/2024", emotion: "celebración" },
    { id: 2, image: "https://picsum.photos/400/400?random=2", description: "Vacaciones en la playa con los primos", date: "15/02/2023", emotion: "viajes" },
    { id: 3, image: "https://picsum.photos/400/400?random=3", description: "Tu cumpleaños número 60", date: "10/10/2022", emotion: "alegría" },
    { id: 4, image: "https://picsum.photos/400/400?random=4", description: "Cuando adoptamos a Max 🐶", date: "05/06/2020", emotion: "familia" },
    { id: 5, image: "https://picsum.photos/400/400?random=5", description: "Graduación de la universidad", date: "12/12/2024", emotion: "logros" },
    { id: 6, image: "https://picsum.photos/400/400?random=6", description: "Asado de domingo en casa", date: "20/07/2023", emotion: "comida" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        {/* Título de la sección */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recuerdos recientes
        </h2>

        {/* GRID: Aquí definimos las columnas */}
        {/* 1 columna en móvil, 2 en tablet, 3 en escritorio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {mockMemories.map((memory) => (
            <ImageCard 
              key={memory.id}
              image={memory.image}
              description={memory.description}
              date={memory.date}
              emotion={memory.emotion}
            />
          ))}

        </div>
      </main>
    </div>
  );
}