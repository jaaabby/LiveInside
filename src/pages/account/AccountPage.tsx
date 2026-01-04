import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';

export function AccountPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/settings')} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h1 className="text-white text-xl font-semibold">Cuenta</h1>
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar title="Cuenta" />
      </div>

      <div className="md:max-w-2xl md:mx-auto pb-24 md:pb-6 p-4 md:p-0">
        <div className="overflow-hidden rounded-3xl md:rounded-none">
          {/* Profile Header */}
          <div className="bg-primary-600 px-6 py-8 text-center">
            <p className="text-white text-sm mb-3">Perfil</p>
            <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-white text-xl font-semibold">
              {user?.company || 'Empresa 1'}
            </h2>
          </div>

          {/* Account Information */}
          <div className="bg-white">
          <div className="px-6 py-4 border-b border-gray-200">
            <label className="block text-sm text-primary-600 mb-1">Nombre empresa</label>
            <p className="text-base text-gray-600">{user?.company || 'Empresa 1'}</p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <label className="block text-sm text-primary-600 mb-1">Rut empresa</label>
            <p className="text-base text-gray-600">{user?.companyRut || '20.123.456-7'}</p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <label className="block text-sm text-primary-600 mb-1">Email</label>
            <p className="text-base text-gray-600">{user?.email || 'empresa.ejemplo@gmail.com'}</p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <label className="block text-sm text-primary-600 mb-1">Teléfono</label>
            <p className="text-base text-gray-600">{user?.phone || '+56912345678'}</p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <label className="block text-sm text-primary-600 mb-1">Dirección</label>
            <p className="text-base text-gray-600">{user?.address || 'Calle #1234'}</p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <label className="block text-sm text-primary-600 mb-1">Comuna</label>
            <p className="text-base text-gray-600">{user?.city || 'Santiago'}</p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <label className="block text-sm text-primary-600 mb-1">Región</label>
            <p className="text-base text-gray-600">{user?.region || 'Metropolitana'}</p>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <label className="block text-sm text-primary-600 mb-1">Tipo de usuario</label>
            <p className="text-base text-gray-600">
              {user?.type === 'broker' ? 'Corredora de propiedades / Empresa' : 'Comprador'}
            </p>
          </div>

          {/* Links */}
          <div className="px-6 py-4 space-y-2">
            <button 
              onClick={() => navigate('/plans')}
              className="w-full text-left text-primary-600 text-sm underline hover:text-primary-700"
            >
              Más información sobre los diferentes planes
            </button>
            <button className="w-full text-left text-primary-600 text-sm underline hover:text-primary-700">
              Enviar una solicitud de eliminación de cuenta
            </button>
          </div>

          {/* Logout Button */}
          <div className="px-6 py-6">
            <Button
              variant="primary"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-full py-3"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
