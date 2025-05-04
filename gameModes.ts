export interface GameMode {
  id: string;
  name: string;
  description: string;
  timeLimit?: number; // seconds, undefined for no limit
  scoreLimit?: number; // undefined for no limit
  respawnEnabled: boolean;
  respawnTime?: number; // seconds
  friendlyFire: boolean;
  enemyCount?: number; // for single player modes
  difficulty: 'easy' | 'medium' | 'hard';
  teamBased: boolean;
}

// Modos de juego originales del Point Blank
export const gameModes: Record<string, GameMode> = {
  deathmatch: {
    id: 'deathmatch',
    name: 'Duelo a Muerte',
    description: 'Todos contra todos. Gana el jugador con mayor puntuación.',
    timeLimit: 600, // 10 minutos
    scoreLimit: 30,
    respawnEnabled: true,
    respawnTime: 5,
    friendlyFire: true,
    difficulty: 'medium',
    teamBased: false
  },
  
  teamDeathmatch: {
    id: 'teamDeathmatch',
    name: 'Duelo por Equipos',
    description: 'Dos equipos se enfrentan. Gana el equipo con mayor puntuación.',
    timeLimit: 600, // 10 minutos
    scoreLimit: 50,
    respawnEnabled: true,
    respawnTime: 5,
    friendlyFire: false,
    difficulty: 'medium',
    teamBased: true
  },
  
  destroy: {
    id: 'destroy',
    name: 'Destrucción',
    description: 'Un equipo debe plantar la bomba y el otro defenderla. Equipos alternan roles.',
    timeLimit: 120, // 2 minutos por ronda
    respawnEnabled: false,
    friendlyFire: false,
    difficulty: 'hard',
    teamBased: true
  },
  
  conquest: {
    id: 'conquest',
    name: 'Conquista',
    description: 'Captura y mantén puntos de control para ganar puntos. Gana quien llegue primero a la puntuación límite.',
    timeLimit: 900, // 15 minutos
    scoreLimit: 200,
    respawnEnabled: true,
    respawnTime: 6,
    friendlyFire: false,
    difficulty: 'medium',
    teamBased: true
  },
  
  escort: {
    id: 'escort',
    name: 'Escolta',
    description: 'Un equipo debe escoltar el VIP a la zona de extracción, mientras el otro intenta eliminarlo.',
    timeLimit: 300, // 5 minutos por ronda
    respawnEnabled: false,
    friendlyFire: false,
    difficulty: 'hard',
    teamBased: true
  },
  
  freeForAll: {
    id: 'freeForAll',
    name: 'Todos Contra Todos',
    description: 'Modo caótico sin equipos. El objetivo es conseguir la mayor cantidad de eliminaciones.',
    timeLimit: 600, // 10 minutos
    scoreLimit: 40,
    respawnEnabled: true,
    respawnTime: 3,
    friendlyFire: true,
    difficulty: 'medium',
    teamBased: false
  },
  
  zombieMode: {
    id: 'zombieMode',
    name: 'Modo Zombie',
    description: 'Sobrevive a hordas de zombies. Los jugadores eliminados se convierten en zombies.',
    timeLimit: 600, // 10 minutos
    respawnEnabled: true,
    respawnTime: 8,
    friendlyFire: false,
    enemyCount: 20,
    difficulty: 'hard',
    teamBased: true
  },
  
  training: {
    id: 'training',
    name: 'Entrenamiento',
    description: 'Practica tus habilidades contra objetivos estacionarios.',
    respawnEnabled: true,
    respawnTime: 2,
    friendlyFire: false,
    enemyCount: 5,
    difficulty: 'easy',
    teamBased: false
  }
};
