import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TOUCH_CONTROLS } from '@/lib/controls';
import { usePointBlank } from '@/lib/stores/usePointBlank';

interface TouchControlsProps {
  visible?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ 
  visible = true
}) => {
  const touchControlsVisible = usePointBlank(state => state.touchControlsVisible);
  const touchControlsLayout = usePointBlank(state => state.touchControlsLayout);
  const { shootWeapon, reloadWeapon } = usePointBlank();
  
  // Don't render if controls are set to hidden
  if (!visible || !touchControlsVisible) {
    return null;
  }
  
  // Common button styles
  const buttonStyle = {
    width: TOUCH_CONTROLS.BUTTON_SIZE,
    height: TOUCH_CONTROLS.BUTTON_SIZE,
    borderRadius: '50%',
    backgroundColor: `rgba(255, 255, 255, ${TOUCH_CONTROLS.OPACITY})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none' as const,
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: 'rgba(0, 0, 0, 0.7)',
    border: '2px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    touchAction: 'manipulation' as const
  };
  
  // Shoot button specific style
  const shootButtonStyle = {
    ...buttonStyle,
    width: TOUCH_CONTROLS.SHOOT_BUTTON_SIZE,
    height: TOUCH_CONTROLS.SHOOT_BUTTON_SIZE,
    backgroundColor: `rgba(255, 50, 50, ${TOUCH_CONTROLS.OPACITY})`,
  };
  
  // Left joystick style for movement
  const joystickStyle = {
    width: TOUCH_CONTROLS.JOYSTICK_SIZE,
    height: TOUCH_CONTROLS.JOYSTICK_SIZE,
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    backgroundColor: `rgba(255, 255, 255, ${TOUCH_CONTROLS.OPACITY * 0.7})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none' as const,
    touchAction: 'manipulation' as const
  };
  
  const innerJoystickStyle = {
    width: TOUCH_CONTROLS.JOYSTICK_SIZE * 0.5,
    height: TOUCH_CONTROLS.JOYSTICK_SIZE * 0.5,
    borderRadius: '50%',
    backgroundColor: `rgba(255, 255, 255, ${TOUCH_CONTROLS.OPACITY * 1.3})`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  // Handlers for touch events
  const handleShoot = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Shooting!");
    shootWeapon();
  };
  
  const handleReload = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Reloading!");
    reloadWeapon();
  };
  
  return (
    <div className="fixed inset-0 z-10">
      {/* Left side - Movement joystick */}
      <div className="absolute bottom-16 left-8 pointer-events-auto" style={joystickStyle}>
        <div style={innerJoystickStyle}></div>
      </div>
      
      {/* Right side - Action buttons */}
      <div className="absolute bottom-8 right-8 flex flex-col items-end">
        {/* Shoot button */}
        <div 
          className="pointer-events-auto"
          style={shootButtonStyle}
          onClick={handleShoot}
          onTouchStart={handleShoot}
        >
          <span>DISPARAR</span>
        </div>
        
        {/* Other action buttons */}
        <div className="flex items-center mt-4 mr-2">
          <div 
            className="mr-4 pointer-events-auto"
            style={buttonStyle}
            onClick={handleReload}
            onTouchStart={handleReload}
          >
            <span>R</span>
          </div>
          <div className="pointer-events-auto" style={buttonStyle}>
            <span>↑</span>
          </div>
        </div>
        
        <div className="flex items-center mt-4">
          <div className="mr-4 pointer-events-auto" style={buttonStyle}>
            <span>W1</span>
          </div>
          <div className="pointer-events-auto" style={buttonStyle}>
            <span>W2</span>
          </div>
        </div>
      </div>
      
      {/* Instructions for first-time users - can be hidden in settings */}
      <div className="absolute top-4 w-full text-center">
        <div className="inline-block bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
          <p>Mover: Lado izquierdo de la pantalla</p>
          <p>Mirar: Lado derecho de la pantalla</p>
          <p>Disparar: Botón rojo inferior derecho</p>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;
