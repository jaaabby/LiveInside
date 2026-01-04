import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ThreeScene, ThreeSceneHandle } from '@/components/three/ThreeScene';
import { FurnitureSidebar } from '@/components/three/FurnitureSidebar';
import { availableRooms } from '@/data/roomSpaces';
import { availableFurniture } from '@/data/customFurniture';

export function VirtualTourPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [furnitureCount, setFurnitureCount] = useState(0);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [roomModelLoaded, setRoomModelLoaded] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const threeSceneRef = useRef<ThreeSceneHandle>(null);

  const handleLoadRoom = (roomPath: string, roomId: string) => {
    threeSceneRef.current?.loadRoomModel(roomPath);
    setRoomModelLoaded(true);
    setSelectedRoomId(roomId);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0A0E27] via-[#0A0E27] to-[#1a1f3f] overflow-hidden">
      {/* Gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-[#4C6FFF]/15 via-transparent to-transparent opacity-50 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-[#00D4AA]/10 via-transparent to-transparent opacity-50" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-[#151B3D]/60 backdrop-blur-xl border-b border-[#2D3561]">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Back button and Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(`/properties/${id}`)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4C6FFF] to-[#00D4AA] rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-[#4C6FFF] to-[#00D4AA] bg-clip-text text-transparent">
                  LiveInside
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                  Staging Virtual con Habitación Real
                </div>
              </div>
            </div>
          </div>

          {/* Center: Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-bold text-white">Tour Virtual</h1>
          </div>

          {/* Right: Badge */}
          <div className="flex items-center gap-3 bg-[#00D4AA]/20 border border-[#00D4AA] px-4 py-2 rounded-full">
            <span className="text-[#00D4AA]">✨</span>
            <span className="text-sm font-semibold text-[#00D4AA]">
              Habitación capturada con Polycam
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-73px)] gap-6 p-6">
        {/* Sidebar */}
        <FurnitureSidebar
          furnitureCount={furnitureCount}
          roomModelLoaded={roomModelLoaded}
          selectedRoomId={selectedRoomId}
          availableRooms={availableRooms}
          customFurniture={availableFurniture}
          onFurnitureSelect={setSelectedFurniture}
          onLoadCustomFurniture={(file) => threeSceneRef.current?.loadCustomFurniture(file)}
          onClearFurniture={() => threeSceneRef.current?.clearAllFurniture()}
          onResetCamera={() => threeSceneRef.current?.resetCamera()}
          onToggleWireframe={() => threeSceneRef.current?.toggleWireframe()}
          onLoadFromUrl={(url, name) => threeSceneRef.current?.loadFurnitureFromUrl(url, name)}
          onLoadRoom={handleLoadRoom}
        />

        {/* 3D Viewer */}
        <div className="flex-1 bg-[#151B3D]/40 backdrop-blur-xl border border-[#2D3561] rounded-2xl overflow-hidden relative">
          <ThreeScene
            ref={threeSceneRef}
            selectedFurniture={selectedFurniture}
            onFurnitureCountChange={setFurnitureCount}
          />
          
          {/* Overlay badge */}
          <div className="absolute top-4 left-4 bg-[#0A0E27]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-[#2D3561]">
            <span className="text-sm font-mono text-[#00D4AA]">� Vista 3D Activa</span>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0A0E27]/90 backdrop-blur-md px-6 py-3 rounded-xl border border-[#2D3561]">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              <span className="text-[#00D4AA] font-semibold">🖱️ Click + arrastrar:</span> Rotar cámara | 
              <span className="text-[#00D4AA] font-semibold">🔍 Rueda:</span> Zoom | 
              <span className="text-[#00D4AA] font-semibold">📦 Click mueble:</span> Seleccionar
              <br />
              <span className="text-[#4C6FFF] font-semibold">⌨️ W/A/S/D o Flechas:</span> Mover | 
              <span className="text-[#4C6FFF] font-semibold">Q/E:</span> Rotar | 
              <span className="text-[#4C6FFF] font-semibold">+/-:</span> Escalar | 
              <span className="text-[#FF4C6F] font-semibold">Delete:</span> Eliminar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
