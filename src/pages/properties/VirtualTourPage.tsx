import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ThreeScene, ThreeSceneHandle } from '@/components/three/ThreeScene';
import { FurnitureSidebar } from '@/components/three/FurnitureSidebar';
import { availableRooms } from '@/data/roomSpaces';
import { availableFurniture } from '@/data/customFurniture';
import { mockProducts } from '@/mocks/data';
import { api } from '@/services/api';

export function VirtualTourPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [furnitureCount, setFurnitureCount] = useState(0);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [roomModelLoaded, setRoomModelLoaded] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleMobileFurnitureLoad = (url: string, name: string) => {
    // Buscar el producto correspondiente en mockProducts
    const furnitureItem = availableFurniture.find(f => f.path === url);
    const product = furnitureItem ? mockProducts.find(p => 
      p.images?.[0] === furnitureItem.image ||
      p.name.toLowerCase() === furnitureItem.name.toLowerCase()
    ) : undefined;
    
    console.log('handleMobileFurnitureLoad:', { url, name, furnitureItem, product });
    
    threeSceneRef.current?.loadFurnitureFromUrl(url, name, product);
    setIsMobileMenuOpen(false); // Cerrar el menú al agregar un mueble
  };

  const handleLoadFurnitureWithProduct = (url: string, name: string) => {
    // Buscar el producto correspondiente en mockProducts
    const furnitureItem = availableFurniture.find(f => f.path === url);
    const product = furnitureItem ? mockProducts.find(p => 
      p.images?.[0] === furnitureItem.image ||
      p.name.toLowerCase() === furnitureItem.name.toLowerCase()
    ) : undefined;
    
    console.log('handleLoadFurnitureWithProduct:', { url, name, furnitureItem, product });
    
    threeSceneRef.current?.loadFurnitureFromUrl(url, name, product);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-4 flex items-center">
          {/* Left: Back button */}
          <button
            onClick={() => navigate(id ? `/properties/${id}` : '/properties')}
            className="flex items-center gap-2 text-white hover:text-primary-100 transition-all hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-semibold">Volver</span>
          </button>

          {/* Center: Logo and Title */}
          <div className="flex-1 flex items-center justify-center gap-3">
            <img
              src="/src/assets/images/logo_blanco_horizontal.png"
              alt="LiveInside"
              className="h-7"
            />
            <h1 className="text-xl font-bold text-white">Visor 3D</h1>
          </div>

          {/* Right: Spacer for symmetry */}
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-73px)] gap-6 md:p-6">
        {/* Sidebar - Solo visible en desktop */}
        <div className="hidden md:block">
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
            onLoadFromUrl={handleLoadFurnitureWithProduct}
            onLoadRoom={handleLoadRoom}
          />
        </div>

        {/* 3D Viewer */}
        <div className="flex-1 bg-white md:border-2 border-gray-200 md:rounded-2xl overflow-hidden relative md:shadow-xl">
          <ThreeScene
            ref={threeSceneRef}
            selectedFurniture={selectedFurniture}
            onFurnitureCountChange={setFurnitureCount}
          />

          {/* Mobile Floating Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden fixed bottom-24 right-4 w-16 h-16 bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-95 transition-transform border-4 border-white"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Drawer Content */}
              <div className="md:hidden fixed left-6 right-6 bottom-0 max-h-[85vh] bg-gradient-to-b from-white to-gray-50 rounded-t-3xl shadow-2xl z-50 overflow-hidden">
                <div className="flex flex-col h-full">
                  {/* Handle */}
                  <div className="flex justify-center pt-4 pb-2">
                    <div className="w-16 h-1.5 bg-gray-400 rounded-full" />
                  </div>
                  
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 pb-4 pt-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Agregar Muebles</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Selecciona un catálogo y mueble</p>
                    </div>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto px-6 pb-4">
                    <FurnitureSidebar
                      furnitureCount={furnitureCount}
                      roomModelLoaded={roomModelLoaded}
                      selectedRoomId={selectedRoomId}
                      availableRooms={availableRooms}
                      customFurniture={availableFurniture}
                      onFurnitureSelect={setSelectedFurniture}
                      onLoadCustomFurniture={(file) => {
                        threeSceneRef.current?.loadCustomFurniture(file);
                        setIsMobileMenuOpen(false);
                      }}
                      onClearFurniture={() => {
                        threeSceneRef.current?.clearAllFurniture();
                        setIsMobileMenuOpen(false);
                      }}
                      onResetCamera={() => threeSceneRef.current?.resetCamera()}
                      onToggleWireframe={() => threeSceneRef.current?.toggleWireframe()}
                      onLoadFromUrl={handleMobileFurnitureLoad}
                      onLoadRoom={handleLoadRoom}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Instructions - Solo visible en desktop */}
          <div className="hidden md:block absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-4 rounded-2xl border-2 border-gray-200 shadow-2xl max-w-4xl">
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

          {/* Mobile Instructions */}
          <div className="md:hidden absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-lg">
            <p className="text-xs text-gray-600 text-center">
              <span className="font-semibold">🖱️ Arrastra:</span> Rotar |{' '}
              <span className="font-semibold">🔍 Pellizca:</span> Zoom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
