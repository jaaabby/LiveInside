import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { LoadingPage } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';
import type { Property } from '@/types';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    if (!id) return;
    try {
      const data = await api.properties.getById(id);
      setProperty(data || null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Propiedad no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary-600 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/properties')} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-semibold">{property.name}</h1>
        <div className="w-6" />
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar title={property.name} />
      </div>

      {!showViewer ? (
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[500px]">
                <img
                  src={property.images[0]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-sm font-semibold text-primary-600">
                    {property.status === 'active' ? 'Disponible' : 
                     property.status === 'inactive' ? 'No Disponible' : 'Arrendada'}
                  </span>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex-1">
                  {/* Property Title */}
                  <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {property.name}
                    </h1>
                    <div className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="leading-relaxed">{property.address}</p>
                    </div>
                  </div>

                  {/* Property Features */}
                  {property.bedrooms && property.bathrooms && property.area && (
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Características
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-6 h-6 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span className="text-2xl font-bold text-gray-900">{property.bedrooms}</span>
                          <span className="text-xs text-gray-600">Dormitorios</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-6 h-6 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          <span className="text-2xl font-bold text-gray-900">{property.bathrooms}</span>
                          <span className="text-xs text-gray-600">Baños</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-6 h-6 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span className="text-2xl font-bold text-gray-900">{property.area}</span>
                          <span className="text-xs text-gray-600">m²</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {property.description && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Descripción
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {property.description}
                      </p>
                    </div>
                  )}

                  {/* Spaces */}
                  {property.spaces && property.spaces.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Espacios
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {property.spaces.map((space, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full"
                          >
                            {space}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Button 
                    variant="primary" 
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-primary-600/30"
                    onClick={() => navigate(`/properties/${id}/virtual-tour`)}
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Tour Virtual 3D
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-[calc(100vh-3.5rem)]">
          <ARViewer propertyId={property.id} onClose={() => setShowViewer(false)} />
        </div>
      )}
    </div>
  );
}

function ARViewer({ onClose }: { propertyId: string; onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Placeholder for Unity viewer */}
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white/20 flex items-center justify-center">
            <svg className="w-12 h-12 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium">Visor AR/3D</p>
          <p className="text-sm text-white/60 mt-2">
            Aquí se cargará el visor Unity
          </p>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          onClick={() => navigate('/catalogs')}
          className="px-4 py-2 rounded-full bg-primary-600 text-white font-medium"
        >
          Catálogos
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-4 right-4 flex justify-center gap-3 z-10">
        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center border border-white/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
        <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center border border-white/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
