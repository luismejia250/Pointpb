export interface Character {
  id: string;
  name: string;
  faction: 'ct_force' | 'free_rebels';
  description: string;
  health: number;
  speed: number;
  model?: string;
  thumbnail?: string;
  abilities?: {
    name: string;
    description: string;
    cooldown?: number; // en segundos
  }[];
}

export interface Faction {
  id: 'ct_force' | 'free_rebels';
  name: string;
  description: string;
  color: string;
  logo?: string;
}

// Facciones del juego Point Blank original
export const factions: Record<string, Faction> = {
  ct_force: {
    id: 'ct_force',
    name: 'CT-Force',
    description: 'Equipo de fuerzas especiales de élite encargado de combatir el terrorismo y mantener la paz global.',
    color: '#2a6ac2',
    logo: '/images/ct_force_logo.png'
  },
  free_rebels: {
    id: 'free_rebels',
    name: 'Free Rebels',
    description: 'Grupo paramilitar insurgente que lucha contra lo que consideran opresión gubernamental y corporativa.',
    color: '#b92828',
    logo: '/images/free_rebels_logo.png'
  }
};

// Personajes jugables del Point Blank
export const characters: Record<string, Character> = {
  // CT-Force
  leonard: {
    id: 'leonard',
    name: 'Leonard',
    faction: 'ct_force',
    description: 'Líder estratega de CT-Force. Especialista en combate táctico y asalto coordinado.',
    health: 100,
    speed: 1.0,
    model: '/models/characters/ct_force_male.glb',
    abilities: [
      {
        name: 'Vistazo Táctico',
        description: 'Revela la posición de los enemigos cercanos durante 5 segundos',
        cooldown: 60
      }
    ]
  },
  
  sophie: {
    id: 'sophie',
    name: 'Sophie',
    faction: 'ct_force',
    description: 'Especialista en reconocimiento. Movimientos sigilosos y alta precisión de tiro.',
    health: 90,
    speed: 1.1,
    model: '/models/characters/ct_force_female.glb',
    abilities: [
      {
        name: 'Paso Silencioso',
        description: 'Movimiento silencioso durante 8 segundos',
        cooldown: 45
      }
    ]
  },
  
  michael: {
    id: 'michael',
    name: 'Michael',
    faction: 'ct_force',
    description: 'Experto en demolición y armamento pesado. Alta resistencia al daño.',
    health: 120,
    speed: 0.9,
    model: '/models/characters/ct_force_male.glb',
    abilities: [
      {
        name: 'Blindaje Táctico',
        description: 'Reduce el daño recibido un 50% durante 5 segundos',
        cooldown: 60
      }
    ]
  },
  
  lisa: {
    id: 'lisa',
    name: 'Lisa',
    faction: 'ct_force',
    description: 'Médico de combate. Puede curar a compañeros y a sí misma durante la batalla.',
    health: 85,
    speed: 1.0,
    model: '/models/characters/ct_force_female.glb',
    abilities: [
      {
        name: 'Botiquín',
        description: 'Restaura 30 puntos de salud a sí misma o a un compañero',
        cooldown: 45
      }
    ]
  },
  
  // Free Rebels
  hawk: {
    id: 'hawk',
    name: 'Hawk',
    faction: 'free_rebels',
    description: 'Comandante de los Free Rebels. Experto en tácticas de guerrilla y sabotaje.',
    health: 100,
    speed: 1.0,
    model: '/models/characters/free_rebels_male.glb',
    abilities: [
      {
        name: 'Granada de Humo',
        description: 'Crea una cortina de humo que bloquea la visión durante 10 segundos',
        cooldown: 45
      }
    ]
  },
  
  viper: {
    id: 'viper',
    name: 'Viper',
    faction: 'free_rebels',
    description: 'Asesina silenciosa. Especialista en infiltración y eliminación rápida.',
    health: 85,
    speed: 1.2,
    model: '/models/characters/free_rebels_female.glb',
    abilities: [
      {
        name: 'Sombra',
        description: 'Se vuelve parcialmente invisible durante 6 segundos',
        cooldown: 60
      }
    ]
  },
  
  bull: {
    id: 'bull',
    name: 'Bull',
    faction: 'free_rebels',
    description: 'El tanque de los Free Rebels. Especializado en armas pesadas y resistencia.',
    health: 130,
    speed: 0.8,
    model: '/models/characters/free_rebels_male.glb',
    abilities: [
      {
        name: 'Rabia',
        description: 'Aumenta el daño causado en un 40% durante 8 segundos',
        cooldown: 60
      }
    ]
  },
  
  scarlet: {
    id: 'scarlet',
    name: 'Scarlet',
    faction: 'free_rebels',
    description: 'Ingeniera y experta en explosivos. Puede colocar trampas y minas.',
    health: 90,
    speed: 1.0,
    model: '/models/characters/free_rebels_female.glb',
    abilities: [
      {
        name: 'Trampa Explosiva',
        description: 'Coloca una mina que explota al contacto con el enemigo',
        cooldown: 45
      }
    ]
  }
};

// Función para obtener personajes por facción
export function getCharactersByFaction(factionId: 'ct_force' | 'free_rebels'): Character[] {
  return Object.values(characters).filter(character => character.faction === factionId);
}

// Función para seleccionar un personaje aleatorio de una facción
export function getRandomCharacter(factionId?: 'ct_force' | 'free_rebels'): Character {
  const availableCharacters = factionId 
    ? getCharactersByFaction(factionId)
    : Object.values(characters);
  
  const randomIndex = Math.floor(Math.random() * availableCharacters.length);
  return availableCharacters[randomIndex];
}