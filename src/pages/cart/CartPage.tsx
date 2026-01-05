import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrency } from '@/utils/helpers';
import { api } from '@/services/api';

export function CartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { carts, activeCartId, setActiveCart, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCartSelector, setShowCartSelector] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const propertyId = searchParams.get('propertyId');
  const currentCart = carts.find(c => c.id === activeCartId) || carts[0];
  const items = currentCart?.items || [];

  const handleGenerateQuote = async () => {
    if (!currentCart) return;
    setIsLoading(true);
    try {
      await api.quotes.create({
        catalogName: `Carrito ${currentCart.clientName}`,
        items,
        total: getTotal(currentCart.id),
        currency: 'CLP',
        status: 'draft',
      });
      clearCart(currentCart.id);
      navigate('/quotes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email || !currentCart) return;
    setIsLoading(true);
    try {
      const quote = await api.quotes.create({
        catalogName: `Carrito ${currentCart.clientName}`,
        items,
        total: getTotal(currentCart.id),
        currency: 'CLP',
        status: 'sent',
      });
      await api.quotes.sendByEmail(quote.id, email);
      setShowEmailModal(false);
      setEmail('');
      clearCart(currentCart.id);
      navigate('/quotes');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Mobile Header */}
        <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(propertyId ? `/properties/${propertyId}` : '/properties')} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src="/logo_blanco_horizontal.png"
            alt="LiveInside"
            className="h-8"
          />
          <div className="w-6" />
        </header>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <TopBar title="Carrito de compras" />
        </div>

        <div className="pb-24">
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            title="Tu carrito está vacío"
            description="Agrega productos desde los catálogos"
            action={{
              label: 'Ver catálogos',
              onClick: () => navigate(propertyId ? `/catalogs?propertyId=${propertyId}` : '/catalogs'),
            }}
          />
        </div>
        
        {/* Custom Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
          <div className="grid grid-cols-3 h-16">
            <button
              onClick={() => navigate(propertyId ? `/catalogs?propertyId=${propertyId}` : '/catalogs')}
              className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs font-medium">Catálogos</span>
            </button>
            <button
              className="flex flex-col items-center justify-center gap-1 text-primary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs font-medium">Carrito</span>
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

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(propertyId ? `/properties/${propertyId}` : '/properties')} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <img
          src="/logo_blanco_horizontal.png"
          alt="LiveInside"
          className="h-8"
        />
        <div className="w-6" />
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar title="Carrito de compras" />
      </div>

      <div className="p-4 md:p-6 md:max-w-3xl md:mx-auto pb-32">
        {/* Cart Selector Dropdown */}
        <div className="mb-6">
          <div className="relative">
            <button
              onClick={() => setShowCartSelector(!showCartSelector)}
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium uppercase">Carrito actual</p>
                  <p className="font-bold text-gray-900 text-lg">{currentCart?.clientName}</p>
                  <p className="text-sm text-gray-600">
                    {items.length === 0 ? 'Carrito vacío' : `${items.length} ${items.length === 1 ? 'producto' : 'productos'}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <div className="w-8 h-8 bg-primary-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {items.length}
                  </div>
                )}
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${showCartSelector ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showCartSelector && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  {carts.map((cart, index) => {
                    const isActive = cart.id === currentCart?.id;
                    return (
                      <button
                        key={cart.id}
                        onClick={() => {
                          setActiveCart(cart.id);
                          setShowCartSelector(false);
                        }}
                        className={`w-full p-4 flex items-center gap-3 transition-colors ${
                          isActive ? 'bg-primary-50 border-l-4 border-l-primary-600' : 'hover:bg-gray-50'
                        } ${index !== carts.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-600'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <p className={`font-semibold ${isActive ? 'text-primary-900' : 'text-gray-900'}`}>
                            {cart.clientName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {cart.items.length === 0 ? 'Vacío' : `${cart.items.length} ${cart.items.length === 1 ? 'item' : 'items'}`}
                          </p>
                        </div>
                        {cart.items.length > 0 && (
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {cart.items.length}
                          </div>
                        )}
                        {isActive && (
                          <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-base font-bold text-primary-600">TU CARRITO</h2>
          <p className="text-sm text-primary-400">{items.length} Productos en total</p>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.product.id}>
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm uppercase mb-0.5">
                    {item.product.sku || 'MUEBLE'}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">{item.product.name}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(currentCart.id, item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(currentCart.id, item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(currentCart.id, item.product.id)}
                      className="text-xs text-gray-600 hover:text-gray-900 underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-primary-600 text-base">
                    {formatCurrency(item.product.price * item.quantity, item.product.currency)}
                  </p>
                </div>
              </div>
              {index < items.length - 1 && (
                <div className="mt-4 border-b border-gray-200"></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-600">Subtotal incl. IVA</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(getTotal(currentCart.id), 'CLP')}
            </span>
          </div>
          <Button
            variant="primary"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold"
            onClick={handleGenerateQuote}
            isLoading={isLoading}
          >
            Generar cotización
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="¿Desea enviar cotización a correo electrónico?"
      >
        <div className="p-6 space-y-4">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Correo electrónico"
          />
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setShowEmailModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSendEmail}
              isLoading={isLoading}
            >
              Enviar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Custom Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="grid grid-cols-3 h-16">
          <button
            onClick={() => navigate(propertyId ? `/catalogs?propertyId=${propertyId}` : '/catalogs')}
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-xs font-medium">Catálogos</span>
          </button>
          <button
            className="flex flex-col items-center justify-center gap-1 text-primary-600 relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs font-medium">Carrito</span>
            {items.length > 0 && (
              <div className="absolute top-1 right-1/4 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {items.length}
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
