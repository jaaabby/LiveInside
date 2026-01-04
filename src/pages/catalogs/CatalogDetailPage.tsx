import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { LoadingPage } from '@/components/ui/Loading';
import { useCartStore } from '@/stores/useCartStore';
import { api } from '@/services/api';
import { formatCurrency } from '@/utils/helpers';
import type { Product } from '@/types';

export function CatalogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  
  const propertyId = searchParams.get('propertyId');

  useEffect(() => {
    loadProducts();
  }, [id]);

  const loadProducts = async () => {
    if (!id) return;
    try {
      const data = await api.products.getByCatalog(id);
      setProducts(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  const catalogName = id === '1' ? 'IKEA' : 'Catálogo';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary-600 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(propertyId ? `/catalogs?propertyId=${propertyId}` : '/catalogs')} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-semibold">Catálogo / {catalogName}</h1>
        <div className="w-6" />
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar
          title={`Catálogo / ${catalogName}`}
        />
      </div>

      <div className="bg-white pb-24 md:pb-6">
        {/* Catalog Logo */}
        {id === '1' && (
          <div className="flex justify-center py-4 border-b border-gray-200">
            <div className="bg-[#0058A3] text-[#FFDB00] font-bold text-2xl px-8 py-2 rounded">
              IKEA
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="p-4">
          <h2 className="text-sm font-semibold mb-3">Mesas de centro con espacio extra para el orden</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden">
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {index < 2 && (
                    <div className="absolute top-2 left-2 bg-[#E4003A] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      NUEVO
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-gray-500 uppercase mb-1">{product.sku}</p>
                  <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="font-bold text-base text-gray-900 mb-3">
                    {formatCurrency(product.price, product.currency)}
                  </p>
                  {/* Action Icons */}
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => addItem(product)}
                      className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Bottom Nav for catalog detail page */}
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
