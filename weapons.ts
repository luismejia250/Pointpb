export interface Weapon {
  id: string;
  name: string;
  type: "pistol" | "rifle" | "shotgun" | "sniper";
  damage: number;
  fireRate: number; // shots per second
  maxAmmo: number;
  reloadTime: number; // seconds
  accuracy: number; // 0-1 scale
  recoil: number; // 0-1 scale
  bulletSpeed: number;
  bulletCount: number; // for shotguns
  range: number;
  model?: string;
  icon?: string;
  // For displaying weapon info
  stats: {
    damage: number; // 0-100
    range: number; // 0-100
    accuracy: number; // 0-100
    fireRate: number; // 0-100
    mobility: number; // 0-100
  };
}

export type WeaponId = 'k5' | 'd_eagle' | 'kriss' | 'p90' | 'k2' | 'ak47' | 'spas12' | 'm1887' | 'l96a1' | 'awm' | 'cheytac';

export interface WeaponsRecord {
  [key: string]: Weapon;
}

// Armas originales del Point Blank
export const weapons: WeaponsRecord = {
  // Pistolas
  k5: {
    id: "k5",
    name: "K-5",
    type: "pistol",
    damage: 28,
    fireRate: 2.8,
    maxAmmo: 30,
    reloadTime: 1.2,
    accuracy: 0.85,
    recoil: 0.18,
    bulletSpeed: 30,
    bulletCount: 1,
    range: 45,
    model: "/models/weapons/pistol.glb", // Modelo generado
    stats: {
      damage: 55,
      range: 40,
      accuracy: 75,
      fireRate: 35,
      mobility: 95
    }
  },
  
  d_eagle: {
    id: "d_eagle",
    name: "D-Eagle",
    type: "pistol",
    damage: 35,
    fireRate: 2.2,
    maxAmmo: 28,
    reloadTime: 1.6,
    accuracy: 0.82,
    recoil: 0.25,
    bulletSpeed: 32,
    bulletCount: 1,
    range: 50,
    model: "/models/weapons/pistol.glb", // Modelo generado
    stats: {
      damage: 65,
      range: 45,
      accuracy: 70,
      fireRate: 30,
      mobility: 90
    }
  },
  
  // Rifles de asalto
  k2: {
    id: "k2",
    name: "K-2",
    type: "rifle",
    damage: 22,
    fireRate: 10.5,
    maxAmmo: 90,
    reloadTime: 2.2,
    accuracy: 0.78,
    recoil: 0.38,
    bulletSpeed: 40,
    bulletCount: 1,
    range: 80,
    model: "/models/weapons/assault_rifle.glb", // Modelo generado
    stats: {
      damage: 55,
      range: 70,
      accuracy: 65,
      fireRate: 80,
      mobility: 65
    }
  },
  
  ak47: {
    id: "ak47",
    name: "AK-47",
    type: "rifle",
    damage: 25,
    fireRate: 9.0,
    maxAmmo: 90,
    reloadTime: 2.4,
    accuracy: 0.72,
    recoil: 0.45,
    bulletSpeed: 38,
    bulletCount: 1,
    range: 75,
    model: "/models/weapons/assault_rifle.glb", // Modelo generado
    stats: {
      damage: 60,
      range: 65,
      accuracy: 60,
      fireRate: 70,
      mobility: 60
    }
  },
  
  // Subfusiles
  kriss: {
    id: "kriss",
    name: "Kriss",
    type: "rifle",
    damage: 18,
    fireRate: 12.5,
    maxAmmo: 120,
    reloadTime: 1.8,
    accuracy: 0.70,
    recoil: 0.30,
    bulletSpeed: 35,
    bulletCount: 1,
    range: 60,
    model: "/models/weapons/assault_rifle.glb", // Modelo generado
    stats: {
      damage: 45,
      range: 55,
      accuracy: 60,
      fireRate: 90,
      mobility: 75
    }
  },
  
  p90: {
    id: "p90",
    name: "P90",
    type: "rifle",
    damage: 16,
    fireRate: 13.2,
    maxAmmo: 150,
    reloadTime: 2.0,
    accuracy: 0.68,
    recoil: 0.28,
    bulletSpeed: 35,
    bulletCount: 1,
    range: 55,
    model: "/models/weapons/assault_rifle.glb", // Modelo generado
    stats: {
      damage: 40,
      range: 50,
      accuracy: 55,
      fireRate: 95,
      mobility: 80
    }
  },
  
  // Escopetas
  spas12: {
    id: "spas12",
    name: "SPAS-12",
    type: "shotgun",
    damage: 16,
    fireRate: 1.5,
    maxAmmo: 20,
    reloadTime: 2.5,
    accuracy: 0.6,
    recoil: 0.6,
    bulletSpeed: 25,
    bulletCount: 8,
    range: 20,
    model: "/models/weapons/assault_rifle.glb", // Modelo generado
    stats: {
      damage: 90,
      range: 20,
      accuracy: 30,
      fireRate: 20,
      mobility: 50
    }
  },
  
  m1887: {
    id: "m1887",
    name: "M1887",
    type: "shotgun",
    damage: 18,
    fireRate: 1.2,
    maxAmmo: 16,
    reloadTime: 2.8,
    accuracy: 0.55,
    recoil: 0.65,
    bulletSpeed: 24,
    bulletCount: 9,
    range: 18,
    model: "/models/weapons/assault_rifle.glb", // Modelo generado
    stats: {
      damage: 95,
      range: 18,
      accuracy: 25,
      fireRate: 15,
      mobility: 45
    }
  },
  
  // Francotiradores
  l96a1: {
    id: "l96a1",
    name: "L96A1",
    type: "sniper",
    damage: 120,
    fireRate: 0.8,
    maxAmmo: 10,
    reloadTime: 3.2,
    accuracy: 0.95,
    recoil: 0.8,
    bulletSpeed: 50,
    bulletCount: 1,
    range: 150,
    model: "/models/weapons/assault_rifle.glb", // Modelo generado
    stats: {
      damage: 100,
      range: 100,
      accuracy: 95,
      fireRate: 10,
      mobility: 30
    }
  },
  
  awm: {
    id: "awm",
    name: "AWM",
    type: "sniper",
    damage: 130,
    fireRate: 0.7,
    maxAmmo: 8,
    reloadTime: 3.5,
    accuracy: 0.98,
    recoil: 0.85,
    bulletSpeed: 55,
    bulletCount: 1,
    range: 160,
    model: "/models/weapons/assault_rifle.glb", // Modelo generado
    stats: {
      damage: 100,
      range: 100,
      accuracy: 98,
      fireRate: 8,
      mobility: 25
    }
  },
  
  cheytac: {
    id: "cheytac",
    name: "CheyTac M200",
    type: "sniper",
    damage: 150,
    fireRate: 0.6,
    maxAmmo: 6,
    reloadTime: 4.0,
    accuracy: 0.99,
    recoil: 0.9,
    bulletSpeed: 60,
    bulletCount: 1,
    range: 180,
    model: "/models/weapons/assault_rifle.glb", // Modelo generado
    stats: {
      damage: 100,
      range: 100,
      accuracy: 100,
      fireRate: 5,
      mobility: 20
    }
  }
};

// Weapon pickup types
export interface WeaponPickup {
  id: string;
  weaponId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  respawnTime: number; // seconds
  active: boolean;
}
