import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ThreeScene, ThreeSceneHandle } from '@/components/three/ThreeScene';
import { FurnitureSidebar } from '@/components/three/FurnitureSidebar';
import { availableRooms } from '@/data/roomSpaces';
import { availableFurniture } from '@/data/customFurniture';
import { api } from '@/services/api';

export function VirtualTourPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [furnitureCount, setFurnitureCount] = useState(0);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [roomModelLoaded, setRoomModelLoaded] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const threeSceneRef = useRef<ThreeSceneHandle>(null);

  useEffect(() => {
    // Verificar si viene un roomId directo por URL
    const roomIdParam = searchParams.get('roomId');
    
    if (roomIdParam) {
      // Cargar espacio directamente desde parámetro
      const room = availableRooms.find(r => r.id === roomIdParam);
      if (room) {
        threeSceneRef.current?.loadRoomModel(room.path);
        setRoomModelLoaded(true);
        setSelectedRoomId(room.id);
      }
      return;
    }

    // Si no hay roomId, intentar cargar desde la propiedad
    const loadPropertyRoom = async () => {
      if (!id) return;
      
      try {
        const property = await api.properties.getById(id);
        if (property && property.roomModelPath && property.roomModelId) {
          threeSceneRef.current?.loadRoomModel(property.roomModelPath);
          setRoomModelLoaded(true);
          setSelectedRoomId(property.roomModelId);
        }
      } catch (error) {
        console.error('Error loading property room:', error);
      }
    };

    loadPropertyRoom();
  }, [id, searchParams]);

  const handleLoadRoom = (roomPath: string, roomId: string) => {
    threeSceneRef.current?.loadRoomModel(roomPath);
    setRoomModelLoaded(true);
    setSelectedRoomId(roomId);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Back button and Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(id ? `/properties/${id}` : '/properties')}
              className="flex items-center gap-2 text-white hover:text-primary-100 transition-all hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Volver</span>
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
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span></span> Visor 3D
            </h1>
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
        <div className="flex-1 bg-white border-2 border-gray-200 rounded-2xl overflow-hidden relative shadow-xl">
          <ThreeScene
            ref={threeSceneRef}
            selectedFurniture={selectedFurniture}
            onFurnitureCountChange={setFurnitureCount}
          />

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-4 rounded-2xl border-2 border-gray-200 shadow-2xl max-w-4xl">
            <p className="text-xs text-gray-700 text-center leading-relaxed font-medium">
              <span className="text-primary-600 font-bold">🖱️ Click + Arrastrar:</span> Rotar cámara |{' '}
              <span className="text-primary-600 font-bold">🔍 Rueda:</span> Zoom |{' '}
              <span className="text-primary-600 font-bold">📦 Click Mueble:</span> Agregar
              <br />
              <span className="text-primary-700 font-bold">⌨️ W/A/S/D:</span> Mover mueble |{' '}
              <span className="text-primary-700 font-bold">Q/E:</span> Rotar |{' '}
              <span className="text-primary-700 font-bold">+/-:</span> Escalar |{' '}
              <span className="text-red-600 font-bold">Delete:</span> Eliminar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
