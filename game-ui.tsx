import React from 'react';
import { usePointBlank } from '@/lib/stores/usePointBlank';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';
import { characters, factions } from '@/lib/characters';

interface GameUIProps {
  className?: string;
}

export const GameUI: React.FC<GameUIProps> = ({ className }) => {
  const { 
    player, 
    gamePhase, 
    pauseGame,
    resumeGame,
    restartGame,
    endGame
  } = usePointBlank();
  
  if (gamePhase === 'loading') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }
  
  if (gamePhase === 'paused') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <Card className="w-80 p-6">
          <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
          <div className="space-y-2">
            <Button className="w-full" onClick={resumeGame}>Resume</Button>
            <Button className="w-full" variant="outline" onClick={restartGame}>Restart</Button>
            <Button className="w-full" variant="destructive" onClick={endGame}>Quit</Button>
          </div>
        </Card>
      </div>
    );
  }
  
  if (gamePhase === 'gameOver') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <Card className="w-80 p-6">
          <h2 className="text-2xl font-bold mb-2">Game Over</h2>
          <div className="mb-4">
            <p>Score: {player.score}</p>
            <p>Kills: {player.kills}</p>
            <p>Deaths: {player.deaths}</p>
          </div>
          <div className="space-y-2">
            <Button className="w-full" onClick={restartGame}>Play Again</Button>
            <Button className="w-full" variant="outline" onClick={endGame}>Quit</Button>
          </div>
        </Card>
      </div>
    );
  }
  
  // Main HUD for gameplay
  return (
    <div className={cn("fixed inset-0 pointer-events-none", className)}>
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="12" cy="12" r="1" fill="white" />
          <line x1="12" y1="6" x2="12" y2="9" />
          <line x1="12" y1="15" x2="12" y2="18" />
          <line x1="6" y1="12" x2="9" y2="12" />
          <line x1="15" y1="12" x2="18" y2="12" />
        </svg>
      </div>
      
      {/* Health bar */}
      <div className="absolute bottom-6 left-6 w-48">
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden shadow-lg">
          <div 
            className={cn(
              "h-full rounded-full transition-all",
              player.health > 50 ? "bg-green-500" : 
              player.health > 20 ? "bg-yellow-500" : "bg-red-500"
            )}
            style={{ width: `${player.health}%` }}
          />
        </div>
        <div className="flex justify-between text-white text-xs mt-1">
          <span>HP</span>
          <span>{player.health}/100</span>
        </div>
      </div>
      
      {/* Ammo counter */}
      <div className="absolute bottom-6 right-6 text-white text-xl font-bold">
        <div className="flex items-center justify-end space-x-1">
          <span>{player.ammo[player.currentWeapon?.id || 'k5'] || 0}</span>
          <span className="text-gray-400 text-sm">/ {player.currentWeapon?.maxAmmo || 30}</span>
        </div>
        <div className="text-sm text-right mt-1">{player.currentWeapon?.name || 'K-5'}</div>
      </div>
      
      {/* Score & stats */}
      <div className="absolute top-4 right-4 text-white">
        <div className="bg-black bg-opacity-50 px-3 py-1 rounded">
          <div className="text-sm">Score: {player.score}</div>
          <div className="text-xs">Kills: {player.kills}</div>
        </div>
      </div>
      
      {/* Pause button */}
      <div className="absolute top-4 left-4">
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0 bg-black bg-opacity-60 rounded-full pointer-events-auto"
          onClick={pauseGame}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
          <span className="sr-only">Pause</span>
        </Button>
      </div>
    </div>
  );
};

export default GameUI;
