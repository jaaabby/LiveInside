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
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const propertyId = searchParams.get('propertyId');

  const handleGenerateQuote = async () => {
    setIsLoading(true);
    try {
      await api.quotes.create({
        catalogName: 'Catálogo IKEA',
        items,
        total: getTotal(),
        currency: 'CLP',
        status: 'draft',
      });
      clearCart();
      navigate('/quotes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      const quote = await api.quotes.create({
        catalogName: 'Catálogo IKEA',
        items,
        total: getTotal(),
        currency: 'CLP',
        status: 'sent',
      });
      await api.quotes.sendByEmail(quote.id, email);
      setShowEmailModal(false);
      setEmail('');
      clearCart();
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="grid grid-cols-2 h-16">
            <button
              onClick={() => navigate(propertyId ? `/catalogs?propertyId=${propertyId}` : '/catalogs')}
              className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-medium">Catálogos</span>
            </button>
            <button
              className="flex flex-col items-center justify-center gap-1 text-primary-600"
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
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm uppercase mb-0.5">
                    {item.product.sku}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">{item.product.name}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs text-gray-600 hover:text-gray-900 underline"
                    >
                      Eliminar
                    </button>
                    <button className="text-xs text-gray-600 hover:text-gray-900 underline">
                      Mover a favoritos
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
              {formatCurrency(getTotal(), 'CLP')}
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-2 h-16">
          <button
            onClick={() => navigate(propertyId ? `/catalogs?propertyId=${propertyId}` : '/catalogs')}
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs font-medium">Catálogos</span>
          </button>
          <button
            className="flex flex-col items-center justify-center gap-1 text-primary-600"
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
