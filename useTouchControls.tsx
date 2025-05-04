import { useState, useEffect, useCallback } from 'react';
import { TOUCH_CONTROLS } from '../controls';

interface TouchPosition {
  identifier: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
}

interface TouchControls {
  movement: {
    x: number; // -1 to 1
    y: number; // -1 to 1
  };
  camera: {
    x: number; // -1 to 1
    y: number; // -1 to 1
  };
  actions: {
    shooting: boolean;
    aiming: boolean;
    reloading: boolean;
    jumping: boolean;
    crouching: boolean;
  };
}

export function useTouchControls(sensitivity: number = 1) {
  const [touches, setTouches] = useState<Record<number, TouchPosition>>({});
  
  const [controls, setControls] = useState<TouchControls>({
    movement: { x: 0, y: 0 },
    camera: { x: 0, y: 0 },
    actions: {
      shooting: false,
      aiming: false,
      reloading: false,
      jumping: false,
      crouching: false
    }
  });

  // Define touch areas (left half for movement, right half for camera)
  const isLeftSide = useCallback((x: number) => {
    if (typeof window === 'undefined') return false;
    return x < window.innerWidth / 2;
  }, []);

  const isRightSide = useCallback((x: number) => {
    if (typeof window === 'undefined') return false;
    return x >= window.innerWidth / 2;
  }, []);

  // Check if touch is in a button area
  const isInShootButton = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return false;
    const buttonX = window.innerWidth - TOUCH_CONTROLS.SHOOT_BUTTON_SIZE - 20;
    const buttonY = window.innerHeight - TOUCH_CONTROLS.SHOOT_BUTTON_SIZE - 20;
    return (
      x >= buttonX &&
      x <= buttonX + TOUCH_CONTROLS.SHOOT_BUTTON_SIZE &&
      y >= buttonY &&
      y <= buttonY + TOUCH_CONTROLS.SHOOT_BUTTON_SIZE
    );
  }, []);

  const isInAimButton = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return false;
    const buttonX = window.innerWidth - TOUCH_CONTROLS.BUTTON_SIZE - 20;
    const buttonY = window.innerHeight - TOUCH_CONTROLS.BUTTON_SIZE * 2 - 30;
    return (
      x >= buttonX &&
      x <= buttonX + TOUCH_CONTROLS.BUTTON_SIZE &&
      y >= buttonY &&
      y <= buttonY + TOUCH_CONTROLS.BUTTON_SIZE
    );
  }, []);

  const isInReloadButton = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return false;
    const buttonX = window.innerWidth - TOUCH_CONTROLS.BUTTON_SIZE * 2 - 30;
    const buttonY = window.innerHeight - TOUCH_CONTROLS.BUTTON_SIZE - 20;
    return (
      x >= buttonX &&
      x <= buttonX + TOUCH_CONTROLS.BUTTON_SIZE &&
      y >= buttonY &&
      y <= buttonY + TOUCH_CONTROLS.BUTTON_SIZE
    );
  }, []);

  const isInJumpButton = useCallback((x: number, y: number) => {
    if (typeof window === 'undefined') return false;
    const buttonX = window.innerWidth - TOUCH_CONTROLS.BUTTON_SIZE * 2 - 30;
    const buttonY = window.innerHeight - TOUCH_CONTROLS.BUTTON_SIZE * 2 - 30;
    return (
      x >= buttonX &&
      x <= buttonX + TOUCH_CONTROLS.BUTTON_SIZE &&
      y >= buttonY &&
      y <= buttonY + TOUCH_CONTROLS.BUTTON_SIZE
    );
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const newTouches = { ...touches };
    
    // Process all new touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const { identifier, pageX, pageY } = touch;
      
      newTouches[identifier] = {
        identifier,
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY,
        deltaX: 0,
        deltaY: 0
      };
      
      // Check for action buttons
      if (isInShootButton(pageX, pageY)) {
        setControls(prev => ({
          ...prev,
          actions: { ...prev.actions, shooting: true }
        }));
      } else if (isInAimButton(pageX, pageY)) {
        setControls(prev => ({
          ...prev,
          actions: { ...prev.actions, aiming: true }
        }));
      } else if (isInReloadButton(pageX, pageY)) {
        setControls(prev => ({
          ...prev,
          actions: { ...prev.actions, reloading: true }
        }));
      } else if (isInJumpButton(pageX, pageY)) {
        setControls(prev => ({
          ...prev,
          actions: { ...prev.actions, jumping: true }
        }));
      }
    }
    
    setTouches(newTouches);
  }, [touches, isInShootButton, isInAimButton, isInReloadButton, isInJumpButton]);

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const newTouches = { ...touches };
    let movementX = 0;
    let movementY = 0;
    let cameraX = 0;
    let cameraY = 0;
    
    // Process all moving touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const { identifier, pageX, pageY } = touch;
      
      // Skip if not a touch we're tracking
      if (!newTouches[identifier]) continue;
      
      const startX = newTouches[identifier].startX;
      const startY = newTouches[identifier].startY;
      
      newTouches[identifier] = {
        ...newTouches[identifier],
        currentX: pageX,
        currentY: pageY,
        deltaX: pageX - startX,
        deltaY: pageY - startY
      };
      
      // Update controls based on touch position
      if (isLeftSide(startX)) {
        // Left side = movement
        const deltaX = pageX - startX;
        const deltaY = pageY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > TOUCH_CONTROLS.JOYSTICK_SIZE) {
          // Normalize if outside joystick bounds
          const angle = Math.atan2(deltaY, deltaX);
          movementX = Math.cos(angle);
          movementY = Math.sin(angle);
        } else if (distance > TOUCH_CONTROLS.JOYSTICK_SIZE * TOUCH_CONTROLS.DEADZONE) {
          // Map to -1 to 1 range
          movementX = deltaX / TOUCH_CONTROLS.JOYSTICK_SIZE;
          movementY = deltaY / TOUCH_CONTROLS.JOYSTICK_SIZE;
        }
      } else if (isRightSide(startX) && 
                !isInShootButton(startX, startY) && 
                !isInAimButton(startX, startY) && 
                !isInReloadButton(startX, startY) && 
                !isInJumpButton(startX, startY)) {
        // Right side = camera (look around)
        const deltaX = pageX - newTouches[identifier].currentX;
        const deltaY = pageY - newTouches[identifier].currentY;
        
        // Apply sensitivity
        cameraX = deltaX * sensitivity * 0.01;
        cameraY = deltaY * sensitivity * 0.01;
      }
    }
    
    setTouches(newTouches);
    
    // Update controls state
    setControls(prev => ({
      ...prev,
      movement: { x: movementX, y: movementY },
      camera: { x: cameraX, y: cameraY }
    }));
  }, [
    touches, 
    isLeftSide, 
    isRightSide, 
    isInShootButton, 
    isInAimButton, 
    isInReloadButton, 
    isInJumpButton, 
    sensitivity
  ]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    const newTouches = { ...touches };
    
    // Process all ended touches
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const { identifier, pageX, pageY } = touch;
      
      // Skip if not a touch we're tracking
      if (!newTouches[identifier]) continue;
      
      // Check if this touch was for a button
      const startX = newTouches[identifier].startX;
      const startY = newTouches[identifier].startY;
      
      if (isInShootButton(startX, startY)) {
        setControls(prev => ({
          ...prev,
          actions: { ...prev.actions, shooting: false }
        }));
      } else if (isInAimButton(startX, startY)) {
        setControls(prev => ({
          ...prev,
          actions: { ...prev.actions, aiming: false }
        }));
      } else if (isInReloadButton(startX, startY)) {
        setControls(prev => ({
          ...prev,
          actions: { ...prev.actions, reloading: false }
        }));
      } else if (isInJumpButton(startX, startY)) {
        setControls(prev => ({
          ...prev,
          actions: { ...prev.actions, jumping: false }
        }));
      }
      
      // If left side, reset movement
      if (isLeftSide(startX)) {
        setControls(prev => ({
          ...prev,
          movement: { x: 0, y: 0 }
        }));
      }
      
      // Delete this touch
      delete newTouches[identifier];
    }
    
    setTouches(newTouches);
  }, [
    touches, 
    isInShootButton, 
    isInAimButton, 
    isInReloadButton, 
    isInJumpButton, 
    isLeftSide
  ]);

  // Add event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Add touch event listeners to document
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    
    // Prevent default touch actions to avoid browser gestures
    const preventDefault = (e: TouchEvent) => e.preventDefault();
    document.addEventListener('touchstart', preventDefault, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      document.removeEventListener('touchstart', preventDefault);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return controls;
}
