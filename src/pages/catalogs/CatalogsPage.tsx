import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { LoadingPage } from '@/components/ui/Loading';
import { api } from '@/services/api';
import type { Catalog } from '@/types';

export function CatalogsPage() {
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      <TopBar title="Catálogos" showBack />

      <div className="p-4 md:p-6 md:max-w-4xl md:mx-auto">
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
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg text-primary-600">
                  {catalog.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="fixed bottom-20 md:bottom-6 right-4">
        <button
          onClick={() => navigate('/cart')}
          className="w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
