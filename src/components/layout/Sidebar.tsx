import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/helpers';
import { useAuthStore } from '@/stores/useAuthStore';

const navSections = [
  {
    title: 'Principal',
    items: [
      {
        id: 'properties',
        label: 'Propiedades',
        path: '/properties',
      },
      {
        id: 'dashboard',
        label: 'Panel de Control',
        path: '/analytics',
      },
    ],
  },
  {
    title: 'Análisis',
    items: [
      {
        id: 'reports',
        label: 'Reportes',
        path: '/analytics/reports',
      },
      {
        id: 'analytics',
        label: 'Analítica',
        path: '/analytics/insights',
      },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      {
        id: 'billing',
        label: 'Facturación',
        path: '/account/billing',
      },
      {
        id: 'settings',
        label: 'Configuración',
        path: '/settings',
      },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <aside className="hidden md:flex md:flex-col w-56 bg-purple-50 h-screen sticky top-0">
      <div className="p-6 flex flex-col items-center">
        <div className="mb-3">
          <img 
            src="/src/assets/images/logo_color_vertical_LiveInside (4) (2).png" 
            alt="LiveInside Logo" 
            className="w-20 h-auto"
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        <button 
          onClick={() => navigate('/plans')}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors"
        >
          Plan {user?.plan?.toUpperCase() || 'PRO'}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-0 overflow-y-auto pb-4">
        {navSections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? 'mt-5' : ''}>
            <div className="py-2 text-sm font-bold text-gray-900">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={cn(
                      'block px-6 py-2.5 text-sm rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-200 text-gray-900 font-medium'
                        : 'text-gray-900 hover:bg-purple-100'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
