// components/Navbar.jsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo / Título */}
        <Link href="/feed" className="flex items-center gap-2 group">
          {/* Icono de casita o álbum */}
          <span className="text-2xl">🎁</span>
          <span className="text-xl font-bold text-white tracking-wide group-hover:text-amber-200 transition">
            Un lugar lleno de recuerdos
          </span>
        </Link>

        {/* Lado derecho */}
        <div className="flex items-center space-x-4">
          <span className="text-blue-100 text-sm hidden md:inline font-medium">
            Hola, papá
          </span>
          
          {/* Avatar con borde Amarillo/Dorado */}
          <div className="h-9 w-9 bg-white border-2 border-amber-400 rounded-full flex items-center justify-center text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

      </div>
    </nav>
  );
}