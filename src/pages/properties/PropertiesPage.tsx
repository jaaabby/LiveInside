import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { LoadingPage } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/services/api';
import type { Property } from '@/types';
import { formatDate } from '@/utils/helpers';

export function PropertiesPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await api.properties.getAll();
      setProperties(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Tus propiedades"
        actions={
          <button
            onClick={() => navigate('/properties/new')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Nueva propiedad"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        }
      />

      <div className="p-4 md:p-6 md:max-w-7xl md:mx-auto">
        {properties.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            title="No tienes propiedades"
            description="Comienza agregando tu primera propiedad"
            action={{
              label: '+ Nueva propiedad',
              onClick: () => navigate('/properties/new'),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Add Property Card */}
            <button
              onClick={() => navigate('/properties/new')}
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 hover:border-primary-500 hover:bg-primary-50/50 transition-colors flex flex-col items-center justify-center gap-3 min-h-[280px]"
            >
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-primary-600 font-semibold">AGREGAR UNA PROPIEDAD</span>
            </button>

            {/* Property Cards */}
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
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
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 truncate flex-1">
              {property.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{property.address}</p>
          {property.bedrooms && property.bathrooms && property.area && (
            <p className="text-xs text-gray-500 mb-3">
              {property.bedrooms} dormitorios | {property.bathrooms} baños
              <br />
              {property.area} m² útiles
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[property.status]}`}>
              {statusLabels[property.status]}
            </span>
            <span className="text-xs text-gray-500">Creado {formatDate(property.createdAt)}</span>
          </div>
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
