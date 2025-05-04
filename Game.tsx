import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, KeyboardControls } from '@react-three/drei';
import { Player } from '@/components/game/Player';
import { Enemy } from '@/components/game/Enemy';
import { Bullet } from '@/components/game/Bullet';
import { Map } from '@/components/game/Map';
import { Weapon } from '@/components/game/Weapon';
import { Lighting } from '@/components/game/Lighting';
import { GameUI } from '@/components/ui/game-ui';
import { TouchControls } from '@/components/mobile/TouchControls';
import { usePointBlank } from '@/lib/stores/usePointBlank';
import { useNavigate } from 'react-router-dom';
import { controlsMap } from '@/lib/controls';
import { useAudio } from '@/lib/stores/useAudio';

// Loading component for Suspense fallback
const Loader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white">
    <div className="text-xl">Loading game assets...</div>
  </div>
);

export default function Game() {
  const navigate = useNavigate();
  const { 
    gamePhase,
    currentMap, 
    player, 
    enemies, 
    bullets,
    startGame,
    endGame,
    damageEnemy
  } = usePointBlank();
  
  const { backgroundMusic, toggleMute, isMuted } = useAudio();
  
  // Initialize game
  useEffect(() => {
    if (gamePhase === 'menu') {
      startGame('training', 'deathmatch');
    }
    
    // Play background music
    if (backgroundMusic && !backgroundMusic.paused && !isMuted) {
      backgroundMusic.play().catch(error => {
        console.log('Background music play prevented:', error);
      });
    }
    
    return () => {
      // Pause background music when leaving the game
      if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
      }
    };
  }, [gamePhase, startGame, backgroundMusic, isMuted]);
  
  // Handle game exit
  useEffect(() => {
    if (gamePhase === 'menu') {
      navigate('/');
    }
  }, [gamePhase, navigate]);
  
  // Handler for enemy elimination
  const handleEnemyEliminate = (id: string) => {
    console.log(`Enemy ${id} eliminated`);
    
    // Spawn a new enemy after a delay
    setTimeout(() => {
      if (gamePhase === 'playing') {
        const spawnPoint = currentMap.enemySpawnPoints?.[
          Math.floor(Math.random() * (currentMap.enemySpawnPoints?.length || 1))
        ] || [Math.random() * 20 - 10, 0, Math.random() * 20 - 10];
        
        usePointBlank.getState().spawnEnemy(
          'basic', 
          spawnPoint as [number, number, number]
        );
      }
    }, 5000);
  };
  
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000
        }}
      >
        <color attach="background" args={['#1a1a1a']} />
        
        <Suspense fallback={null}>
          {/* Lighting setup */}
          <Lighting />
          
          {/* Map environment */}
          <Map map={currentMap} />
          
          {/* Player */}
          <Player position={currentMap.playerSpawnPoint} />
          
          {/* Current weapon */}
          <Weapon weapon={player.currentWeapon} />
          
          {/* Enemies */}
          {enemies.map(enemy => (
            <Enemy 
              key={enemy.id} 
              id={enemy.id} 
              type={enemy.type} 
              position={enemy.position} 
              onEliminate={handleEnemyEliminate}
            />
          ))}
          
          {/* Bullets */}
          {bullets.map(bullet => (
            <Bullet 
              key={bullet.id} 
              id={bullet.id} 
              position={bullet.position} 
              direction={bullet.direction} 
              speed={bullet.speed} 
              damage={bullet.damage} 
              fromPlayer={bullet.fromPlayer} 
            />
          ))}
        </Suspense>
        
        {/* Performance stats (only shown in development) */}
        {process.env.NODE_ENV === 'development' && <Stats />}
      </Canvas>
      
      {/* Touch controls overlay */}
      <TouchControls visible={gamePhase === 'playing'} />
      
      {/* Game UI overlay */}
      <GameUI />
    </div>
  );
}
