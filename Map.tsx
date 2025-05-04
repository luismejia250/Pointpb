import React, { useRef, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { MapDefinition, MapObject } from '@/lib/maps';

interface MapProps {
  map: MapDefinition;
}

// Component to render a single map object
const MapObjectComponent: React.FC<MapObject> = ({ 
  type, 
  position, 
  rotation, 
  scale, 
  texture, 
  color = '#ffffff',
  isCollider 
}) => {
  // Load texture if provided
  const textureMap = texture ? useTexture(`/textures/${texture}`) : null;
  
  if (textureMap) {
    textureMap.wrapS = textureMap.wrapT = THREE.RepeatWrapping;
    textureMap.repeat.set(scale[0], scale[2]);
  }
  
  // Determine geometry based on type
  let geometry;
  switch (type) {
    case 'box':
      geometry = <boxGeometry args={scale} />;
      break;
    case 'cylinder':
      geometry = <cylinderGeometry args={[scale[0], scale[0], scale[1] * 2, 32]} />;
      break;
    case 'plane':
      geometry = <planeGeometry args={[scale[0] * 2, scale[1] * 2]} />;
      break;
    default:
      geometry = <boxGeometry args={scale} />;
  }
  
  return (
    <mesh position={position} rotation={rotation} castShadow={isCollider} receiveShadow>
      {geometry}
      {textureMap ? (
        <meshStandardMaterial map={textureMap} />
      ) : (
        <meshStandardMaterial color={color} />
      )}
    </mesh>
  );
};

export const Map: React.FC<MapProps> = ({ map }) => {
  const mapRef = useRef<THREE.Group>(null);
  
  // Load skybox texture if available
  const skyTexture = map.skyboxTexture ? useTexture(`/textures/${map.skyboxTexture}`) : null;
  
  // Set up skybox
  useEffect(() => {
    if (!mapRef.current) return;
    
    console.log(`Map ${map.name} loaded`);
  }, [map]);
  
  return (
    <group ref={mapRef}>
      {/* Ambient light based on map settings */}
      <ambientLight intensity={map.ambientLight} />
      
      {/* Main directional light (sun) */}
      <directionalLight 
        position={[50, 50, -30]} 
        intensity={1.5 - map.ambientLight * 0.5} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Skybox */}
      {skyTexture && (
        <mesh position={[0, 0, 0]} scale={[1, 1, 1]}>
          <sphereGeometry args={[500, 60, 40]} />
          <meshBasicMaterial map={skyTexture} side={THREE.BackSide} />
        </mesh>
      )}
      
      {/* Map objects */}
      {map.objects.map((object, index) => (
        <MapObjectComponent key={`map-object-${index}`} {...object} />
      ))}
    </group>
  );
};

export default Map;
