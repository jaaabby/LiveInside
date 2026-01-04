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
    <aside className="w-80 bg-white border border-gray-200 rounded-2xl overflow-y-auto shadow-lg">
      <div className="flex flex-col gap-5 p-5">

        {/* Muebles Personalizados de Carpeta */}
        {customFurniture.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-base"></span> Catálogo de Muebles
            </h3>
            
            {/* Selector de Catálogos */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {furnitureCatalogs.map((catalog) => {
                const furnitureCount = getFurnitureByCatalog(catalog.id).length;
                return (
                  <button
                    key={catalog.id}
                    onClick={() => setSelectedCatalog(catalog.id)}
                    className={`px-3 py-3 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                      selectedCatalog === catalog.id
                        ? 'bg-white text-gray-700 border-2 border-primary-600 shadow-md scale-105'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1.5 h-8">
                      <img 
                        src={catalog.logo} 
                        alt={catalog.name}
                        className={`max-h-full max-w-full object-contain ${catalog.id === 'easy' ? 'scale-125' : ''}`}
                      />
                    </div>
                    <div className="text-xs opacity-80">({furnitureCount} muebles)</div>
                  </button>
                );
              })}
            </div>

            {/* Lista de Muebles del Catálogo Seleccionado */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {getFurnitureByCatalog(selectedCatalog).map((furniture) => (
                <button
                  key={furniture.id}
                  onClick={() => {
                    if (onLoadFromUrl) {
                      onLoadFromUrl(furniture.path, furniture.name);
                    }
                  }}
                  className="w-full bg-primary-50 border border-primary-200 rounded-lg p-3 transition-all hover:bg-primary-100 hover:border-primary-400 hover:shadow-md text-left flex items-center gap-3 cursor-pointer active:scale-95"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    <img 
                      src={furniture.image} 
                      alt={furniture.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{furniture.name}</div>
                    <div className="text-xs text-gray-600">Click para agregar</div>
                  </div>
                  <div className="text-primary-600 font-bold text-2xl flex-shrink-0">+</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controles */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
            Controles
          </h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleToggleWireframe}
              className={`border-2 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                wireframeMode 
                  ? 'bg-primary-600 border-primary-600 text-white hover:bg-primary-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              <span className="text-lg">☐</span> Modo Wireframe
            </button>
            <button 
              onClick={onClearFurniture}
              className="bg-red-500 hover:bg-red-600 border-2 border-red-500 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              🗑️ Limpiar Muebles
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
