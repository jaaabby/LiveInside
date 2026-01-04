import { useState } from 'react';
import type { RoomSpace } from '@/data/roomSpaces';
import type { CustomFurniture } from '@/data/customFurniture';
import { furnitureCatalogs, getFurnitureByCatalog } from '@/data/customFurniture';

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
  const [selectedCatalog, setSelectedCatalog] = useState<string>('ikea');

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
      <div className="flex flex-col gap-6 p-6">
        {/* Espacio Cargado - Solo informativo */}
        {roomModelLoaded && (
          <div className="w-full bg-[#00D4AA]/20 border-2 border-[#00D4AA] text-[#00D4AA] font-bold py-4 px-6 rounded-xl flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div className="text-left">
              <div className="text-sm">Espacio cargado</div>
              <div className="text-xs opacity-80">
                {availableRooms.find(r => r.id === selectedRoomId)?.name || 'Espacio actual'}
              </div>
            </div>
          </div>
        )}

        {/* Muebles Personalizados de Carpeta */}
        {customFurniture.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              🪑 Catálogo de Muebles
            </h3>
            
            {/* Selector de Catálogos */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {furnitureCatalogs.map((catalog) => {
                const furnitureCount = getFurnitureByCatalog(catalog.id).length;
                return (
                  <button
                    key={catalog.id}
                    onClick={() => setSelectedCatalog(catalog.id)}
                    className={`flex-1 min-w-[120px] px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCatalog === catalog.id
                        ? 'bg-primary-600 text-white border-2 border-primary-600 shadow-lg'
                        : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2 h-8">
                      <img 
                        src={catalog.logo} 
                        alt={catalog.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="text-xs opacity-75">({furnitureCount} muebles)</div>
                  </button>
                );
              })}
            </div>

            {/* Lista de Muebles del Catálogo Seleccionado */}
            <div className="space-y-2">
              {getFurnitureByCatalog(selectedCatalog).map((furniture) => (
                <div
                  key={furniture.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('furnitureUrl', furniture.path);
                    e.dataTransfer.setData('furnitureName', furniture.name);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="w-full bg-primary-100 border border-primary-300 rounded-lg p-3 transition-all hover:bg-primary-200 hover:border-primary-500 text-left flex items-center gap-3 cursor-grab active:cursor-grabbing"
                >
                  <div className="text-2xl">{furniture.icon || '🪑'}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{furniture.name}</div>
                    <div className="text-xs text-gray-500">Arrastra a la escena</div>
                  </div>
                  <div className="text-primary-600 font-bold text-xl">⋮⋮</div>
                </div>
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
