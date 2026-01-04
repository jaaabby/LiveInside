import { useState } from 'react';
import { predefinedModels } from '@/data/predefinedModels';
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

const furnitureItems = [
  { type: 'sofa', icon: '🛋️', name: 'Sofá' },
  { type: 'table', icon: '🪑', name: 'Mesa' },
  { type: 'chair', icon: '💺', name: 'Silla' },
  { type: 'bed', icon: '🛏️', name: 'Cama' },
  { type: 'lamp', icon: '💡', name: 'Lámpara' },
  { type: 'plant', icon: '🪴', name: 'Planta' },
  { type: 'bookshelf', icon: '📚', name: 'Estantería' },
  { type: 'tv', icon: '📺', name: 'TV' },
  { type: 'desk', icon: '🖥️', name: 'Escritorio' },
  { type: 'dresser', icon: '🗄️', name: 'Cómoda' },
  { type: 'nightstand', icon: '📦', name: 'Mesa Noche' },
  { type: 'armchair', icon: '🛋️', name: 'Sillón' },
  { type: 'coffeetable', icon: '☕', name: 'Mesa Centro' },
  { type: 'rug', icon: '🧶', name: 'Alfombra' },
  { type: 'mirror', icon: '🪞', name: 'Espejo' },
  { type: 'cabinet', icon: '🗄', name: 'Gabinete' },
  { type: 'bench', icon: '🪑', name: 'Banco' },
  { type: 'stool', icon: '🪑', name: 'Taburete' },
];

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
  const [showPredefinedModels, setShowPredefinedModels] = useState(false);

  const availableModels = predefinedModels.filter(model => model.available);

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('furnitureType', type);
    onFurnitureSelect(type);
  };

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

        <div className="px-6">
        {/* Selector de Catálogo */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowPredefinedModels(false)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              !showPredefinedModels
                ? 'bg-[#4C6FFF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Básicos ({furnitureItems.length})
          </button>
          <button
            onClick={() => setShowPredefinedModels(true)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              showPredefinedModels
                ? 'bg-[#4C6FFF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Modelos 3D ({availableModels.length})
          </button>
        </div>

        {/* Catálogo de Muebles */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            {showPredefinedModels ? 'Modelos 3D Realistas' : 'Catálogo de Muebles'}
          </h3>
          
          {!showPredefinedModels ? (
            <div className="grid grid-cols-2 gap-3">
              {furnitureItems.map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  className="bg-[#4C6FFF]/10 border-2 border-[#2D3561] rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all hover:bg-[#4C6FFF]/20 hover:border-[#4C6FFF] hover:-translate-y-1 text-center"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium text-white">{item.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {availableModels.length > 0 ? (
                availableModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => onLoadFromUrl?.(model.path, model.name)}
                    className="w-full bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-lg p-3 transition-all hover:bg-[#00D4AA]/20 hover:border-[#00D4AA] text-left flex items-center gap-3"
                  >
                    <div className="text-2xl">{model.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{model.name}</div>
                      <div className="text-xs text-gray-500">Modelo 3D realista</div>
                    </div>
                    <div className="text-[#00D4AA]">+</div>
                  </button>
                ))
              ) : (
                <div className="bg-[#FF4C6F]/10 border border-[#FF4C6F]/30 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="text-sm text-gray-400 mb-2">
                    No hay modelos 3D disponibles
                  </div>
                  <div className="text-xs text-gray-500">
                    Coloca archivos .glb en la carpeta public/models/
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Estadísticas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#4C6FFF]/10 border border-[#2D3561] p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-[#4C6FFF] block">{furnitureCount}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Muebles</span>
            </div>
            <div className="bg-[#4C6FFF]/10 border border-[#2D3561] p-3 rounded-lg text-center">
              <span className="text-2xl font-bold text-[#4C6FFF] block">Real</span>
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
              onClick={onResetCamera}
              className="bg-gradient-to-r from-[#4C6FFF] to-[#3D5ACC] text-white py-3 px-4 rounded-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#4C6FFF]/40 flex items-center justify-center gap-2"
            >
              🎯 Restablecer Vista
            </button>
            <button
              onClick={handleToggleWireframe}
              className="bg-white/10 border border-[#2D3561] text-white py-3 px-4 rounded-lg font-semibold transition-all hover:bg-white/15 flex items-center justify-center gap-2"
            >
              🔲 Modo Wireframe
            </button>
            <button 
              onClick={onClearFurniture}
              className="bg-gradient-to-r from-[#FF4C6F] to-[#CC3D5A] text-white py-3 px-4 rounded-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF4C6F]/40 flex items-center justify-center gap-2"
            >
              🗑️ Limpiar Muebles
            </button>
          </div>
        </div>

        {/* Calidad Visual */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Calidad Visual
          </h3>
          <div className="bg-white/5 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">🔆 Iluminación Pro</span>
              <span className="text-[#00D4AA] font-semibold">Activa</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">✨ Suavizado Mesh</span>
              <span className="text-[#00D4AA] font-semibold">Activa</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">💡 Sombras</span>
              <span className="text-gray-500">Desactivadas</span>
            </div>
          </div>
        </div>

        {/* Muebles Personalizados de Carpeta */}
        {customFurniture.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              📁 Muebles Personalizados
            </h3>
            <div className="space-y-2">
              {customFurniture.map((furniture) => (
                <button
                  key={furniture.id}
                  onClick={() => onLoadFromUrl?.(furniture.path, furniture.name)}
                  className="w-full bg-[#FF4C6F]/10 border border-[#FF4C6F]/30 rounded-lg p-3 transition-all hover:bg-[#FF4C6F]/20 hover:border-[#FF4C6F] text-left flex items-center gap-3"
                >
                  <div className="text-2xl">{furniture.icon || '🪑'}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{furniture.name}</div>
                    <div className="text-xs text-gray-500">Mueble personalizado</div>
                  </div>
                  <div className="text-[#FF4C6F]">+</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Muebles Personalizados */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Muebles Personalizados
          </h3>
          <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 p-4 rounded-lg">
            <input
              type="file"
              id="glbUpload"
              accept=".glb,.gltf"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => document.getElementById('glbUpload')?.click()}
              className="w-full bg-gradient-to-r from-[#4C6FFF] to-[#3D5ACC] text-white py-3 px-4 rounded-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg mb-2"
            >
              📂 Cargar Mueble GLB
            </button>
            <div className="text-xs text-gray-500 text-center">
              Arrastra muebles escaneados con texturas reales
            </div>
          </div>
        </div>
        </div>

        {/* Tips */}
        <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 p-4 rounded-lg text-sm text-gray-300 leading-relaxed mx-6">
          <span className="text-[#00D4AA] font-semibold">💡 Tip:</span> Arrastra los muebles desde el catálogo hacia la habitación. Usa el mouse para rotar la cámara y la rueda para hacer zoom.
        </div>

        {/* Controles del teclado */}
        <div className="bg-[#4C6FFF]/10 border border-[#4C6FFF]/30 p-4 rounded-lg mx-6 mb-6">
          <div className="text-sm font-semibold text-[#4C6FFF] mb-2">🎮 Controles:</div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>• Click: Seleccionar mueble</div>
            <div>• Arrastrar: Mover mueble</div>
            <div>• Q/E: Rotar mueble</div>
            <div>• +/-: Cambiar tamaño</div>
            <div>• Delete: Eliminar mueble</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
