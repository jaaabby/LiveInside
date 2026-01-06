import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { LoadingPage } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { useCartStore } from '@/stores/useCartStore';
import { api } from '@/services/api';
import { formatCurrency } from '@/utils/helpers';
import { furnitureCatalogs } from '@/data/customFurniture';
import type { Product } from '@/types';

export function CatalogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { carts, addItem } = useCartStore();
  
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

  // Obtener el catálogo correspondiente al ID
  const currentCatalog = furnitureCatalogs.find(cat => cat.id === id || 
    (id === '1' && cat.id === 'ikea') ||
    (id === '2' && cat.id === 'sodimac') ||
    (id === '3' && cat.id === 'casaideas') ||
    (id === '4' && cat.id === 'easy')
  );

  const catalogName = currentCatalog ? currentCatalog.name : 'Catálogo';

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setShowCartModal(true);
  };

  const confirmAddToCart = (cartId: string) => {
    if (selectedProduct) {
      addItem(cartId, selectedProduct);
      setShowCartModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary-600 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(propertyId ? `/catalogs?propertyId=${propertyId}` : '/catalogs')} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-lg font-semibold flex-1 text-center">Catálogo / {catalogName}</h1>
        <button
          onClick={() => navigate(propertyId ? `/cart?propertyId=${propertyId}` : '/cart')}
          className="text-white relative"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {carts.reduce((total, cart) => total + cart.items.length, 0) > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {carts.reduce((total, cart) => total + cart.items.length, 0)}
            </div>
          )}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar
          title={`Catálogo / ${catalogName}`}
        />
      </div>

      <div className="bg-white pb-24 md:pb-6">
        {/* Store Logo */}
        {currentCatalog && (
          <div className="border-b border-gray-200 bg-white">
            <div className="flex items-center justify-center py-4 px-4">
              <a
                href={currentCatalog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src={currentCatalog.logo}
                  alt={currentCatalog.name}
                  className={`h-10 md:h-12 w-auto object-contain ${
                    currentCatalog.id === 'ikea' ? 'bg-[#0058A3] px-6 py-2 rounded' : ''
                  }`}
                />
              </a>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="p-4">
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
                  {/* Action Button */}
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Selection Modal */}
      <Modal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        title="Seleccionar carrito"
      >
        <div className="space-y-4 px-6 py-4">
          <p className="text-sm text-gray-600">
            ¿A qué carrito deseas agregar este producto?
          </p>
          
          {selectedProduct && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex gap-4 items-center">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-semibold">{selectedProduct.sku}</p>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{selectedProduct.name}</p>
                  <p className="text-sm font-bold text-primary-600 mt-1">
                    {formatCurrency(selectedProduct.price, selectedProduct.currency)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Selecciona el cliente</p>
            <div className="space-y-3">
              {carts.map((cart) => (
                <button
                  key={cart.id}
                  onClick={() => confirmAddToCart(cart.id)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">{cart.clientName}</h3>
                      <p className="text-sm text-gray-500">
                        {cart.items.length === 0 ? 'Carrito vacío' : `${cart.items.length} ${cart.items.length === 1 ? 'producto' : 'productos'}`}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Floating Cart Button for Desktop */}
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

      {/* Custom Bottom Nav for catalog detail page */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="grid grid-cols-3 h-16">
          <button
            onClick={() => navigate(propertyId ? `/catalogs?propertyId=${propertyId}` : '/catalogs')}
            className="flex flex-col items-center justify-center gap-1 text-primary-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-xs font-medium">Catálogos</span>
          </button>
          <button
            onClick={() => navigate(propertyId ? `/cart?propertyId=${propertyId}` : '/cart')}
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-900 transition-colors relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs font-medium">Carrito</span>
            {carts.reduce((total, cart) => total + cart.items.length, 0) > 0 && (
              <div className="absolute top-1 right-1/4 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {carts.reduce((total, cart) => total + cart.items.length, 0)}
              </div>
            )}
          </button>
          <button
            onClick={() => navigate('/quotes')}
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs font-medium">Cotizaciones</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
