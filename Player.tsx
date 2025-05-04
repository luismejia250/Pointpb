import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { usePointBlank } from '@/lib/stores/usePointBlank';
import { ControlName, MOVEMENT } from '@/lib/controls';
import { useTouchControls } from '@/lib/hooks/useTouchControls';
import { factions, characters } from '@/lib/characters';

interface PlayerProps {
  position: [number, number, number];
  faction?: 'ct_force' | 'free_rebels';
  characterId?: string;
}

export const Player: React.FC<PlayerProps> = ({ position, faction = 'ct_force', characterId }) => {
  // Seleccionar un personaje basado en facción y characterId
  const character = characterId ? 
    characters[characterId] : 
    Object.values(characters).find(char => char.faction === faction) || characters.leonard;
  
  // Colores de la facción para elementos visuales
  const factionColors = faction === 'ct_force' ? 
    { primary: '#2a6ac2', secondary: '#336ed3', dark: '#183b5f' } : 
    { primary: '#b92828', secondary: '#d33f3f', dark: '#7a1c1c' };
  const playerRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const touchSensitivity = usePointBlank(state => state.touchSensitivity);
  const touchControls = useTouchControls(touchSensitivity);
  
  // Get keyboard controls state
  const forward = useKeyboardControls<ControlName>(state => state.forward);
  const backward = useKeyboardControls<ControlName>(state => state.backward);
  const leftward = useKeyboardControls<ControlName>(state => state.leftward);
  const rightward = useKeyboardControls<ControlName>(state => state.rightward);
  const jump = useKeyboardControls<ControlName>(state => state.jump);
  const sprint = useKeyboardControls<ControlName>(state => state.sprint);
  const crouch = useKeyboardControls<ControlName>(state => state.crouch);
  const shoot = useKeyboardControls<ControlName>(state => state.shoot);
  const aim = useKeyboardControls<ControlName>(state => state.aim);
  const reload = useKeyboardControls<ControlName>(state => state.reload);
  
  // Store camera state
  const { camera } = useThree();
  
  // Get game state and actions
  const { 
    player,
    gamePhase,
    movePlayer,
    rotatePlayer,
    shootWeapon,
    reloadWeapon
  } = usePointBlank();
  
  // Initialize player and camera positions
  useEffect(() => {
    if (!playerRef.current || !cameraRef.current) return;
    
    // Set initial player position from props
    playerRef.current.position.set(position[0], position[1], position[2]);
    
    // Set initial player position in game state
    movePlayer(position[0], position[1], position[2]);
    
    // Set main camera as child of player
    if (cameraRef.current) {
      camera.position.set(0, 1.7, 0); // Eye height
      camera.rotation.set(0, 0, 0);
      playerRef.current.add(camera);
    }
    
    console.log('Player initialized at', position);
  }, [position, movePlayer, camera]);
  
  // Mouse movement for camera rotation
  const [yaw, setYaw] = React.useState(0);
  const [pitch, setPitch] = React.useState(0);
  
  // Apply player velocity, gravity and collisions
  const velocity = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef<boolean>(true);
  
  // Game loop - handle player movement and actions
  useFrame((state, delta) => {
    if (gamePhase !== 'playing') return;
    if (!playerRef.current) return;
    
    // Get current player position
    const playerPosition = playerRef.current.position;
    
    // Calculate movement direction
    let moveX = 0;
    let moveZ = 0;
    
    // Keyboard input
    if (forward) moveZ -= 1;
    if (backward) moveZ += 1;
    if (leftward) moveX -= 1;
    if (rightward) moveX += 1;
    
    // Touch input (combine with keyboard input)
    moveX += touchControls.movement.x;
    moveZ += touchControls.movement.y;
    
    // Normalize movement vector for consistent speed in diagonals
    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;
    }
    
    // Apply speed based on sprint/crouch
    let speed = MOVEMENT.WALK_SPEED;
    if (sprint || touchControls.actions.aiming) speed = MOVEMENT.RUN_SPEED;
    if (crouch) speed = MOVEMENT.CROUCH_SPEED;
    
    // Camera rotation (keyboard/mouse)
    // Apply camera rotation changes from touch controls
    setYaw(prevYaw => prevYaw + touchControls.camera.x * 5);
    setPitch(prevPitch => {
      // Clamp pitch to prevent camera flipping
      const newPitch = prevPitch - touchControls.camera.y * 5;
      return Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, newPitch));
    });
    
    // Update player rotation
    const rotationY = yaw; // Horizontal rotation
    playerRef.current.rotation.y = rotationY;
    
    // Update camera pitch
    if (camera) {
      camera.rotation.x = pitch; // Vertical rotation (looking up/down)
    }
    
    // Update game state rotation
    rotatePlayer(pitch, rotationY, 0);
    
    // Calculate velocity based on movement direction and rotation
    const rotatedMoveX = moveX * Math.cos(rotationY) - moveZ * Math.sin(rotationY);
    const rotatedMoveZ = moveX * Math.sin(rotationY) + moveZ * Math.cos(rotationY);
    
    velocity.current.x = rotatedMoveX * speed * delta;
    velocity.current.z = rotatedMoveZ * speed * delta;
    
    // Apply gravity and jumping
    if (!isGrounded.current) {
      velocity.current.y += MOVEMENT.GRAVITY * delta;
    } else if (jump || touchControls.actions.jumping) {
      velocity.current.y = MOVEMENT.JUMP_FORCE * delta;
      isGrounded.current = false;
    }
    
    // Apply velocity to position
    playerPosition.x += velocity.current.x;
    playerPosition.y += velocity.current.y;
    playerPosition.z += velocity.current.z;
    
    // Simple ground collision
    if (playerPosition.y < position[1]) {
      playerPosition.y = position[1];
      velocity.current.y = 0;
      isGrounded.current = true;
    }
    
    // Update position in game state
    movePlayer(playerPosition.x, playerPosition.y, playerPosition.z);
    
    // Handle shooting
    if (shoot || touchControls.actions.shooting) {
      shootWeapon();
    }
    
    // Handle reloading
    if (reload || touchControls.actions.reloading) {
      reloadWeapon();
    }
  });
  
  return (
    <group ref={playerRef} position={position}>
      {/* Player body - Point Blank style */}
      <group visible={false}> {/* Invisible in first person but exists for collision */}
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.7, 1.4, 0.5]} />
          <meshStandardMaterial color={factionColors.primary} />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        
        {/* Arms (right) */}
        <mesh position={[0.4, 0.3, 0]}>
          <boxGeometry args={[0.25, 0.8, 0.25]} />
          <meshStandardMaterial color={factionColors.secondary} />
        </mesh>
        
        {/* Arms (left) */}
        <mesh position={[-0.4, 0.3, 0]}>
          <boxGeometry args={[0.25, 0.8, 0.25]} />
          <meshStandardMaterial color={factionColors.secondary} />
        </mesh>
        
        {/* Legs (right) */}
        <mesh position={[0.2, -0.9, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color={factionColors.dark} />
        </mesh>
        
        {/* Legs (left) */}
        <mesh position={[-0.2, -0.9, 0]}>
          <boxGeometry args={[0.3, 0.8, 0.3]} />
          <meshStandardMaterial color={factionColors.dark} />
        </mesh>
      </group>
      
      {/* Cargar modelo 3D si está disponible */}
      {character.model && (
        <group scale={[0.7, 0.7, 0.7]} position={[0, -1.7, 0]} visible={false}>
          {/* El modelo se cargaría aquí cuando esté disponible */}
          {/* <primitive object={characterModel.scene} /> */}
        </group>
      )}
      
      {/* Player camera at eye level */}
      <perspectiveCamera ref={cameraRef} fov={75} near={0.1} far={1000} />
    </group>
  );
};

export default Player;
