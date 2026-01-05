import { useState } from 'react';
import type { RoomSpace } from '@/data/roomSpaces';
import type { CustomFurniture } from '@/data/customFurniture';
import { furnitureCatalogs, getFurnitureByCatalog } from '@/data/customFurniture';
import { mockProducts } from '@/mocks/data';

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
  onLoadFromUrl?: (url: string, name: string, productData?: any) => void;
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
    <aside className="w-full md:w-80 bg-transparent md:bg-white md:border md:border-gray-200 md:rounded-2xl overflow-y-auto md:shadow-lg">
      <div className="flex flex-col gap-5 p-0 md:p-5">

        {/* Muebles Personalizados de Carpeta */}
        {customFurniture.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-base"></span> Catálogo de Muebles
            </h3>
            
            {/* Selector de Catálogos */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {furnitureCatalogs.map((catalog) => {
                const furnitureCount = getFurnitureByCatalog(catalog.id).length;
                return (
                  <button
                    key={catalog.id}
                    onClick={() => setSelectedCatalog(catalog.id)}
                    className={`px-3 py-4 rounded-2xl text-xs font-semibold transition-all shadow-sm ${
                      selectedCatalog === catalog.id
                        ? 'bg-white border-2 border-primary-600 shadow-md scale-[1.02]'
                        : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2 h-8">
                      <img 
                        src={catalog.logo} 
                        alt={catalog.name}
                        className={`max-h-full max-w-full object-contain ${catalog.id === 'easy' ? 'scale-125' : ''}`}
                      />
                    </div>
                    <div className={`text-xs font-medium ${selectedCatalog === catalog.id ? 'text-primary-600' : 'text-gray-600'}`}>
                      {furnitureCount} muebles
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Lista de Muebles del Catálogo Seleccionado */}
            <div className="space-y-3 max-h-[50vh] md:max-h-64 overflow-y-auto pr-1">
              {getFurnitureByCatalog(selectedCatalog).map((furniture) => {
                // Buscar el producto correspondiente en mockProducts
                // Primero intentar por imagen exacta, luego por nombre
                const product = mockProducts.find(p => 
                  p.images?.[0] === furniture.image ||
                  p.name.toLowerCase() === furniture.name.toLowerCase()
                );
                
                // Debug: ver qué se está encontrando
                if (furniture.name === 'Closet') {
                  console.log('Closet furniture:', furniture);
                  console.log('Found product:', product);
                  console.log('Available products:', mockProducts.filter(p => p.name.toLowerCase().includes('closet')));
                }
                
                return (
                  <button
                    key={furniture.id}
                    onClick={() => {
                      if (onLoadFromUrl) {
                        onLoadFromUrl(furniture.path, furniture.name, product);
                      }
                    }}
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 transition-all hover:border-primary-400 hover:shadow-lg text-left flex items-center gap-4 cursor-pointer active:scale-[0.98]"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0 shadow-sm">
                      <img 
                        src={furniture.image} 
                        alt={furniture.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate mb-0.5">{furniture.name}</div>
                      <div className="text-xs text-gray-500">Toca para agregar</div>
                    </div>
                    <div className="text-primary-600 font-bold text-3xl flex-shrink-0 leading-none">+</div>
                  </button>
                );
              })}
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
