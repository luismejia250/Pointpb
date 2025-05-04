export interface EnemyType {
  id: string;
  name: string;
  health: number;
  damage: number;
  speed: number;
  attackRange: number;
  attackRate: number; // attacks per second
  detectionRange: number;
  accuracy: number; // 0-1 scale
  color: string;
  model?: string;
  scale: [number, number, number];
  behavior: 'stationary' | 'patrol' | 'aggressive' | 'defensive';
  points: number; // score for killing
}

export const enemies: Record<string, EnemyType> = {
  basic: {
    id: 'basic',
    name: 'Recruit',
    health: 100,
    damage: 10,
    speed: 3,
    attackRange: 15,
    attackRate: 1,
    detectionRange: 20,
    accuracy: 0.6,
    color: '#ff0000',
    scale: [1, 2, 1],
    behavior: 'patrol',
    points: 100
  },
  
  medium: {
    id: 'medium',
    name: 'Soldier',
    health: 150,
    damage: 15,
    speed: 4,
    attackRange: 18,
    attackRate: 1.5,
    detectionRange: 25,
    accuracy: 0.7,
    color: '#ff5500',
    scale: [1, 2, 1],
    behavior: 'aggressive',
    points: 200
  },
  
  heavy: {
    id: 'heavy',
    name: 'Heavy Gunner',
    health: 250,
    damage: 20,
    speed: 2,
    attackRange: 20,
    attackRate: 2,
    detectionRange: 22,
    accuracy: 0.65,
    color: '#aa0000',
    scale: [1.3, 2.2, 1.3],
    behavior: 'aggressive',
    points: 300
  },
  
  sniper: {
    id: 'sniper',
    name: 'Sniper',
    health: 80,
    damage: 40,
    speed: 3,
    attackRange: 40,
    attackRate: 0.5,
    detectionRange: 50,
    accuracy: 0.9,
    color: '#aa5500',
    scale: [1, 2, 1],
    behavior: 'stationary',
    points: 250
  },
  
  boss: {
    id: 'boss',
    name: 'Commander',
    health: 500,
    damage: 25,
    speed: 2.5,
    attackRange: 25,
    attackRate: 1.8,
    detectionRange: 30,
    accuracy: 0.8,
    color: '#990000',
    scale: [1.5, 2.5, 1.5],
    behavior: 'aggressive',
    points: 1000
  }
};

// AI behavior functions
export const updateEnemyBehavior = (
  enemyType: string,
  enemyPosition: [number, number, number],
  playerPosition: [number, number, number],
  deltaTime: number
): [number, number, number] => {
  const enemy = enemies[enemyType];
  if (!enemy) return enemyPosition;
  
  // Calculate distance to player
  const dx = playerPosition[0] - enemyPosition[0];
  const dz = playerPosition[2] - enemyPosition[2];
  const distanceToPlayer = Math.sqrt(dx * dx + dz * dz);
  
  // Check if player is in detection range
  if (distanceToPlayer <= enemy.detectionRange) {
    // Player detected, move towards player based on behavior
    if (enemy.behavior === 'aggressive' || 
        (enemy.behavior === 'defensive' && distanceToPlayer <= enemy.attackRange) ||
        (enemy.behavior === 'patrol' && distanceToPlayer <= enemy.attackRange * 1.5)) {
      
      // If we're too close to the player, keep some distance (for ranged enemies)
      if (enemy.id === 'sniper' && distanceToPlayer < enemy.attackRange * 0.5) {
        return [
          enemyPosition[0] - (dx / distanceToPlayer) * enemy.speed * deltaTime,
          enemyPosition[1],
          enemyPosition[2] - (dz / distanceToPlayer) * enemy.speed * deltaTime
        ];
      }
      
      // If we're outside attack range, move closer
      if (distanceToPlayer > enemy.attackRange) {
        return [
          enemyPosition[0] + (dx / distanceToPlayer) * enemy.speed * deltaTime,
          enemyPosition[1],
          enemyPosition[2] + (dz / distanceToPlayer) * enemy.speed * deltaTime
        ];
      }
    }
  } else if (enemy.behavior === 'patrol') {
    // Simple patrol behavior - random movement
    const patrolX = enemyPosition[0] + (Math.random() - 0.5) * enemy.speed * deltaTime;
    const patrolZ = enemyPosition[2] + (Math.random() - 0.5) * enemy.speed * deltaTime;
    return [patrolX, enemyPosition[1], patrolZ];
  }
  
  return enemyPosition;
};

// Determines if the enemy should attack
export const shouldEnemyAttack = (
  enemyType: string,
  enemyPosition: [number, number, number],
  playerPosition: [number, number, number]
): boolean => {
  const enemy = enemies[enemyType];
  if (!enemy) return false;
  
  // Calculate distance to player
  const dx = playerPosition[0] - enemyPosition[0];
  const dz = playerPosition[2] - enemyPosition[2];
  const distanceToPlayer = Math.sqrt(dx * dx + dz * dz);
  
  // Check if player is in attack range
  return distanceToPlayer <= enemy.attackRange;
};
