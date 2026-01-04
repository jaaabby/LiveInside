import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { LoadingPage } from '@/components/ui/Loading';
import { api } from '@/services/api';
import type { Catalog } from '@/types';

export function CatalogsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const propertyId = searchParams.get('propertyId');

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    try {
      const data = await api.catalogs.getAll();
      setCatalogs(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(propertyId ? `/properties/${propertyId}` : '/properties')} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-semibold">Catálogos</h1>
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar title="Catálogos" />
      </div>

      <div className="p-4 md:p-6 md:max-w-4xl md:mx-auto pb-24 md:pb-6">
        <div className="grid grid-cols-2 gap-4">
          {catalogs.map((catalog) => (
            <Card
              key={catalog.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/catalogs/${catalog.id}`)}
            >
              <div className="aspect-[4/3] bg-white flex items-center justify-center p-6">
                <img
                  src={catalog.logo}
                  alt={catalog.name}
                  className={`max-w-full max-h-full object-contain ${catalog.name === 'Easy' ? 'scale-125' : ''}`}
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-sm text-gray-900">
                  {catalog.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="hidden md:block fixed bottom-6 right-4">
        <button
          onClick={() => navigate('/cart')}
          className="w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
      </div>

      {/* Custom Bottom Nav for catalogs page */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-2 h-16">
          <button
            onClick={() => navigate(propertyId ? `/catalogs?propertyId=${propertyId}` : '/catalogs')}
            className="flex flex-col items-center justify-center gap-1 text-primary-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs font-medium">Catálogos</span>
          </button>
          <button
            onClick={() => navigate(propertyId ? `/cart?propertyId=${propertyId}` : '/cart')}
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs font-medium">Ver Carrito</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
