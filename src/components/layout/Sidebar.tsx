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
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        id: 'quotes',
        label: 'Cotizaciones',
        path: '/quotes',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Análisis',
    items: [
      {
        id: 'analytics',
        label: 'Analíticas',
        path: '/analytics',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Cuenta',
    items: [
      {
        id: 'settings',
        label: 'Configuración',
        path: '/settings',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
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
                      'flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary-200 text-gray-900 font-medium'
                        : 'text-gray-900 hover:bg-purple-100'
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
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
