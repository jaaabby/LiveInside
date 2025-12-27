import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-700 flex flex-col items-center justify-between p-6 safe-top safe-bottom">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Bienvenido
            <br />a
          </h1>
          <h2 className="text-5xl font-bold text-white mb-2">LiveInside</h2>
        </div>

        <p className="text-white/90 text-lg font-medium mb-12">
          INDICA TU TIPO DE USUARIO
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <button
            onClick={() => navigate('/login?type=broker')}
            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all duration-200 shadow-lg"
          >
            <div className="mb-4">
              <svg className="w-20 h-20 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm">
              Corredor/a de
              <br />
              propiedades
            </p>
          </button>

          <button
            onClick={() => navigate('/login?type=buyer')}
            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 hover:bg-white/20 transition-all duration-200 shadow-lg"
          >
            <div className="mb-4">
              <svg className="w-20 h-20 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-white font-semibold text-sm">
              Arrendatario/
              <br />
              Comprador
            </p>
          </button>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        <Link to="/login">
          <Button variant="secondary" className="w-full">
            Ya tengo una cuenta
          </Button>
        </Link>
      </div>
    </div>
  );
}
