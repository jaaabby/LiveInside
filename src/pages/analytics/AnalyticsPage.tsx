import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardBody } from '@/components/ui/Card';
import { LoadingPage } from '@/components/ui/Loading';
import { api } from '@/services/api';
import { availableRooms } from '@/data/roomSpaces';
import type { AnalyticsData } from '@/types';

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const analytics = await api.analytics.getDashboard();
      setData(analytics);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center gap-3">
        <img
          src="/logo_blanco_horizontal.png"
          alt="LiveInside"
          className="h-8"
        />
        <h1 className="text-white text-lg font-semibold">Analíticas</h1>
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar title="Panel de Control" subtitle="Resumen de actividad y rendimiento" />
      </div>

      <div className="p-4 md:p-6 md:max-w-7xl md:mx-auto pb-24 md:pb-6">
        {/* Summary Cards - Desktop and Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Visits Card */}
          <Card className="bg-white">
            <CardBody>
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Visitas totales</h3>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {data.totalVisits.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 font-medium">
                +{data.visitsChange}% respecto al mes anterior
              </p>
            </CardBody>
          </Card>

          {/* Active Properties Card */}
          <Card className="bg-white">
            <CardBody>
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Propiedades activas</h3>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {data.recentProperties?.filter(p => p.status === 'active').length || 0}
              </p>
              <p className="text-sm text-gray-600">
                De {data.recentProperties?.length || 0} totales
              </p>
            </CardBody>
          </Card>

          {/* Quotes Card */}
          <Card className="bg-white">
            <CardBody>
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Cotizaciones</h3>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {data.totalQuotes || 0}
              </p>
              <p className="text-sm text-gray-600">
                Este mes
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Top Product Card with Image */}
        {data.topProduct && (
          <Card className="mb-6 bg-white">
            <CardBody>
              <h3 className="text-base font-semibold text-gray-700 mb-4">Mueble más seleccionado</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={data.topProduct.image}
                    alt={data.topProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1 uppercase">
                    {data.topProduct.sku || 'FJÄLBO'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{data.topProduct.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                      {data.topProduct.views} visualizaciones
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Recent Properties - Showing Available Spaces */}
        <Card className="bg-white">
          <CardBody>
            <h3 className="text-base font-semibold text-gray-700 mb-4">Propiedades Recientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer border border-gray-200"
                >
                  <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden shadow-sm">
                    {room.thumbnail ? (
                      <img
                        src={room.thumbnail}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1 text-lg">{room.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs font-medium text-gray-600 border border-gray-200">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Modelo 3D
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 rounded text-xs font-medium text-green-700 border border-green-200">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Disponible
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

