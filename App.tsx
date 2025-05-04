import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { usePointBlank } from "./lib/stores/usePointBlank";
import { controlsMap } from "./lib/controls";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Settings from "./pages/Settings";
import NotFound from "./pages/not-found";
import "@fontsource/inter";

// Loader component for Suspense fallback
const Loader = () => (
  <div className="w-full h-full flex items-center justify-center bg-background">
    <div className="text-foreground text-xl">Loading...</div>
  </div>
);

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound,
    setShootSound,
    setReloadSound,
    setEnemyHitSound,
    setPlayerHitSound,
    setGameOverSound,
    setVolume
  } = useAudio();
  const { gamePhase } = usePointBlank();

  // Load game sounds
  useEffect(() => {
    // Configurar música de fondo
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;

    // Cargar efectos de sonido básicos
    const hitSfx = new Audio("/sounds/hit.mp3");
    const successSfx = new Audio("/sounds/success.mp3");
    
    // Cargar efectos de armas
    const shootSfx = new Audio("/sounds/weapons/hit.mp3"); // Reutilizamos temporalmente
    
    // Cargar efectos de recarga
    const reloadSfx = new Audio("/sounds/hit.mp3"); // Reutilizamos temporalmente
    
    // Cargar efectos de impacto
    const enemyHitSfx = new Audio("/sounds/hit.mp3"); 
    const playerHitSfx = new Audio("/sounds/hit.mp3"); 
    
    // Cargar efecto de fin de juego
    const gameOverSfx = new Audio("/sounds/success.mp3"); // Reutilizamos temporalmente

    // Configurar volumen inicial
    setVolume(0.3);
    
    // Asignar todos los sonidos al estado
    setBackgroundMusic(bgMusic);
    setHitSound(hitSfx);
    setSuccessSound(successSfx);
    setShootSound(shootSfx);
    setReloadSound(reloadSfx);
    setEnemyHitSound(enemyHitSfx);
    setPlayerHitSound(playerHitSfx);
    setGameOverSound(gameOverSfx);

    const preloadAssets = async () => {
      // Simular carga de recursos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAssetsLoaded(true);
    };

    preloadAssets();

    // Registrar que la app ha sido cargada
    console.log("Point Blank Mobile initialized");
    
    return () => {
      // Detener todos los sonidos al desmontar
      bgMusic.pause();
      hitSfx.pause();
      successSfx.pause();
      shootSfx.pause();
      reloadSfx.pause();
      enemyHitSfx.pause();
      playerHitSfx.pause();
      gameOverSfx.pause();
    };
  }, [
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound, 
    setShootSound,
    setReloadSound,
    setEnemyHitSound,
    setPlayerHitSound,
    setGameOverSound,
    setVolume
  ]);

  if (!assetsLoaded) {
    return <Loader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardControls map={controlsMap}>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </KeyboardControls>
    </QueryClientProvider>
  );
}

export default App;
