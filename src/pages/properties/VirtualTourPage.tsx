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
    <div className="fixed inset-0 bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="relative z-10 bg-primary-600 shadow-md">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Back button and Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(`/properties/${id}`)}
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Volver</span>
            </button>
            
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/logo_blanco_horizontal.png"
                alt="LiveInside"
                className="h-8"
              />
            </div>
          </div>

          {/* Center: Title */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-2xl font-bold text-white">Visor 3D</h1>
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
        <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden relative shadow-sm">
          <ThreeScene
            ref={threeSceneRef}
            selectedFurniture={selectedFurniture}
            onFurnitureCountChange={setFurnitureCount}
          />
          
          {/* Overlay badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-primary-600">🎨 Vista 3D Activa</span>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-200 shadow-lg max-w-3xl">
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              <span className="text-primary-600 font-semibold">🖱️ Click + arrastrar:</span> Rotar cámara | 
              <span className="text-primary-600 font-semibold"> 🔍 Rueda:</span> Zoom | 
              <span className="text-primary-600 font-semibold"> 📦 Click mueble:</span> Seleccionar
              <br />
              <span className="text-primary-700 font-semibold">⌨️ W/A/S/D o Flechas:</span> Mover | 
              <span className="text-primary-700 font-semibold"> Q/E:</span> Rotar | 
              <span className="text-primary-700 font-semibold"> +/-:</span> Escalar | 
              <span className="text-red-600 font-semibold"> Delete:</span> Eliminar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
