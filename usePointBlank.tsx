import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Weapon, weapons } from "../weapons";
import { MapDefinition, maps } from "../maps";
import { GameMode, gameModes } from "../gameModes";

export type GamePhase = "menu" | "loading" | "playing" | "paused" | "gameOver";

interface PlayerState {
  health: number;
  score: number;
  kills: number;
  deaths: number;
  position: [number, number, number];
  rotation: [number, number, number];
  currentWeapon: Weapon;
  weapons: Weapon[];
  ammo: Record<string, number>;
}

interface EnemyState {
  id: string;
  type: string;
  health: number;
  position: [number, number, number];
  rotation: [number, number, number];
  isActive: boolean;
}

interface GameState {
  gamePhase: GamePhase;
  currentMap: MapDefinition;
  currentMode: GameMode;
  player: PlayerState;
  enemies: EnemyState[];
  bullets: {
    id: string;
    position: [number, number, number];
    direction: [number, number, number];
    speed: number;
    damage: number;
    fromPlayer: boolean;
  }[];
  time: number;
  touchControlsVisible: boolean;
  touchControlsLayout: "default" | "custom";
  touchSensitivity: number;
  
  // Actions
  startGame: (mapId: string, modeId: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  
  // Player actions
  movePlayer: (x: number, y: number, z: number) => void;
  rotatePlayer: (x: number, y: number, z: number) => void;
  shootWeapon: () => void;
  reloadWeapon: () => void;
  switchWeapon: (weaponId: string) => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  
  // Enemy actions
  spawnEnemy: (type: string, position: [number, number, number]) => void;
  damageEnemy: (id: string, amount: number) => void;
  
  // Bullet actions
  createBullet: (
    position: [number, number, number], 
    direction: [number, number, number], 
    speed: number, 
    damage: number, 
    fromPlayer: boolean
  ) => void;
  
  // Settings
  setTouchControlsVisible: (visible: boolean) => void;
  setTouchControlsLayout: (layout: "default" | "custom") => void;
  setTouchSensitivity: (sensitivity: number) => void;
}

// Initialize with default values
const initialPlayerState: PlayerState = {
  health: 100,
  score: 0,
  kills: 0,
  deaths: 0,
  position: [0, 1.7, 0],
  rotation: [0, 0, 0],
  // Ensure correct weapon type - start with K-5 pistol
  currentWeapon: {
    ...weapons.k5,
    type: weapons.k5.type as "pistol" | "rifle" | "shotgun" | "sniper"
  },
  weapons: [{
    ...weapons.k5,
    type: weapons.k5.type as "pistol" | "rifle" | "shotgun" | "sniper"
  }, {
    ...weapons.ak47,
    type: weapons.ak47.type as "pistol" | "rifle" | "shotgun" | "sniper"
  }],
  ammo: {
    // Ammo for each weapon type
    pistol: 60,
    rifle: 180,
    shotgun: 40,
    sniper: 20
  }
};

export const usePointBlank = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: "menu",
    currentMap: maps.downtown,
    currentMode: gameModes.deathmatch,
    player: initialPlayerState,
    enemies: [],
    bullets: [],
    time: 0,
    touchControlsVisible: true,
    touchControlsLayout: "default",
    touchSensitivity: 0.5,
    
    startGame: (mapId, modeId) => {
      const selectedMap = maps[mapId as keyof typeof maps] || maps.training;
      const selectedMode = gameModes[modeId as keyof typeof gameModes] || gameModes.deathmatch;
      
      set({ 
        gamePhase: "loading",
        currentMap: selectedMap,
        currentMode: selectedMode,
        player: {
          ...initialPlayerState,
          position: selectedMap.playerSpawnPoint || initialPlayerState.position
        },
        enemies: [],
        bullets: [],
        time: selectedMode.timeLimit || 0
      });
      
      // Simulate loading time
      setTimeout(() => {
        console.log(`Starting game: Map ${selectedMap.name}, Mode ${selectedMode.name}`);
        set({ gamePhase: "playing" });
        
        // Spawn initial enemies based on game mode
        if (selectedMode.enemyCount) {
          for (let i = 0; i < selectedMode.enemyCount; i++) {
            const { spawnEnemy } = get();
            const spawnPoint = selectedMap.enemySpawnPoints?.[
              Math.floor(Math.random() * (selectedMap.enemySpawnPoints?.length || 1))
            ] || [Math.random() * 20 - 10, 0, Math.random() * 20 - 10];
            
            spawnEnemy("basic", spawnPoint as [number, number, number]);
          }
        }
      }, 1500);
    },
    
    pauseGame: () => {
      set({ gamePhase: "paused" });
      console.log("Game paused");
    },
    
    resumeGame: () => {
      set({ gamePhase: "playing" });
      console.log("Game resumed");
    },
    
    endGame: () => {
      set({ gamePhase: "gameOver" });
      console.log("Game over");
    },
    
    restartGame: () => {
      const { currentMap, currentMode } = get();
      set({ 
        gamePhase: "loading",
        player: {
          ...initialPlayerState,
          position: currentMap.playerSpawnPoint || initialPlayerState.position
        },
        enemies: [],
        bullets: [],
        time: currentMode.timeLimit || 0
      });
      
      setTimeout(() => {
        console.log(`Restarting game: Map ${currentMap.name}, Mode ${currentMode.name}`);
        set({ gamePhase: "playing" });
        
        // Respawn enemies
        if (currentMode.enemyCount) {
          for (let i = 0; i < currentMode.enemyCount; i++) {
            const { spawnEnemy } = get();
            const spawnPoint = currentMap.enemySpawnPoints?.[
              Math.floor(Math.random() * (currentMap.enemySpawnPoints?.length || 1))
            ] || [Math.random() * 20 - 10, 0, Math.random() * 20 - 10];
            
            spawnEnemy("basic", spawnPoint as [number, number, number]);
          }
        }
      }, 1500);
    },
    
    movePlayer: (x, y, z) => {
      set(state => ({
        player: {
          ...state.player,
          position: [x, y, z]
        }
      }));
    },
    
    rotatePlayer: (x, y, z) => {
      set(state => ({
        player: {
          ...state.player,
          rotation: [x, y, z]
        }
      }));
    },
    
    shootWeapon: () => {
      const { player, createBullet } = get();
      const weapon = player.currentWeapon;
      const ammo = player.ammo[weapon.id];
      
      if (ammo <= 0) {
        console.log("Out of ammo!");
        return;
      }
      
      // Calculate bullet direction based on player rotation
      const direction: [number, number, number] = [
        -Math.sin(player.rotation[1]), 
        0, 
        -Math.cos(player.rotation[1])
      ];
      
      // Create bullet
      createBullet(
        [...player.position] as [number, number, number], 
        direction, 
        weapon.bulletSpeed, 
        weapon.damage,
        true
      );
      
      // Update ammo
      set(state => ({
        player: {
          ...state.player,
          ammo: {
            ...state.player.ammo,
            [weapon.id]: state.player.ammo[weapon.id] - 1
          }
        }
      }));
      
      console.log(`Shot fired with ${weapon.name}, ammo left: ${ammo - 1}`);
    },
    
    reloadWeapon: () => {
      const { player } = get();
      const weapon = player.currentWeapon;
      
      // Simplified reload - just gives full ammo
      set(state => ({
        player: {
          ...state.player,
          ammo: {
            ...state.player.ammo,
            [weapon.id]: weapon.maxAmmo
          }
        }
      }));
      
      console.log(`Reloaded ${weapon.name}`);
    },
    
    switchWeapon: (weaponId) => {
      const { player } = get();
      const weapon = weapons[weaponId as keyof typeof weapons];
      
      if (!weapon || !player.weapons.some(w => w.id === weaponId)) {
        console.log("Weapon not available");
        return;
      }
      
      // Ensure the weapon type is correctly typed as one of the allowed types
      const typedWeapon: Weapon = {
        ...weapon,
        type: weapon.type as "pistol" | "rifle" | "shotgun" | "sniper"
      };
      
      set(state => ({
        player: {
          ...state.player,
          currentWeapon: typedWeapon
        }
      }));
      
      console.log(`Switched to ${weapon.name}`);
    },
    
    damagePlayer: (amount) => {
      set(state => {
        const newHealth = Math.max(0, state.player.health - amount);
        const newDeaths = newHealth <= 0 ? state.player.deaths + 1 : state.player.deaths;
        
        if (newHealth <= 0) {
          console.log("Player died");
        }
        
        return {
          player: {
            ...state.player,
            health: newHealth,
            deaths: newDeaths
          }
        };
      });
    },
    
    healPlayer: (amount) => {
      set(state => ({
        player: {
          ...state.player,
          health: Math.min(100, state.player.health + amount)
        }
      }));
    },
    
    spawnEnemy: (type, position) => {
      const enemyId = `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      set(state => ({
        enemies: [
          ...state.enemies,
          {
            id: enemyId,
            type,
            health: 100,
            position,
            rotation: [0, Math.random() * Math.PI * 2, 0],
            isActive: true
          }
        ]
      }));
      
      console.log(`Spawned enemy ${enemyId} at position [${position.join(", ")}]`);
    },
    
    damageEnemy: (id, amount) => {
      set(state => {
        const enemies = [...state.enemies];
        const enemyIndex = enemies.findIndex(e => e.id === id);
        
        if (enemyIndex === -1) return state;
        
        const enemy = enemies[enemyIndex];
        const newHealth = Math.max(0, enemy.health - amount);
        
        if (newHealth <= 0) {
          // Enemy eliminated
          console.log(`Enemy ${id} eliminated`);
          enemies.splice(enemyIndex, 1);
          
          return {
            enemies,
            player: {
              ...state.player,
              score: state.player.score + 100,
              kills: state.player.kills + 1
            }
          };
        }
        
        enemies[enemyIndex] = {
          ...enemy,
          health: newHealth
        };
        
        return { enemies };
      });
    },
    
    createBullet: (position, direction, speed, damage, fromPlayer) => {
      const bulletId = `bullet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      set(state => ({
        bullets: [
          ...state.bullets,
          {
            id: bulletId,
            position,
            direction,
            speed,
            damage,
            fromPlayer
          }
        ]
      }));
    },
    
    setTouchControlsVisible: (visible) => {
      set({ touchControlsVisible: visible });
    },
    
    setTouchControlsLayout: (layout) => {
      set({ touchControlsLayout: layout });
    },
    
    setTouchSensitivity: (sensitivity) => {
      set({ touchSensitivity: sensitivity });
    }
  }))
);
