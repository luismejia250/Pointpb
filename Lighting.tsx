import React from 'react';
import { usePointBlank } from '@/lib/stores/usePointBlank';

export const Lighting: React.FC = () => {
  const { currentMap } = usePointBlank();
  
  return (
    <>
      {/* Base ambient light */}
      <ambientLight intensity={currentMap.ambientLight || 0.5} />
      
      {/* Main directional light (sun) */}
      <directionalLight 
        position={[50, 50, -30]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Fill light from opposite direction */}
      <directionalLight 
        position={[-50, 30, 50]} 
        intensity={0.3} 
      />
    </>
  );
};

export default Lighting;
