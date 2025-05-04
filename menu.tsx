import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { usePointBlank } from '@/lib/stores/usePointBlank';
import { maps } from '@/lib/maps';
import { gameModes } from '@/lib/gameModes';
import { weapons, Weapon } from '@/lib/weapons';
import { getCharactersByFaction, factions } from '@/lib/characters';
import { useNavigate } from 'react-router-dom';

interface MenuProps {
  onStart?: () => void;
  onSettings?: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onStart, onSettings }) => {
  const navigate = useNavigate();
  const pointBlankState = usePointBlank();
  const { startGame } = pointBlankState;
  const [selectedMap, setSelectedMap] = useState('downtown');
  const [selectedMode, setSelectedMode] = useState('deathmatch');
  const [selectedFaction, setSelectedFaction] = useState<'ct_force' | 'free_rebels'>('ct_force');
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState('k5');
  const [showEquipmentPanel, setShowEquipmentPanel] = useState(false);
  
  // Obtener personajes para la facción seleccionada
  const factionsCharacters = useMemo(() => {
    return getCharactersByFaction(selectedFaction);
  }, [selectedFaction]);
  
  // Seleccionar un personaje por defecto si no hay ninguno seleccionado
  useEffect(() => {
    if (!selectedCharacter && factionsCharacters.length > 0) {
      setSelectedCharacter(factionsCharacters[0].id);
    }
  }, [factionsCharacters, selectedCharacter]);
  
  // Ordenar armas por tipo para la selección
  const weaponsByType = useMemo(() => {
    const grouped: Record<string, Weapon[]> = {
      pistol: [],
      rifle: [],
      shotgun: [],
      sniper: []
    };
    
    Object.entries(weapons).forEach(([id, weapon]) => {
      if (grouped[weapon.type]) {
        grouped[weapon.type].push(weapon);
      }
    });
    
    return grouped;
  }, []);
  
  const handleStartGame = () => {
    const gameConfig = {
      map: selectedMap,
      mode: selectedMode,
      faction: selectedFaction,
      character: selectedCharacter || factionsCharacters[0]?.id || 'soldier_ct',
      weapon: selectedWeapon || 'k5'
    };
    
    console.log('Iniciando juego con:', gameConfig);
    startGame(gameConfig);
    
    if (onStart) {
      onStart();
    } else {
      navigate('/game');
    }
  };
  
  const handleSettings = () => {
    if (onSettings) onSettings();
    else navigate('/settings');
  };
  
  const toggleEquipmentPanel = () => {
    setShowEquipmentPanel(!showEquipmentPanel);
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-b from-gray-900 to-black p-0 relative overflow-auto">
      {/* Fondo de estilo Point Blank */}
      <div className="fixed inset-0 w-full h-full opacity-30 pointer-events-none" 
        style={{
          backgroundImage: "url('/images/pb_background.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      {/* Logo de Point Blank */}
      <div className="w-full max-w-xs relative z-10 py-1">
        <div className="w-full flex justify-center mb-1">
          <img src="/images/point_blank_logo.svg" alt="Point Blank" className="w-24 h-auto" />
        </div>
        
        <div className="w-full flex justify-center">
          <div className="text-white text-xs font-bold bg-red-600 px-2 py-0.5 rounded shadow-sm mb-1">
            MOBILE
          </div>
        </div>
        
        <div className="mb-3 bg-black bg-opacity-80 border border-blue-800 rounded-lg overflow-hidden shadow-xl">
          {/* Barra superior estilo PB Zepetto */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-1 px-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.5 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11ZM5.5 19.5l16-16M15.5 19.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11Z"/>
              </svg>
              <h3 className="text-white font-bold text-xs">MODO DE JUEGO</h3>
            </div>
            <div className="bg-blue-600 px-1 py-0.5 rounded text-[10px] text-white font-semibold">
              BETA
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="p-2">
            <Tabs defaultValue="maps" className="w-full">
              <div className="flex justify-center mb-2">
                <TabsList className="grid grid-cols-2 min-w-60 bg-blue-950 rounded-lg border border-blue-600 p-0.5">
                  <TabsTrigger 
                    value="maps" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 rounded-md text-xs font-bold"
                  >
                    MAPAS
                  </TabsTrigger>
                  <TabsTrigger 
                    value="modes" 
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 rounded-md text-xs font-bold"
                  >
                    MODOS
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="maps" className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(maps).map(([id, map]) => (
                    <div 
                      key={id}
                      className={`relative overflow-hidden rounded-lg cursor-pointer transition-all touch-manipulation ${
                        selectedMap === id 
                          ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                          : 'hover:ring-1 hover:ring-blue-400 active:scale-95'
                      }`}
                      onClick={() => setSelectedMap(id)}
                      onTouchStart={() => setSelectedMap(id)}
                      style={{ touchAction: "manipulation", minHeight: '70px' }}
                    >
                      {/* Fondo semitransparente para el mapa */}
                      <div 
                        className="absolute inset-0 opacity-30 bg-cover bg-center"
                        style={{ backgroundImage: map.thumbnail ? `url(${map.thumbnail})` : 'none' }}
                      />
                      
                      {/* Capa de color sobre el fondo */}
                      <div className={`absolute inset-0 opacity-80 ${
                        selectedMap === id ? 'bg-blue-800' : 'bg-gray-900'
                      }`} />
                      
                      {/* Contenido del mapa */}
                      <div className="relative z-10 p-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-xs text-white">{map.name}</h3>
                          <div className={`text-[10px] rounded-full px-1 py-0.5 font-medium ${
                            map.difficulty === 'easy' ? 'bg-green-500 text-white' :
                            map.difficulty === 'medium' ? 'bg-yellow-500 text-gray-900' : 'bg-red-500 text-white'
                          }`}>
                            {map.difficulty === 'easy' ? 'FÁCIL' :
                             map.difficulty === 'medium' ? 'MEDIO' : 'DIFÍCIL'}
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-300 mt-0.5">{map.description.substring(0, 30)}...</p>
                        
                        {/* Icono de selección */}
                        {selectedMap === id && (
                          <svg className="absolute bottom-1 right-1 h-3 w-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="modes" className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(gameModes).map(([id, mode]) => (
                    <div 
                      key={id}
                      className={`relative overflow-hidden rounded-lg cursor-pointer transition-all touch-manipulation ${
                        selectedMode === id 
                          ? 'ring-2 ring-blue-500 shadow-lg scale-105' 
                          : 'hover:ring-1 hover:ring-blue-400 active:scale-95'
                      }`}
                      onClick={() => setSelectedMode(id)}
                      onTouchStart={() => setSelectedMode(id)}
                      style={{ touchAction: "manipulation", minHeight: '70px' }}
                    >
                      {/* Capa de color para el modo */}
                      <div className={`absolute inset-0 ${
                        selectedMode === id ? 'bg-blue-800' : 'bg-gray-900'
                      }`} />
                      
                      {/* Contenido del modo */}
                      <div className="relative z-10 p-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-xs text-white">{mode.name}</h3>
                          <div className={`text-[10px] rounded-full px-1 py-0.5 font-medium ${
                            mode.difficulty === 'easy' ? 'bg-green-500 text-white' :
                            mode.difficulty === 'medium' ? 'bg-yellow-500 text-gray-900' : 'bg-red-500 text-white'
                          }`}>
                            {mode.difficulty === 'easy' ? 'FÁCIL' :
                             mode.difficulty === 'medium' ? 'MEDIO' : 'DIFÍCIL'}
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-300 mt-0.5">{mode.description.substring(0, 30)}...</p>
                        
                        {/* Información adicional del modo */}
                        <div className="flex mt-1 space-x-2">
                          {mode.timeLimit && (
                            <div className="flex items-center text-[9px] text-gray-300">
                              <svg className="h-2 w-2 mr-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              {Math.floor(mode.timeLimit / 60)}min
                            </div>
                          )}
                          {mode.respawnEnabled && (
                            <div className="flex items-center text-[9px] text-gray-300">
                              <svg className="h-2 w-2 mr-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12h18M3 6h18M3 18h18" />
                              </svg>
                              Reaparición
                            </div>
                          )}
                        </div>
                        
                        {/* Icono de selección */}
                        {selectedMode === id && (
                          <svg className="absolute bottom-1 right-1 h-3 w-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Panel de equipamiento (personaje y arma) */}
          <div className="p-2 bg-gray-800 border-t border-blue-800">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-400 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <h3 className="text-white font-bold text-xs">EQUIPAMIENTO</h3>
              </div>
              <div className="flex gap-1">
                <button 
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedFaction === 'ct_force' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setSelectedFaction('ct_force')}
                >
                  CT FORCE
                </button>
                <button 
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedFaction === 'free_rebels' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                  onClick={() => setSelectedFaction('free_rebels')}
                >
                  FREE REBELS
                </button>
              </div>
            </div>
            
            {/* Vista previa del personaje seleccionado */}
            <div className="flex items-center justify-between bg-gray-900 p-2 rounded-lg mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center overflow-hidden mr-2 border border-gray-700">
                  {/* Mostrar avatar del personaje */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs">
                    {factionsCharacters.find(c => c.id === selectedCharacter)?.name || 'Soldado'}
                  </h4>
                  <p className="text-gray-400 text-[10px]">
                    {selectedFaction === 'ct_force' ? 'CT Force' : 'Free Rebels'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={toggleEquipmentPanel}
                variant="outline" 
                className="text-[10px] py-0.5 px-1 h-auto bg-blue-900 border-blue-700 text-blue-300"
              >
                Cambiar
              </Button>
            </div>
            
            {/* Vista previa del arma seleccionada */}
            <div className="flex items-center justify-between bg-gray-900 p-2 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center overflow-hidden mr-2 border border-gray-700">
                  {/* Mostrar icono del arma */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 5l7 7m-7-7h-4m4 0V3m-4 2H7m0 0L3 9m4-4v12m0 0h4m-4 0l-4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs">
                    {weapons[selectedWeapon]?.name || 'K-5'}
                  </h4>
                  <p className="text-gray-400 text-[10px]">
                    {weapons[selectedWeapon]?.type === 'pistol' ? 'Pistola' : 
                     weapons[selectedWeapon]?.type === 'rifle' ? 'Rifle' : 
                     weapons[selectedWeapon]?.type === 'shotgun' ? 'Escopeta' : 'Francotirador'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={toggleEquipmentPanel}
                variant="outline" 
                className="text-[10px] py-0.5 px-1 h-auto bg-blue-900 border-blue-700 text-blue-300"
              >
                Cambiar
              </Button>
            </div>
          </div>
            
          {/* Barra inferior con botones */}
          <div className="p-2 bg-gradient-to-b from-gray-900 to-black border-t border-blue-900">
            <div className="flex flex-col">
              {/* Botón JUGAR grande y destacado - Estilo Point Blank Zepetto */}
              <Button 
                onClick={handleStartGame} 
                className="w-full h-12 text-lg font-bold py-2 touch-manipulation relative overflow-hidden transition-all duration-300 active:scale-95 shadow-xl"
                style={{ 
                  touchAction: "manipulation",
                  background: "linear-gradient(to bottom, #ff4b2b, #cc2000)",
                  border: "1px solid #ff6040",
                  borderBottom: "3px solid #aa1800"
                }}
              >
                {/* Efecto visual */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 pointer-events-none" />
                
                {/* Ícono de mira */}
                <div className="absolute top-1 left-1 w-4 h-4 opacity-60">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
                    <path d="M12 8V16" stroke="white" strokeWidth="1.5" />
                    <path d="M8 12H16" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                
                {/* Texto del botón */}
                <span className="tracking-wider drop-shadow-lg text-white">JUGAR AHORA</span>
                
                {/* Efecto de flechas */}
                <div className="absolute -right-1 top-0 h-full flex items-center">
                  <svg className="h-full w-6 text-white opacity-25" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Button>
              
              {/* Botón de configuración secundario */}
              <div className="flex gap-1 mt-1">
                <Button 
                  onClick={handleSettings} 
                  variant="outline" 
                  className="flex-1 text-xs py-1 touch-manipulation bg-gray-800 border-blue-900 hover:bg-gray-700 text-gray-200"
                  style={{ touchAction: "manipulation" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  OPCIONES
                </Button>
                {/* Botón de tienda - Característica de Point Blank */}
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs py-1 touch-manipulation bg-yellow-900 border-yellow-700 hover:bg-yellow-800 text-yellow-200"
                  style={{ touchAction: "manipulation" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                  </svg>
                  TIENDA
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-900 bg-opacity-50 border border-blue-700 rounded-md p-1.5 mb-1 text-center">
          <p className="text-blue-200 text-[10px] font-medium mb-0.5">Instrucciones</p>
          <p className="text-gray-300 text-[9px] mb-0.5">• Toca el botón rojo "JUGAR AHORA" para comenzar</p>
          <p className="text-gray-300 text-[9px]">• Selecciona Mapa/Modo/Personaje antes de jugar</p>
        </div>
        
        <p className="text-center text-gray-400 text-[9px]">
          Point Blank Mobile v1.0.0 - Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default Menu;
