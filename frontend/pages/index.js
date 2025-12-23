import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    // Fondo gris muy claro para contraste
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Head>
        <title>Recuerdos de la Familia</title>
      </Head>

      {/* Decoración de fondo (Círculos difusos con tus colores) */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-red-300 rounded-full blur-3xl opacity-30"></div>

      <main className="text-center space-y-8 z-10 max-w-lg bg-white p-10 rounded-2xl shadow-xl border-t-4 border-blue-600">
         
         <div className="flex justify-center">
            <span className="text-6xl">📸</span>
         </div>

         <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
           Hola <span className="text-blue-800">Papá</span> 👋
         </h1>
         
         <p className="text-lg text-gray-600 leading-relaxed">
           He reunido nuestros mejores momentos en un solo lugar. <br/>
           <span className="text-amber-600 font-medium">Fotos, historias y recuerdos.</span>
         </p>
         
         <Link href="/feed">
           <button className="w-full px-8 py-4 bg-blue-800 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-900 hover:shadow-xl transition transform hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center justify-center gap-2">
             <span>Ver Álbum Familiar</span>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
             </svg>
           </button>
         </Link>
      </main>
      
      <p className="absolute bottom-6 text-gray-400 text-sm">
        Hecho con ❤️ para ti
      </p>
    </div>
  );
}