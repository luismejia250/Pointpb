import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { usePointBlank } from '@/lib/stores/usePointBlank';
import { useAudio } from '@/lib/stores/useAudio';
import { Volume, Volume2, VolumeX } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { 
    touchControlsVisible, 
    touchControlsLayout, 
    touchSensitivity,
    setTouchControlsVisible,
    setTouchControlsLayout,
    setTouchSensitivity
  } = usePointBlank();
  
  const { isMuted, toggleMute, volume, setVolume } = useAudio();
  
  // Local state to track settings changes
  const [showControls, setShowControls] = useState(touchControlsVisible);
  const [controlLayout, setControlLayout] = useState(touchControlsLayout);
  const [sensitivity, setSensitivity] = useState(touchSensitivity * 100);
  const [soundEnabled, setSoundEnabled] = useState(!isMuted);
  const [volumeLevel, setVolumeLevel] = useState(volume * 100);
  
  // Efecto para reproducir un sonido de prueba cuando se cambia el volumen
  useEffect(() => {
    if (soundEnabled) {
      const testAudio = new Audio('/sounds/hit.mp3');
      testAudio.volume = volumeLevel / 100 * 0.3; // Reproducir a un volumen bajo
      testAudio.play().catch(error => {
        console.log("Test sound prevented:", error);
      });
    }
  }, [volumeLevel, soundEnabled]);
  
  // Save settings and return to menu
  const handleSave = () => {
    setTouchControlsVisible(showControls);
    setTouchControlsLayout(controlLayout);
    setTouchSensitivity(sensitivity / 100);
    
    if (soundEnabled !== !isMuted) {
      toggleMute();
    }
    
    // Guardar volumen
    setVolume(volumeLevel / 100);
    
    // Volver a la pantalla anterior
    navigate(-1);
  };
  
  // Cancel and return without saving
  const handleCancel = () => {
    navigate(-1);
  };
  
  // Icono de volumen dinámico basado en el nivel
  const VolumeIcon = () => {
    if (!soundEnabled) return <VolumeX size={18} />;
    if (volumeLevel < 30) return <Volume size={18} />;
    return <Volume2 size={18} />;
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Configuración</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ajustes del Juego</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Sound Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Sonido</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-toggle">Sonido del Juego</Label>
                <Switch 
                  id="sound-toggle" 
                  checked={soundEnabled} 
                  onCheckedChange={setSoundEnabled} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="volume-slider" className="flex items-center gap-2">
                    <VolumeIcon />
                    Volumen
                  </Label>
                  <span className="text-sm">{volumeLevel}%</span>
                </div>
                <Slider
                  id="volume-slider"
                  min={0}
                  max={100}
                  step={5}
                  disabled={!soundEnabled}
                  value={[volumeLevel]}
                  onValueChange={values => setVolumeLevel(values[0])}
                  className={!soundEnabled ? "opacity-50" : ""}
                />
              </div>
            </div>
            
            {/* Touch Controls Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Controles Táctiles</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="controls-toggle">Mostrar Controles Táctiles</Label>
                <Switch 
                  id="controls-toggle" 
                  checked={showControls} 
                  onCheckedChange={setShowControls} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="layout-selector">Diseño de Controles</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={controlLayout === 'default' ? 'default' : 'outline'} 
                    onClick={() => setControlLayout('default')}
                  >
                    Predeterminado
                  </Button>
                  <Button 
                    variant={controlLayout === 'custom' ? 'default' : 'outline'} 
                    onClick={() => setControlLayout('custom')}
                  >
                    Personalizado
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="sensitivity-slider">Sensibilidad Táctil</Label>
                  <span className="text-sm">{sensitivity}%</span>
                </div>
                <Slider
                  id="sensitivity-slider"
                  min={10}
                  max={100}
                  step={5}
                  value={[sensitivity]}
                  onValueChange={values => setSensitivity(values[0])}
                />
              </div>
            </div>
            
            {/* Performance Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Rendimiento</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="graphics-quality">Calidad de Gráficos</Label>
                <select 
                  id="graphics-quality" 
                  className="rounded-md border border-input bg-background px-3 py-1"
                >
                  <option value="low">Baja</option>
                  <option value="medium" selected>Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar Ajustes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
