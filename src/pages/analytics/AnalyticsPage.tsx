import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardBody } from '@/components/ui/Card';
import { LoadingPage } from '@/components/ui/Loading';
import { api } from '@/services/api';
import { formatCurrency } from '@/utils/helpers';
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
      <TopBar title="Analíticas" />

      <div className="p-4 md:p-6 md:max-w-7xl md:mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
          <p className="text-gray-600">Resumen de actividad y rendimiento</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Visits Card */}
          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Visitas totales</h3>
              <p className="text-4xl font-bold text-gray-900 mb-2">
                {data.totalVisits.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 font-medium">
                +{data.visitsChange}% respecto al mes anterior
              </p>
            </CardBody>
          </Card>

          {/* Top Product */}
          {data.topProduct && (
            <Card className="md:col-span-2">
              <CardBody>
                <h3 className="text-sm font-medium text-gray-600 mb-4">Mueble más seleccionado</h3>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={data.topProduct.image}
                      alt={data.topProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {data.topProduct.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{data.topProduct.sku}</p>
                    <p className="text-sm text-gray-500">
                      {data.topProduct.views} visualizaciones
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Top Colors */}
          {data.topColors && data.topColors.length > 0 && (
            <Card className="md:col-span-2">
              <CardBody>
                <h3 className="text-sm font-medium text-gray-600 mb-4">Colores más aplicados</h3>
                <div className="grid grid-cols-3 gap-4">
                  {data.topColors.map((color, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-full aspect-[4/3] rounded-lg mb-2"
                        style={{ backgroundColor: color.color.toLowerCase() }}
                      />
                      <p className="text-sm font-medium text-gray-900">{color.color}</p>
                      <p className="text-xs text-gray-500">{color.count} veces</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Recent Properties */}
          {data.recentProperties && data.recentProperties.length > 0 && (
            <Card className="md:col-span-3">
              <CardBody>
                <h3 className="text-sm font-medium text-gray-600 mb-4">Propiedades Recientes</h3>
                <div className="space-y-3">
                  {data.recentProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{property.name}</h4>
                        <p className="text-sm text-gray-500">{property.visits} visitas</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : property.status === 'inactive'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {property.status === 'active'
                          ? 'Activa'
                          : property.status === 'inactive'
                          ? 'Inactiva'
                          : 'Rentada'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Additional Sections */}
        <div className="mt-6">
          <Card>
            <CardBody>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Análisis de comportamientos</h3>
              <div className="space-y-2">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Staging y catalogado</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-3 text-sm text-gray-600">
                    Métricas de staging y catalogado de productos...
                  </div>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Muebles más seleccionados</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-3 text-sm text-gray-600">
                    Productos más populares en visualizaciones...
                  </div>
                </details>

                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Estilos y colores más aplicados</span>
                    <svg
                      className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="p-3 text-sm text-gray-600">
                    Tendencias de diseño y colores preferidos...
                  </div>
                </details>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
