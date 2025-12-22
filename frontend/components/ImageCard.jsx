// components/ImageCard.jsx

export default function ImageCard({ image, description, date, emotion }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      
      {/* Contenedor Imagen */}
      <div className="relative aspect-square bg-gray-200">
        <img 
          src={image} 
          alt={description}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Etiqueta de emoción (Color Dinámico) */}
        {emotion && (
            <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm 
              ${emotion === 'celebración' ? 'bg-amber-400 text-amber-900' : 
                emotion === 'familia' ? 'bg-blue-100 text-blue-800' : 
                'bg-white/90 text-gray-700'
              }`}>
                {emotion}
            </span>
        )}
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="p-4 flex flex-col gap-2">
        {/* Fecha pequeña y discreta */}
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
          {date}
        </p>

        {/* Descripción */}
        <p className="text-gray-800 text-base font-medium leading-snug">
          {description}
        </p>

        {/* Botones de interacción (Decorativos para el MVP) */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
            {/* Corazón Rojo */}
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:fill-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">Me encanta</span>
            </button>
        </div>
      </div>
    </div>
  );
}