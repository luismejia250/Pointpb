import { Controls } from "@react-three/drei";

// Define the control mapping for keyboard
export const controlsMap = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "jump", keys: ["Space"] },
  { name: "sprint", keys: ["ShiftLeft"] },
  { name: "crouch", keys: ["ControlLeft", "KeyC"] },
  { name: "shoot", keys: ["Mouse0"] },
  { name: "aim", keys: ["Mouse1"] },
  { name: "reload", keys: ["KeyR"] },
  { name: "weapon1", keys: ["Digit1"] },
  { name: "weapon2", keys: ["Digit2"] },
  { name: "weapon3", keys: ["Digit3"] },
  { name: "weapon4", keys: ["Digit4"] },
  { name: "pause", keys: ["Escape", "KeyP"] }
];

// Names of controls for type safety throughout the app
export enum ControlName {
  FORWARD = "forward",
  BACKWARD = "backward",
  LEFTWARD = "leftward",
  RIGHTWARD = "rightward",
  JUMP = "jump",
  SPRINT = "sprint",
  CROUCH = "crouch",
  SHOOT = "shoot",
  AIM = "aim",
  RELOAD = "reload",
  WEAPON1 = "weapon1",
  WEAPON2 = "weapon2",
  WEAPON3 = "weapon3",
  WEAPON4 = "weapon4",
  PAUSE = "pause"
}

// Movement constants
export const MOVEMENT = {
  WALK_SPEED: 5,
  RUN_SPEED: 8,
  JUMP_FORCE: 5,
  GRAVITY: -9.8,
  CROUCH_SPEED: 2.5
};

// Touch control settings
export const TOUCH_CONTROLS = {
  JOYSTICK_SIZE: 120,
  BUTTON_SIZE: 64,
  DEADZONE: 0.1,
  OPACITY: 0.6,
  SHOOT_BUTTON_SIZE: 80
};
