import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { LoadingPage } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';
import type { Property } from '@/types';
import { formatDate } from '@/utils/helpers';
import { availableRooms } from '@/data/roomSpaces';

export function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      // Crear propiedades basadas en espacios disponibles
      const spacesAsProperties: Property[] = availableRooms.map((room, index) => ({
        id: room.id,
        name: room.name,
        address: `Espacio ${index + 1} - Demo`,
        city: 'Santiago',
        region: 'Metropolitana',
        country: 'Chile',
        images: [room.thumbnail || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
        status: 'active' as const,
        visits: 0,
        createdAt: new Date().toISOString(),
        roomModelPath: room.path,
        roomModelId: room.id
      }));
      setProperties(spacesAsProperties);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center gap-3">
        <img
          src="/src/assets/images/logo_blanco_horizontal.png"
          alt="LiveInside"
          className="h-8"
        />
        <h1 className="text-white text-lg font-semibold">Tus propiedades</h1>
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar title="Tus propiedades" />
      </div>

      <div className="p-4 md:p-6 md:max-w-7xl md:mx-auto pb-24 md:pb-6">
        {properties.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            title="No hay espacios disponibles"
            description="Coloca archivos .glb en public/models/rooms/"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Desktop Add Space Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 hover:border-primary-500 hover:bg-primary-50/50 transition-colors flex-col items-center justify-center gap-3 min-h-[280px]"
            >
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-primary-600 font-semibold">AGREGAR UN ESPACIO</span>
            </button>

            {/* Property Cards (from spaces) */}
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* Modal for adding property */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ingreso de  Propiedad"
        size="lg"
      >
        <form className="space-y-3 px-6 py-4">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Dirección:
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Ciudad/Localidad:
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Región:
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Código Postal:
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              País:
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Nombre presentación:
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Notas internas:
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              ID interno:
            </label>
            <input
              type="text"
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-gray-900 border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="flex justify-center pt-6 pb-2">
            <button
              type="submit"
              className="px-20 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    rented: 'bg-yellow-100 text-yellow-700',
  };

  const statusLabels = {
    active: 'Activa',
    inactive: 'Inactiva',
    rented: 'Rentada',
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative">
      <div onClick={() => navigate(`/properties/${property.id}`)}>
        <div className="aspect-[4/3] overflow-hidden">
          {property.roomModelPath ? (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <svg className="w-24 h-24 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          ) : (
            <img
              src={property.images[0]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-base text-primary-600 truncate flex-1">
              {property.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-gray-400 hover:text-gray-600 p-1 -mt-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500">Creado {formatDate(property.createdAt)}</p>
        </div>
      </div>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute top-12 right-4 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 min-w-[150px]">
            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              Editar
            </button>
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
              Eliminar
            </button>
          </div>
        </>
      )}
    </Card>
  );
}
