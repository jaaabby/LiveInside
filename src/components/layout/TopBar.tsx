import { useAuthStore } from '@/stores/useAuthStore';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-primary-700">{title}</h1>
        {subtitle && <p className="text-sm text-primary-600 mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.name || 'Alexandra Navarro'}</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-base">
            {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AN'}
          </div>
        </div>
      </div>
    </header>
  );
}
