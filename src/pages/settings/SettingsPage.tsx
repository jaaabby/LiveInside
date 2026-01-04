import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { useAuthStore } from '@/stores/useAuthStore';

const menuItems = [
  {
    id: 'privacy',
    label: 'Configuraciones y privacidad',
    path: '/settings/privacy',
  },
  {
    id: 'help',
    label: 'Ayuda y asistencia',
    path: '/settings/help',
  },
  {
    id: 'storage',
    label: 'Almacenamiento y memoria',
    path: '/settings/storage',
  },
  {
    id: 'firmware',
    label: 'Firmware',
    path: '/settings/firmware',
  },
  {
    id: 'camera',
    label: 'Conexión de la cámara',
    path: '/settings/camera',
  },
  {
    id: 'plan',
    label: 'Mejora tu plan',
    path: '/plans',
  },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h1 className="text-white text-xl font-semibold">Configuración</h1>
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar title="Configuración" />
      </div>

      <div className="p-4 md:p-6 md:max-w-4xl md:mx-auto pb-24 md:pb-6">
        {/* Company Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            {user?.company || 'Empresa 1'}
          </h2>
          <p className="text-sm text-gray-600 mb-2">{user?.email || 'empresa.ejemplo@gmail.com'}</p>
          <button 
            onClick={() => navigate('/account')}
            className="text-primary-600 text-sm font-medium hover:underline"
          >
            Ver perfil
          </button>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="w-full bg-white hover:bg-gray-50 px-5 py-4 flex items-center justify-between transition-colors text-left"
            >
              <span className="text-primary-600 font-medium">{item.label}</span>
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
