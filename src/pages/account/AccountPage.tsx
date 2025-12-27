import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';

export function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    companyRut: user?.companyRut || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    region: user?.region || '',
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-700">
      <TopBar title="Cuenta" showBack />

      <div className="p-4 md:p-6 md:max-w-2xl md:mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="bg-primary-600 p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-white flex items-center justify-center text-primary-600 text-3xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Perfil</h2>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre empresa
              </label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <p className="text-gray-900 font-medium">{user?.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rut empresa
              </label>
              {isEditing ? (
                <Input
                  value={formData.companyRut}
                  onChange={(e) => setFormData({ ...formData, companyRut: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{user?.companyRut || '20.123.456-7'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{user?.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{user?.phone || '+56912345678'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              {isEditing ? (
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{user?.address || 'Calle #1234'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comuna
              </label>
              {isEditing ? (
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{user?.city || 'Santiago'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Región
              </label>
              {isEditing ? (
                <Input
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                />
              ) : (
                <p className="text-gray-900">{user?.region || 'Metropolitana'}</p>
              )}
            </div>

            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de usuario
              </label>
              <p className="text-gray-900 font-medium">
                {user?.type === 'broker' ? 'Corredor de propiedades / Empresa' : 'Comprador'}
              </p>
            </div>

            <div className="pt-4">
              {isEditing ? (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" className="flex-1" onClick={handleSave}>
                    Guardar
                  </Button>
                </div>
              ) : (
                <Button variant="primary" className="w-full" onClick={() => setIsEditing(true)}>
                  Editar perfil
                </Button>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button className="w-full text-primary-600 text-sm font-medium py-2 hover:bg-gray-50 rounded-lg transition-colors">
                Más información sobre los diferentes planes
              </button>
              <button className="w-full text-red-600 text-sm font-medium py-2 hover:bg-red-50 rounded-lg transition-colors">
                Enviar una solicitud de eliminación de cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
