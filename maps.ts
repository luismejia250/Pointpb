export interface MapDefinition {
  id: string;
  name: string;
  description: string;
  size: [number, number]; // width, length
  difficulty: 'easy' | 'medium' | 'hard';
  playerSpawnPoint: [number, number, number];
  enemySpawnPoints?: [number, number, number][];
  objects: MapObject[];
  terrainTexture: string;
  skyboxTexture?: string;
  ambientLight: number; // 0-1 scale
  thumbnail?: string;
}

export interface MapObject {
  type: 'box' | 'cylinder' | 'plane';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  texture?: string;
  color?: string;
  isCollider: boolean;
}

export const maps: Record<string, MapDefinition> = {
  // Mapas originales de Point Blank
  downtown: {
    id: 'downtown',
    name: 'Downtown',
    description: 'Mapa urbano con calles, edificios y túneles. Un clásico de Point Blank.',
    size: [100, 100],
    difficulty: 'medium',
    playerSpawnPoint: [0, 1, 0],
    enemySpawnPoints: [
      [10, 0, 10],
      [-10, 0, 10],
      [10, 0, -10],
      [-10, 0, -10],
      [20, 0, 20],
      [-20, 0, -20]
    ],
    objects: [
      // Suelo principal
      {
        type: 'plane',
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [50, 50, 1],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Edificios
      {
        type: 'box',
        position: [15, 5, 15],
        rotation: [0, 0, 0],
        scale: [8, 10, 8],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-15, 5, -15],
        rotation: [0, 0, 0],
        scale: [8, 10, 8],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Calles y túneles
      {
        type: 'box',
        position: [0, 1, 0],
        rotation: [0, Math.PI / 4, 0],
        scale: [30, 0.2, 5],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [10, 1, 10],
        rotation: [0, -Math.PI / 4, 0],
        scale: [20, 0.2, 5],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Túnel
      {
        type: 'box',
        position: [0, 2, 20],
        rotation: [0, 0, 0],
        scale: [5, 4, 20],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Barreras y objetos
      {
        type: 'box',
        position: [8, 1, 8],
        rotation: [0, Math.PI / 6, 0],
        scale: [1, 2, 4],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [-8, 1, -8],
        rotation: [0, -Math.PI / 6, 0],
        scale: [1, 2, 4],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'cylinder',
        position: [12, 1.5, -12],
        rotation: [0, 0, 0],
        scale: [1.5, 1.5, 1.5],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'cylinder',
        position: [-12, 1.5, 12],
        rotation: [0, 0, 0],
        scale: [1.5, 1.5, 1.5],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Límites del mapa
      {
        type: 'box',
        position: [40, 5, 0],
        rotation: [0, 0, 0],
        scale: [1, 10, 80],
        color: '#555555',
        isCollider: true
      },
      {
        type: 'box',
        position: [-40, 5, 0],
        rotation: [0, 0, 0],
        scale: [1, 10, 80],
        color: '#555555',
        isCollider: true
      },
      {
        type: 'box',
        position: [0, 5, 40],
        rotation: [0, 0, 0],
        scale: [80, 10, 1],
        color: '#555555',
        isCollider: true
      },
      {
        type: 'box',
        position: [0, 5, -40],
        rotation: [0, 0, 0],
        scale: [80, 10, 1],
        color: '#555555',
        isCollider: true
      }
    ],
    terrainTexture: 'asphalt.png',
    skyboxTexture: 'sky.png',
    ambientLight: 0.7
  },
  
  crackdown: {
    id: 'crackdown',
    name: 'Crackdown',
    description: 'Instalación militar con diferentes niveles y pasarelas. Combate a corta y media distancia.',
    size: [80, 80],
    difficulty: 'medium',
    playerSpawnPoint: [0, 1, 15],
    enemySpawnPoints: [
      [15, 0, -15],
      [-15, 0, -15],
      [15, 5, 0],
      [-15, 5, 0],
      [0, 10, -20]
    ],
    objects: [
      // Suelo principal
      {
        type: 'plane',
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [40, 40, 1],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Paredes exteriores
      {
        type: 'box',
        position: [20, 5, 0],
        rotation: [0, 0, 0],
        scale: [1, 10, 40],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-20, 5, 0],
        rotation: [0, 0, 0],
        scale: [1, 10, 40],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [0, 5, 20],
        rotation: [0, 0, 0],
        scale: [40, 10, 1],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [0, 5, -20],
        rotation: [0, 0, 0],
        scale: [40, 10, 1],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Estructuras interiores - Nivel 1
      {
        type: 'box',
        position: [10, 1, 10],
        rotation: [0, 0, 0],
        scale: [5, 2, 5],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [-10, 1, -10],
        rotation: [0, 0, 0],
        scale: [5, 2, 5],
        texture: 'wood.jpg',
        isCollider: true
      },
      // Plataforma nivel 2
      {
        type: 'box',
        position: [10, 5, -10],
        rotation: [0, 0, 0],
        scale: [10, 0.5, 10],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Plataforma nivel 3
      {
        type: 'box',
        position: [-10, 10, 10],
        rotation: [0, 0, 0],
        scale: [8, 0.5, 8],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Rampas y escaleras
      {
        type: 'box',
        position: [5, 2.5, -5],
        rotation: [Math.PI / 8, 0, 0],
        scale: [3, 0.5, 12],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-5, 7.5, 5],
        rotation: [Math.PI / 8, Math.PI, 0],
        scale: [3, 0.5, 12],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Cajas de cobertura
      {
        type: 'box',
        position: [0, 1, 0],
        rotation: [0, Math.PI / 4, 0],
        scale: [2, 2, 2],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [15, 1, -15],
        rotation: [0, 0, 0],
        scale: [2, 2, 2],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [-15, 1, 15],
        rotation: [0, 0, 0],
        scale: [2, 2, 2],
        texture: 'wood.jpg',
        isCollider: true
      }
    ],
    terrainTexture: 'asphalt.png',
    skyboxTexture: 'sky.png',
    ambientLight: 0.6
  },
  
  luxville: {
    id: 'luxville',
    name: 'Luxville',
    description: 'Lujosa zona residencial con mansiones, piscinas y jardines. Perfecto para combates variados.',
    size: [120, 120],
    difficulty: 'medium',
    playerSpawnPoint: [0, 1, 20],
    enemySpawnPoints: [
      [20, 0, -20],
      [-20, 0, -20],
      [20, 0, 0],
      [-20, 0, 0],
      [0, 5, -20]
    ],
    objects: [
      // Suelo principal (césped)
      {
        type: 'plane',
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [60, 60, 1],
        texture: 'grass.png',
        isCollider: true
      },
      // Mansión principal
      {
        type: 'box',
        position: [0, 5, -10],
        rotation: [0, 0, 0],
        scale: [20, 10, 15],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Piscina
      {
        type: 'box',
        position: [0, -0.5, 10],
        rotation: [0, 0, 0],
        scale: [10, 1, 5],
        color: '#0088ff',
        isCollider: true
      },
      // Caminos
      {
        type: 'box',
        position: [0, 0.1, 0],
        rotation: [0, 0, 0],
        scale: [3, 0.1, 25],
        texture: 'asphalt.png',
        isCollider: false
      },
      {
        type: 'box',
        position: [15, 0.1, 0],
        rotation: [0, Math.PI / 2, 0],
        scale: [3, 0.1, 25],
        texture: 'asphalt.png',
        isCollider: false
      },
      {
        type: 'box',
        position: [-15, 0.1, 0],
        rotation: [0, Math.PI / 2, 0],
        scale: [3, 0.1, 25],
        texture: 'asphalt.png',
        isCollider: false
      },
      // Muebles de jardín y decoración
      {
        type: 'box',
        position: [10, 0.5, 10],
        rotation: [0, Math.PI / 6, 0],
        scale: [1, 1, 1],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [12, 0.5, 12],
        rotation: [0, -Math.PI / 6, 0],
        scale: [1, 1, 1],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'cylinder',
        position: [10, 4, -20],
        rotation: [0, 0, 0],
        scale: [1, 8, 1],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'cylinder',
        position: [-10, 4, -20],
        rotation: [0, 0, 0],
        scale: [1, 8, 1],
        texture: 'wood.jpg',
        isCollider: true
      },
      // Casa secundaria
      {
        type: 'box',
        position: [25, 3, 25],
        rotation: [0, 0, 0],
        scale: [10, 6, 10],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-25, 3, -25],
        rotation: [0, 0, 0],
        scale: [10, 6, 10],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Límites del mapa (muros)
      {
        type: 'box',
        position: [50, 5, 0],
        rotation: [0, 0, 0],
        scale: [1, 10, 100],
        color: '#444444',
        isCollider: true
      },
      {
        type: 'box',
        position: [-50, 5, 0],
        rotation: [0, 0, 0],
        scale: [1, 10, 100],
        color: '#444444',
        isCollider: true
      },
      {
        type: 'box',
        position: [0, 5, 50],
        rotation: [0, 0, 0],
        scale: [100, 10, 1],
        color: '#444444',
        isCollider: true
      },
      {
        type: 'box',
        position: [0, 5, -50],
        rotation: [0, 0, 0],
        scale: [100, 10, 1],
        color: '#444444',
        isCollider: true
      }
    ],
    terrainTexture: 'grass.png',
    skyboxTexture: 'sky.png',
    ambientLight: 0.8
  },
  
  midtown: {
    id: 'midtown',
    name: 'Midtown',
    description: 'Centro comercial con múltiples tiendas, pasillos y áreas abiertas. Perfecto para emboscadas.',
    size: [100, 100],
    difficulty: 'hard',
    playerSpawnPoint: [0, 1, 20],
    enemySpawnPoints: [
      [15, 0, -15],
      [-15, 0, -15],
      [15, 0, 0],
      [-15, 0, 0],
      [0, 0, -15]
    ],
    objects: [
      // Suelo principal
      {
        type: 'plane',
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [50, 50, 1],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Estructura central (fuente)
      {
        type: 'cylinder',
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        scale: [8, 2, 8],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Tiendas (lado norte)
      {
        type: 'box',
        position: [0, 3, -20],
        rotation: [0, 0, 0],
        scale: [40, 6, 5],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Tiendas (lado sur)
      {
        type: 'box',
        position: [0, 3, 20],
        rotation: [0, 0, 0],
        scale: [40, 6, 5],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Tiendas (lado este)
      {
        type: 'box',
        position: [20, 3, 0],
        rotation: [0, 0, 0],
        scale: [5, 6, 35],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Tiendas (lado oeste)
      {
        type: 'box',
        position: [-20, 3, 0],
        rotation: [0, 0, 0],
        scale: [5, 6, 35],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Kioscos y estands
      {
        type: 'box',
        position: [10, 1, 10],
        rotation: [0, Math.PI / 4, 0],
        scale: [3, 2, 3],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [-10, 1, -10],
        rotation: [0, Math.PI / 4, 0],
        scale: [3, 2, 3],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [10, 1, -10],
        rotation: [0, -Math.PI / 4, 0],
        scale: [3, 2, 3],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [-10, 1, 10],
        rotation: [0, -Math.PI / 4, 0],
        scale: [3, 2, 3],
        texture: 'wood.jpg',
        isCollider: true
      },
      // Nivel superior (balcones)
      {
        type: 'box',
        position: [15, 6, 15],
        rotation: [0, 0, 0],
        scale: [6, 0.5, 6],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-15, 6, -15],
        rotation: [0, 0, 0],
        scale: [6, 0.5, 6],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [15, 6, -15],
        rotation: [0, 0, 0],
        scale: [6, 0.5, 6],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-15, 6, 15],
        rotation: [0, 0, 0],
        scale: [6, 0.5, 6],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Escaleras
      {
        type: 'box',
        position: [15, 3, 10],
        rotation: [Math.PI / 6, 0, 0],
        scale: [3, 0.5, 10],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-15, 3, -10],
        rotation: [Math.PI / 6, Math.PI, 0],
        scale: [3, 0.5, 10],
        texture: 'asphalt.png',
        isCollider: true
      }
    ],
    terrainTexture: 'asphalt.png',
    skyboxTexture: 'sky.png',
    ambientLight: 0.7
  },
  
  dsthouse: {
    id: 'dsthouse',
    name: 'Dusthouse',
    description: 'Zona desértica con edificios abandonados y estructuras deterioradas. Típico mapa de Point Blank.',
    size: [120, 120],
    difficulty: 'hard',
    playerSpawnPoint: [0, 1, 20],
    enemySpawnPoints: [
      [20, 0, -20],
      [-20, 0, -20],
      [20, 0, 0],
      [-20, 0, 0],
      [0, 0, -20]
    ],
    objects: [
      // Suelo (arena)
      {
        type: 'plane',
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0],
        scale: [60, 60, 1],
        texture: 'sand.jpg',
        isCollider: true
      },
      // Edificio central destruido
      {
        type: 'box',
        position: [0, 3, 0],
        rotation: [0, Math.PI / 12, 0],
        scale: [15, 6, 15],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Parte destruida (hueco)
      {
        type: 'box',
        position: [5, 3, 0],
        rotation: [0, 0, 0],
        scale: [4, 4, 4],
        color: '#000000',
        isCollider: false
      },
      // Escombros y rocas
      {
        type: 'box',
        position: [10, 1, 10],
        rotation: [0, Math.PI / 6, 0],
        scale: [3, 2, 3],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-10, 1, -10],
        rotation: [0, -Math.PI / 6, 0],
        scale: [3, 2, 3],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [15, 0.5, -15],
        rotation: [0, Math.PI / 4, 0],
        scale: [3, 1, 3],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Edificios laterales
      {
        type: 'box',
        position: [25, 4, 25],
        rotation: [0, 0, 0],
        scale: [10, 8, 10],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-25, 4, -25],
        rotation: [0, 0, 0],
        scale: [10, 8, 10],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Pasajes y túneles
      {
        type: 'box',
        position: [15, 1, 0],
        rotation: [0, 0, 0],
        scale: [10, 2, 4],
        texture: 'asphalt.png',
        isCollider: true
      },
      {
        type: 'box',
        position: [-15, 1, 0],
        rotation: [0, 0, 0],
        scale: [10, 2, 4],
        texture: 'asphalt.png',
        isCollider: true
      },
      // Torres de vigilancia
      {
        type: 'box',
        position: [25, 4, 0],
        rotation: [0, 0, 0],
        scale: [2, 8, 2],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [25, 8.5, 0],
        rotation: [0, 0, 0],
        scale: [4, 1, 4],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [-25, 4, 0],
        rotation: [0, 0, 0],
        scale: [2, 8, 2],
        texture: 'wood.jpg',
        isCollider: true
      },
      {
        type: 'box',
        position: [-25, 8.5, 0],
        rotation: [0, 0, 0],
        scale: [4, 1, 4],
        texture: 'wood.jpg',
        isCollider: true
      },
      // Límites del mapa
      {
        type: 'box',
        position: [50, 5, 0],
        rotation: [0, 0, 0],
        scale: [1, 10, 100],
        color: '#664422',
        isCollider: true
      },
      {
        type: 'box',
        position: [-50, 5, 0],
        rotation: [0, 0, 0],
        scale: [1, 10, 100],
        color: '#664422',
        isCollider: true
      },
      {
        type: 'box',
        position: [0, 5, 50],
        rotation: [0, 0, 0],
        scale: [100, 10, 1],
        color: '#664422',
        isCollider: true
      },
      {
        type: 'box',
        position: [0, 5, -50],
        rotation: [0, 0, 0],
        scale: [100, 10, 1],
        color: '#664422',
        isCollider: true
      }
    ],
    terrainTexture: 'sand.jpg',
    skyboxTexture: 'sky.png',
    ambientLight: 0.9
  }
};
