import { useNavigate } from 'react-router-dom';
import { WavesHeader } from '@/components/ui/WavesHeader';

export function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Purple waves at the top */}
      <WavesHeader />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pt-32 pb-16 safe-bottom">
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-700 mb-0">
            Bienvenido
          </h1>
          <h1 className="text-3xl font-bold text-primary-700 mb-4">
            a
          </h1>
          
          {/* Logo LiveInside */}
          <div className="mb-4">
            <img 
              src="/src/assets/images/logo_color_vertical_LiveInside (4) (2).png" 
              alt="LiveInside Logo" 
              className="w-32 h-auto mx-auto"
            />
          </div>
        </div>

        <p className="text-primary-600 text-xs font-semibold mb-6 tracking-wider">
          INDICA TU TIPO DE USUARIO
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs px-4 mb-12">
          <button
            onClick={() => navigate('/broker-login')}
            className="bg-white border-2 border-purple-200 rounded-2xl p-3 hover:bg-purple-100 hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center"
          >
            <div className="w-full h-32 mb-2 bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src="/src/assets/images/corredor.png" 
                alt="Corredor" 
                className="w-auto h-full object-contain"
              />
            </div>
            <p className="text-primary-700 font-semibold text-xs text-center leading-tight">
              Corredor/a de<br />propiedades
            </p>
          </button>

          <button
            onClick={() => navigate('/login?type=buyer')}
            className="bg-white border-2 border-purple-200 rounded-2xl p-3 hover:bg-purple-100 hover:shadow-lg hover:scale-105 transition-all duration-200 flex flex-col items-center"
          >
            <div className="w-full h-32 mb-2 bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <img 
                src="/src/assets/images/comprador.png" 
                alt="Comprador" 
                className="w-auto h-full object-contain"
              />
            </div>
            <p className="text-primary-700 font-semibold text-xs text-center leading-tight">
              Arrendatario/<br />Comprador
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}