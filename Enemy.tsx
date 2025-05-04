import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { enemies, updateEnemyBehavior, shouldEnemyAttack } from '@/lib/enemies';
import { usePointBlank } from '@/lib/stores/usePointBlank';
import { useAudio } from '@/lib/stores/useAudio';

interface EnemyProps {
  id: string;
  type: string;
  position: [number, number, number];
  onEliminate?: (id: string) => void;
}

export const Enemy: React.FC<EnemyProps> = ({ id, type, position, onEliminate }) => {
  const enemyRef = useRef<THREE.Group>(null);
  const [isActive, setIsActive] = useState(true);
  const [health, setHealth] = useState(100);
  const [lastAttackTime, setLastAttackTime] = useState(0);
  const { playHit } = useAudio();
  
  const {
    player,
    gamePhase,
    damageEnemy,
    damagePlayer,
    createBullet
  } = usePointBlank();
  
  // Enemy type definition
  const enemyType = enemies[type] || enemies.basic;
  
  // Initialize enemy
  useEffect(() => {
    if (!enemyRef.current) return;
    
    // Set initial position
    enemyRef.current.position.set(position[0], position[1], position[2]);
    
    // Set initial rotation - face random direction
    enemyRef.current.rotation.y = Math.random() * Math.PI * 2;
    
    console.log(`Enemy ${id} (${type}) initialized at`, position);
    
    // Set initial health
    setHealth(enemyType.health);
  }, [id, type, position, enemyType.health]);
  
  // Update enemy behavior
  useFrame((state, delta) => {
    if (gamePhase !== 'playing' || !isActive || !enemyRef.current) return;
    
    // Get current positions
    const enemyPosition: [number, number, number] = [
      enemyRef.current.position.x,
      enemyRef.current.position.y,
      enemyRef.current.position.z
    ];
    
    // Player position from game state
    const playerPosition = player.position;
    
    // Update position based on AI behavior
    const newPosition = updateEnemyBehavior(
      type,
      enemyPosition,
      playerPosition,
      delta
    );
    
    // Apply new position
    enemyRef.current.position.set(newPosition[0], newPosition[1], newPosition[2]);
    
    // Make enemy face the player
    const dx = playerPosition[0] - enemyPosition[0];
    const dz = playerPosition[2] - enemyPosition[2];
    enemyRef.current.rotation.y = Math.atan2(dx, dz);
    
    // Check if enemy should attack
    const currentTime = state.clock.getElapsedTime();
    if (shouldEnemyAttack(type, enemyPosition, playerPosition) && 
        currentTime - lastAttackTime > 1 / enemyType.attackRate) {
      
      // Attack logic - either shoot at player or melee damage
      if (enemyType.attackRange > 5) {
        // Ranged attack - create bullet
        const direction: [number, number, number] = [
          dx / Math.sqrt(dx * dx + dz * dz),
          0,
          dz / Math.sqrt(dx * dx + dz * dz)
        ];
        
        createBullet(
          newPosition,
          direction,
          20, // bullet speed
          enemyType.damage,
          false // not from player
        );
        
        console.log(`Enemy ${id} shooting at player`);
      } else {
        // Melee attack - direct damage to player
        const distance = Math.sqrt(dx * dx + dz * dz);
        if (distance < 2) {
          damagePlayer(enemyType.damage);
          console.log(`Enemy ${id} hit player for ${enemyType.damage} damage`);
        }
      }
      
      // Update last attack time
      setLastAttackTime(currentTime);
    }
  });
  
  // Listen for damage to this enemy
  useEffect(() => {
    const unsubscribe = usePointBlank.subscribe(
      (state) => state.enemies,
      (enemies) => {
        const enemy = enemies.find(e => e.id === id);
        if (enemy && enemy.health !== health) {
          setHealth(enemy.health);
          
          // Play hit sound
          playHit();
          
          // Check if enemy is eliminated
          if (enemy.health <= 0) {
            setIsActive(false);
            if (onEliminate) onEliminate(id);
          }
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [id, health, onEliminate, playHit]);
  
  return (
    <group ref={enemyRef} position={position} visible={isActive}>
      {/* Enemy body - Point Blank style */}
      <group>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 1.4, 0.6]} />
          <meshStandardMaterial color={enemyType.color} />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#ffcfab" />
        </mesh>
        
        {/* Arms (right) */}
        <mesh position={[0.5, 0.2, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color={enemyType.color} />
        </mesh>
        
        {/* Arms (left) */}
        <mesh position={[-0.5, 0.2, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color={enemyType.color} />
        </mesh>
        
        {/* Legs (right) */}
        <mesh position={[0.25, -1.0, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Legs (left) */}
        <mesh position={[-0.25, -1.0, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Enemy weapon */}
        <group position={[0.6, 0.2, 0.2]} rotation={[0, -0.5, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.1, 0.4]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
        </group>
      </group>
      
      {/* Health bar above enemy */}
      <group position={[0, 2.0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.15, 0.05]} />
          <meshBasicMaterial color="black" />
        </mesh>
        <mesh 
          position={[-(1.2-health/enemyType.health*1.2)/2, 0, 0.03]} 
          scale={[health/enemyType.health, 1, 1]}
        >
          <boxGeometry args={[1.2, 0.12, 0.05]} />
          <meshBasicMaterial color={health > 30 ? '#00ff00' : '#ff0000'} />
        </mesh>
      </group>
    </group>
  );
};

export default Enemy;
