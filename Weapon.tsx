import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePointBlank } from '@/lib/stores/usePointBlank';
import { Weapon as WeaponType } from '@/lib/weapons';

interface WeaponProps {
  weapon: WeaponType;
}

export const Weapon: React.FC<WeaponProps> = ({ weapon }) => {
  const weaponRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  // Animation properties
  const recoilAmount = useRef(0);
  const swayAmount = useRef({ x: 0, y: 0 });
  
  // Get game state
  const { player, gamePhase } = usePointBlank();
  
  // Initialize weapon
  useEffect(() => {
    if (!weaponRef.current || !camera) return;
    
    // Add weapon to camera
    camera.add(weaponRef.current);
    
    // Position weapon in front of camera
    weaponRef.current.position.set(0.3, -0.3, -0.5);
    
    console.log(`Weapon ${weapon.name} initialized`);
    
    return () => {
      if (weaponRef.current) {
        camera.remove(weaponRef.current);
      }
    };
  }, [weapon, camera]);
  
  // Weapon animations and updates
  useFrame((state, delta) => {
    if (gamePhase !== 'playing' || !weaponRef.current) return;
    
    // Get firing state
    const isFiring = player.currentWeapon.id === weapon.id && player.ammo[weapon.id] > 0;
    
    // Apply recoil animation
    if (isFiring) {
      recoilAmount.current = Math.min(recoilAmount.current + weapon.recoil * 0.02, weapon.recoil * 0.1);
    } else {
      recoilAmount.current = Math.max(recoilAmount.current - delta * 2, 0);
    }
    
    // Apply recoil to weapon position
    weaponRef.current.position.z = -0.5 + recoilAmount.current;
    
    // Apply weapon sway based on movement
    const targetSwayX = Math.sin(state.clock.elapsedTime * 2) * 0.01;
    const targetSwayY = Math.cos(state.clock.elapsedTime * 3) * 0.01;
    
    swayAmount.current.x += (targetSwayX - swayAmount.current.x) * delta * 2;
    swayAmount.current.y += (targetSwayY - swayAmount.current.y) * delta * 2;
    
    weaponRef.current.rotation.x = swayAmount.current.y;
    weaponRef.current.rotation.y = swayAmount.current.x;
  });
  
  // Render weapon model based on weapon type
  return (
    <group ref={weaponRef}>
      {weapon.type === 'pistol' && (
        <>
          {/* Pistol body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.25]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
          
          {/* Pistol barrel */}
          <mesh position={[0, 0.06, -0.15]}>
            <boxGeometry args={[0.06, 0.06, 0.2]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          
          {/* Pistol handle */}
          <mesh position={[0, -0.13, 0.05]}>
            <boxGeometry args={[0.1, 0.18, 0.12]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          
          {/* Pistol trigger */}
          <mesh position={[0, -0.02, 0.1]}>
            <boxGeometry args={[0.04, 0.04, 0.06]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </>
      )}
      
      {weapon.type === 'rifle' && (
        <>
          {/* Rifle body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.6]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          
          {/* Rifle barrel */}
          <mesh position={[0, 0.03, -0.35]}>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          
          {/* Rifle handle */}
          <mesh position={[0, -0.15, 0.15]}>
            <boxGeometry args={[0.1, 0.2, 0.15]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          
          {/* Rifle stock */}
          <mesh position={[0, 0, 0.35]}>
            <boxGeometry args={[0.1, 0.14, 0.2]} />
            <meshStandardMaterial color="#5a3825" />
          </mesh>
          
          {/* Rifle scope */}
          <group position={[0, 0.12, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          </group>
        </>
      )}
      
      {weapon.type === 'shotgun' && (
        <>
          {/* Shotgun body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.7]} />
            <meshStandardMaterial color="#593723" />
          </mesh>
          
          {/* Shotgun barrels */}
          <mesh position={[0, 0.04, -0.35]}>
            <boxGeometry args={[0.1, 0.06, 0.4]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          
          {/* Shotgun handle */}
          <mesh position={[0, -0.18, 0.2]}>
            <boxGeometry args={[0.08, 0.22, 0.12]} />
            <meshStandardMaterial color="#462a19" />
          </mesh>
          
          {/* Shotgun stock */}
          <mesh position={[0, 0, 0.4]}>
            <boxGeometry args={[0.1, 0.14, 0.25]} />
            <meshStandardMaterial color="#593723" />
          </mesh>
        </>
      )}
      
      {weapon.type === 'sniper' && (
        <>
          {/* Sniper body */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.8]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
          
          {/* Sniper barrel */}
          <mesh position={[0, 0.03, -0.5]}>
            <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          
          {/* Sniper handle */}
          <mesh position={[0, -0.15, 0.15]}>
            <boxGeometry args={[0.08, 0.2, 0.15]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          
          {/* Sniper stock */}
          <mesh position={[0, 0, 0.45]}>
            <boxGeometry args={[0.1, 0.14, 0.3]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          
          {/* Sniper scope */}
          <group position={[0, 0.15, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.25, 8]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
          </group>
          
          {/* Scope lens */}
          <group position={[0, 0.15, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
              <meshStandardMaterial color="#88ccff" />
            </mesh>
          </group>
        </>
      )}
    </group>
  );
};

export default Weapon;
