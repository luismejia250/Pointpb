import { create } from "zustand";

interface SoundEffects {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  shootSound: HTMLAudioElement | null;
  reloadSound: HTMLAudioElement | null;
  enemyHitSound: HTMLAudioElement | null;
  playerHitSound: HTMLAudioElement | null;
  gameOverSound: HTMLAudioElement | null;
}

interface AudioState extends SoundEffects {
  isMuted: boolean;
  volume: number;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setShootSound: (sound: HTMLAudioElement) => void;
  setReloadSound: (sound: HTMLAudioElement) => void;
  setEnemyHitSound: (sound: HTMLAudioElement) => void;
  setPlayerHitSound: (sound: HTMLAudioElement) => void;
  setGameOverSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  
  // Play functions
  playHit: () => void;
  playSuccess: () => void;
  playShoot: () => void;
  playReload: () => void;
  playEnemyHit: () => void;
  playPlayerHit: () => void;
  playGameOver: () => void;
}

// Helper function outside of the store
const playSound = (sound: HTMLAudioElement | null, volume: number, globalVolume: number, isMuted: boolean) => {
  if (!sound || isMuted) return;
  
  // Clone the sound to allow overlapping
  const soundClone = sound.cloneNode() as HTMLAudioElement;
  soundClone.volume = globalVolume * volume;
  soundClone.play().catch(error => {
    console.log("Sound play prevented:", error);
  });
};

export const useAudio = create<AudioState>((set, get) => ({
  // Sound effects
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  shootSound: null,
  reloadSound: null,
  enemyHitSound: null,
  playerHitSound: null,
  gameOverSound: null,
  
  // Settings
  isMuted: true, // Start muted by default
  volume: 0.3,
  
  // Setter functions
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setShootSound: (sound) => set({ shootSound: sound }),
  setReloadSound: (sound) => set({ reloadSound: sound }),
  setEnemyHitSound: (sound) => set({ enemyHitSound: sound }),
  setPlayerHitSound: (sound) => set({ playerHitSound: sound }),
  setGameOverSound: (sound) => set({ gameOverSound: sound }),
  
  // Control functions
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    
    // If we're unmuting and background music exists, play it
    if (!newMutedState && backgroundMusic) {
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    }
    
    // If we're muting, pause the background music
    if (newMutedState && backgroundMusic && !backgroundMusic.paused) {
      backgroundMusic.pause();
    }
    
    console.log(`Sonido ${newMutedState ? 'silenciado' : 'activado'}`);
  },
  
  setVolume: (volume) => {
    set({ volume });
    const { 
      backgroundMusic, 
      hitSound, 
      successSound,
      shootSound,
      reloadSound,
      enemyHitSound,
      playerHitSound,
      gameOverSound
    } = get();
    
    // Update volume for all sounds
    if (backgroundMusic) backgroundMusic.volume = volume * 0.5; // Background music slightly quieter
    if (hitSound) hitSound.volume = volume;
    if (successSound) successSound.volume = volume;
    if (shootSound) shootSound.volume = volume;
    if (reloadSound) reloadSound.volume = volume;
    if (enemyHitSound) enemyHitSound.volume = volume;
    if (playerHitSound) playerHitSound.volume = volume;
    if (gameOverSound) gameOverSound.volume = volume;
    
    console.log(`Volumen ajustado a: ${Math.round(volume * 100)}%`);
  },
  
  // Play functions
  playHit: () => {
    const { hitSound, isMuted, volume } = get();
    if (isMuted) {
      console.log("Hit sound skipped (muted)");
      return;
    }
    playSound(hitSound, 1.0, volume, isMuted);
  },
  
  playSuccess: () => {
    const { successSound, isMuted, volume } = get();
    if (isMuted) {
      console.log("Success sound skipped (muted)");
      return;
    }
    if (successSound) {
      successSound.currentTime = 0;
      playSound(successSound, 1.0, volume, isMuted);
    }
  },
  
  playShoot: () => {
    const { shootSound, isMuted, volume } = get();
    if (isMuted) return;
    playSound(shootSound, 0.4, volume, isMuted); // Lower volume for gunshots
  },
  
  playReload: () => {
    const { reloadSound, isMuted, volume } = get();
    if (isMuted) return;
    playSound(reloadSound, 1.0, volume, isMuted);
  },
  
  playEnemyHit: () => {
    const { enemyHitSound, isMuted, volume } = get();
    if (isMuted) return;
    playSound(enemyHitSound, 1.0, volume, isMuted);
  },
  
  playPlayerHit: () => {
    const { playerHitSound, isMuted, volume } = get();
    if (isMuted) return;
    playSound(playerHitSound, 1.0, volume, isMuted);
  },
  
  playGameOver: () => {
    const { gameOverSound, isMuted, volume } = get();
    if (isMuted) return;
    if (gameOverSound) {
      gameOverSound.currentTime = 0;
      playSound(gameOverSound, 1.0, volume, isMuted);
    }
  }
}));
