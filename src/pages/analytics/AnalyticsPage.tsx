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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

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

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (isLoading) return <LoadingPage />;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center gap-3">
        <img
          src="/src/assets/images/logo_blanco_horizontal.png"
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
        {/* Mobile Dashboard Section */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => toggleSection('dashboard')}
            className="flex items-center justify-between w-full text-left font-semibold text-primary-600 text-base"
          >
            Dashboard
            <svg className={`w-5 h-5 transition-transform ${openSections['dashboard'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openSections['dashboard'] && (
            <div className="mt-4 space-y-4">
              {/* Top Product - Mobile */}
              {data.topProduct && (
                <Card>
                  <CardBody>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Mueble más seleccionado</h3>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={data.topProduct.image}
                          alt={data.topProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {data.topProduct.name}
                        </h4>
                        <p className="text-sm text-gray-600">{data.topProduct.sku}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {data.topProduct.views} visualizaciones
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Visits Card - Mobile */}
              <Card>
                <CardBody>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Visitas totales</h3>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {data.totalVisits.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    +{data.visitsChange}% respecto al mes anterior
                  </p>
                </CardBody>
              </Card>
            </div>
          )}
        </div>

        {/* Mobile Behavior Analysis Section */}
        <div className="md:hidden mb-6">
          <button 
            onClick={() => toggleSection('behavior')}
            className="flex items-center justify-between w-full text-left font-semibold text-primary-600 text-base mb-4"
          >
            Análisis de comportamientos
            <svg className={`w-5 h-5 transition-transform ${openSections['behavior'] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSections['behavior'] && (
            <div className="space-y-4">
              {/* Staging y catálogo */}
              <div>
                <h4 className="text-sm font-medium text-primary-500 mb-2">Staging y catálogo</h4>
                <div className="space-y-2">
                  <button className="w-full bg-white rounded-lg px-4 py-3 flex items-center justify-between text-left shadow-sm">
                    <span className="text-sm text-gray-700">Muebles más seleccionados</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button className="w-full bg-white rounded-lg px-4 py-3 flex items-center justify-between text-left shadow-sm">
                    <span className="text-sm text-gray-700">Estilos y colores más aplicados</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navegación y uso del tour */}
              <div>
                <h4 className="text-sm font-medium text-primary-500 mb-2">Navegación y uso del tour</h4>
                <div className="space-y-2">
                  <button className="w-full bg-white rounded-lg px-4 py-3 flex items-center justify-between text-left shadow-sm">
                    <span className="text-sm text-gray-700">Funcionalidades más usadas</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button className="w-full bg-white rounded-lg px-4 py-3 flex items-center justify-between text-left shadow-sm">
                    <span className="text-sm text-gray-700">Tiempos de permanencia por habitación</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Sesiones compartidas */}
              <div>
                <h4 className="text-sm font-medium text-primary-500 mb-2">Sesiones compartidas</h4>
                <button className="w-full bg-white rounded-lg px-4 py-3 flex items-center justify-between text-left shadow-sm">
                  <span className="text-sm text-gray-700">Nº sesiones, participantes y acciones colaborativas</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Data Reports Section */}
        <div className="md:hidden">
          <h3 className="font-semibold text-primary-600 text-base mb-4">Informes de datos</h3>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Propiedades Recientes</h3>
                  <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                    Nueva propiedad
                  </button>
                </div>
                <div className="space-y-3">
                  {data.recentProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-20 h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                        {/* Property image placeholder */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{property.name}</h4>
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
                          ? 'Activo'
                          : property.status === 'inactive'
                          ? 'Inactivo'
                          : 'Borrador'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

