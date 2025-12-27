import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrency } from '@/utils/helpers';
import { api } from '@/services/api';

export function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQuote = async () => {
    setIsLoading(true);
    try {
      const quote = await api.quotes.create({
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
      <div className="min-h-screen bg-gray-50">
        <TopBar title="Carrito de compras" showBack />
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
            onClick: () => navigate('/catalogs'),
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Carrito de compras" showBack />

      <div className="p-4 md:p-6 md:max-w-3xl md:mx-auto pb-32">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-primary-600">TU CARRITO</h2>
          <p className="text-gray-600">{items.length} Productos en total</p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.product.id} className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.product.sku}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.product.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600 mb-2">
                    {formatCurrency(item.product.price, item.product.currency)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Eliminar
                  </button>
                  <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    Mover a favoritos
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Subtotal (incl. IVA)</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(getTotal(), 'CLP')}
            </span>
          </div>
          <Button
            variant="primary"
            className="w-full mb-3"
            onClick={handleGenerateQuote}
            isLoading={isLoading}
          >
            Generar cotización
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setShowEmailModal(true)}
          >
            Enviar por correo
          </Button>
        </Card>
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
    </div>
  );
}
