import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePointBlank } from '@/lib/stores/usePointBlank';

interface BulletProps {
  id: string;
  position: [number, number, number];
  direction: [number, number, number];
  speed: number;
  damage: number;
  fromPlayer: boolean;
}

export const Bullet: React.FC<BulletProps> = ({ 
  id, 
  position, 
  direction, 
  speed, 
  damage, 
  fromPlayer 
}) => {
  const bulletRef = useRef<THREE.Mesh>(null);
  const [isActive, setIsActive] = useState(true);
  const lifeTime = useRef(0);
  const maxLifeTime = 5; // seconds
  
  const {
    enemies,
    player,
    gamePhase,
    damageEnemy,
    damagePlayer
  } = usePointBlank();
  
  // Initialize bullet
  useEffect(() => {
    if (!bulletRef.current) return;
    
    // Set initial position
    bulletRef.current.position.set(position[0], position[1], position[2]);
    
    console.log(`Bullet ${id} initialized at position [${position.join(', ')}], direction [${direction.join(', ')}]`);
  }, [id, position, direction]);
  
  // Update bullet position and check collisions
  useFrame((state, delta) => {
    if (gamePhase !== 'playing' || !isActive || !bulletRef.current) return;
    
    // Update lifetime
    lifeTime.current += delta;
    if (lifeTime.current > maxLifeTime) {
      setIsActive(false);
      return;
    }
    
    // Move bullet
    const moveX = direction[0] * speed * delta;
    const moveY = direction[1] * speed * delta;
    const moveZ = direction[2] * speed * delta;
    
    bulletRef.current.position.x += moveX;
    bulletRef.current.position.y += moveY;
    bulletRef.current.position.z += moveZ;
    
    // Get current bullet position
    const bulletPosition = bulletRef.current.position;
    
    // Check for collisions
    if (fromPlayer) {
      // Check collisions with enemies
      for (const enemy of enemies) {
        if (!enemy.isActive) continue;
        
        // Calculate distance to enemy
        const dx = bulletPosition.x - enemy.position[0];
        const dy = bulletPosition.y - enemy.position[1];
        const dz = bulletPosition.z - enemy.position[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Check if hit (using simple sphere collision)
        if (distance < 1) {
          damageEnemy(enemy.id, damage);
          setIsActive(false);
          console.log(`Bullet ${id} hit enemy ${enemy.id} for ${damage} damage`);
          break;
        }
      }
    } else {
      // Check collision with player
      const dx = bulletPosition.x - player.position[0];
      const dy = bulletPosition.y - player.position[1];
      const dz = bulletPosition.z - player.position[2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // Check if hit player
      if (distance < 1) {
        damagePlayer(damage);
        setIsActive(false);
        console.log(`Bullet ${id} hit player for ${damage} damage`);
      }
    }
    
    // Check collision with ground
    if (bulletPosition.y < 0) {
      setIsActive(false);
    }
  });
  
  // Bullet appearance
  return (
    <mesh ref={bulletRef} visible={isActive}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color={fromPlayer ? "#ffff00" : "#ff0000"} />
    </mesh>
  );
};

export default Bullet;
