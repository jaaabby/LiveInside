import { useState } from 'react';
import type { RoomSpace } from '@/data/roomSpaces';
import type { CustomFurniture } from '@/data/customFurniture';

interface FurnitureSidebarProps {
  furnitureCount: number;
  roomModelLoaded: boolean;
  selectedRoomId: string;
  availableRooms: RoomSpace[];
  customFurniture: CustomFurniture[];
  onFurnitureSelect: (type: string) => void;
  onLoadCustomFurniture: (file: File) => void;
  onClearFurniture: () => void;
  onResetCamera: () => void;
  onToggleWireframe: () => void;
  onLoadFromUrl?: (url: string, name: string) => void;
  onLoadRoom: (roomPath: string, roomId: string) => void;
}

export function FurnitureSidebar({ 
  furnitureCount,
  roomModelLoaded,
  selectedRoomId,
  availableRooms,
  customFurniture,
  onFurnitureSelect,
  onLoadCustomFurniture,
  onClearFurniture,
  onResetCamera,
  onToggleWireframe,
  onLoadFromUrl,
  onLoadRoom
}: FurnitureSidebarProps) {
  const [wireframeMode, setWireframeMode] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
        onLoadCustomFurniture(file);
      } else {
        alert('Por favor selecciona un archivo .glb o .gltf');
      }
    }
    // Reset input
    e.target.value = '';
  };

  const handleToggleWireframe = () => {
    setWireframeMode(!wireframeMode);
    onToggleWireframe();
  };

  return (
    <aside className="w-80 bg-[#151B3D]/60 backdrop-blur-xl border border-[#2D3561] rounded-2xl overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-6">
        {/* Selector de Espacios 3D */}
        <div className="p-6 border-b border-[#2D3561]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            🏠 Selecciona un Espacio
          </h3>
          {!roomModelLoaded ? (
            <div className="space-y-2">
              {availableRooms.length > 0 ? (
                availableRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => onLoadRoom(room.path, room.id)}
                    className="w-full bg-gradient-to-r from-[#00D4AA] to-[#00B894] hover:from-[#00B894] hover:to-[#00A07A] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏠</span>
                      <div className="text-left">
                        <div className="text-sm">{room.name}</div>
                        <div className="text-xs opacity-80">Click para cargar</div>
                      </div>
                    </div>
                    <span className="text-xl">→</span>
                  </button>
                ))
              ) : (
                <div className="bg-[#FF4C6F]/10 border border-[#FF4C6F]/30 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="text-xs text-gray-400">
                    No hay espacios disponibles. Coloca archivos .glb en public/models/rooms/
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full bg-[#00D4AA]/20 border-2 border-[#00D4AA] text-[#00D4AA] font-bold py-4 px-6 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div className="text-left">
                  <div className="text-sm">Espacio cargado</div>
                  <div className="text-xs opacity-80">
                    {availableRooms.find(r => r.id === selectedRoomId)?.name || 'Espacio actual'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Muebles Personalizados de Carpeta */}
        {customFurniture.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              🪑 Catálogo de Muebles
            </h3>
            <div className="space-y-2">
              {customFurniture.map((furniture) => (
                <button
                  key={furniture.id}
                  onClick={() => onLoadFromUrl?.(furniture.path, furniture.name)}
                  className="w-full bg-primary-100 border border-primary-300 rounded-lg p-3 transition-all hover:bg-primary-200 hover:border-primary-500 text-left flex items-center gap-3"
                >
                  <div className="text-2xl">{furniture.icon || '🪑'}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{furniture.name}</div>
                    <div className="text-xs text-gray-500">Modelo 3D</div>
                  </div>
                  <div className="text-primary-600 font-bold text-xl">+</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Estadísticas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary-100 border border-gray-200 p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-primary-600 block">{furnitureCount}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Muebles</span>
            </div>
            <div className="bg-primary-100 border border-gray-200 p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-primary-600 block">✓</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Habitación</span>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Controles
          </h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleToggleWireframe}
              className="bg-gray-100 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              🔲 Modo Wireframe
            </button>
            <button 
              onClick={onClearFurniture}
              className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              🗑️ Limpiar Muebles
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
