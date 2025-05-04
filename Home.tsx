import React, { useEffect } from 'react';
import { Menu } from '@/components/ui/menu';
import { useNavigate } from 'react-router-dom';
import { usePointBlank } from '@/lib/stores/usePointBlank';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/lib/stores/useAudio';

export default function Home() {
  const navigate = useNavigate();
  const { gamePhase } = usePointBlank();
  const { toggleMute, isMuted, backgroundMusic } = useAudio();
  
  // Verificar si hay una sesión de juego activa
  useEffect(() => {
    if (gamePhase === 'playing' || gamePhase === 'paused') {
      // Hay una sesión de juego activa
      console.log('Sesión de juego activa detectada');
    }
    
    // Intentar reproducir música de fondo (solo si no está silenciado)
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(error => {
        console.log('No se pudo reproducir la música de fondo:', error);
      });
    }
    
    return () => {
      // Detener música al salir
      if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
      }
    };
  }, [gamePhase, backgroundMusic, isMuted]);
  
  const handleStartGame = () => {
    navigate('/game');
  };
  
  const handleSettings = () => {
    navigate('/settings');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fondo con degradado */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 to-black">
        {/* Aquí se podrían añadir animaciones sutiles */}
      </div>
      
      {/* Banner de reanudar juego si hay uno en progreso */}
      {(gamePhase === 'playing' || gamePhase === 'paused') && (
        <div className="relative z-10 w-full bg-red-600 text-white py-2">
          <div className="container mx-auto flex justify-between items-center px-4">
            <span>Partida en progreso</span>
            <Button 
              size="sm" 
              onClick={() => navigate('/game')}
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              Reanudar
            </Button>
          </div>
        </div>
      )}
      
      {/* Contenido principal */}
      <main className="flex-1 relative z-10">
        <Menu 
          onStart={handleStartGame}
          onSettings={handleSettings}
        />
      </main>
      
      {/* Botón flotante de sonido */}
      <button 
        onClick={toggleMute}
        className="fixed bottom-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label={isMuted ? "Activar sonido" : "Silenciar"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="3" x2="21" y2="21"></line>
            <path d="M18.36 18.36a9.9 9.9 0 0 1-5.36 1.64 10 10 0 0 1-10-10 9.9 9.9 0 0 1 1.64-5.36"></path>
            <path d="M12 12V4a8 8 0 0 1 8 8"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
