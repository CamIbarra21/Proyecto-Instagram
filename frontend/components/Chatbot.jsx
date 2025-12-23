import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mensaje inicial de bienvenida
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: '¡Hola Papá! 👋 Soy tu memoria digital. Escribe algo como "Navidad" o "Abuelos" y buscaré esas fotos para ti.',
      images: []
    }
  ]);

  // Referencia para bajar el scroll automáticamente al nuevo mensaje
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Agregar mensaje del usuario
    const userMessage = { role: 'user', text: input, images: [] };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput(''); // Limpiar input

    setIsLoading(true);

    try {
      // 2. Enviar a Python (FastAPI)
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });
      
      const data = await res.json();

      // 3. Mostrar respuesta de la IA
      const botResponse = { 
        role: 'bot', 
        text: data.text,
        images: data.images || [] // Array de imágenes que devuelve Python
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'bot', text: 'Ups, tuve un problema conectando con mi memoria (Backend error).', images: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* --- VENTANA DEL CHAT (Solo visible si isOpen es true) --- */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col transition-all duration-300 transform origin-bottom-right">
          
          {/* Cabecera Azul */}
          <div className="bg-blue-800 p-4 flex justify-between items-center text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-bold text-sm">Asistente de texto</h3>
                <p className="text-xs text-blue-200">En línea</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white">✕</button>
          </div>

          {/* Area de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Burbuja de Texto */}
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm mb-1 ${
                    msg.role === 'user' 
                      ? 'bg-blue-800 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* IMÁGENES EN EL CHAT (Si la IA devolvió alguna) */}
                {msg.images && msg.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto max-w-full pb-2 mt-1 px-1">
                        {msg.images.map((img) => (
                            <div key={img.id} className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group">
                                <img src={img.image_path} alt={img.description} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-1">
                                    <p className="text-[10px] text-white leading-tight line-clamp-2">{img.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            ))}
            
            {/* Indicador de "Escribiendo..." */}
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none text-gray-400 text-xs italic shadow-sm">
                        Buscando recuerdos...
                    </div>
                </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Pregunta por un recuerdo..."
              className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition shadow-md flex items-center justify-center w-10 h-10 disabled:opacity-50"
            >
              ➤
            </button>
          </div>

        </div>
      )}

      {/* Botón Flotante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-gray-500 rotate-90' : 'bg-red-600 hover:bg-red-700 animate-bounce-slow'} 
          text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 border-4 border-white`}
      >
        {isOpen ? '✕' : '💬'}
      </button>

    </div>
  );
}