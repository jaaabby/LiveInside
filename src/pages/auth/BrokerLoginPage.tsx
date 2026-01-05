import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WavesHeader } from '@/components/ui/WavesHeader';
import { useAuthStore } from '@/stores/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function BrokerLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock login
    login({
      id: '1',
      email: data.email,
      name: 'Corredor Demo',
      type: 'broker',
      plan: 'pro',
      companyName: 'Inmobiliaria Demo',
    });

    setIsLoading(false);
    navigate('/properties');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Purple waves at the top */}
      <WavesHeader />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 text-white hover:text-white/80 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              <img 
                src="/images/logo_color_vertical_LiveInside (4) (2).png" 
                alt="LiveInside Logo" 
                className="w-28 h-auto mx-auto"
              />
            </div>
            <p className="text-primary-600 text-sm font-semibold tracking-wide">
              INICIO DE SESIÓN
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register('email')}
                type="email"
                placeholder="Correo electrónico"
                error={errors.email?.message}
                className="bg-white border-2 border-purple-200 focus:border-primary-500"
              />
            </div>
            
            <div>
              <Input
                {...register('password')}
                type="password"
                placeholder="Contraseña"
                error={errors.password?.message}
                className="bg-white border-2 border-purple-200 focus:border-primary-500"
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-base font-medium"
              isLoading={isLoading}
            >
              Ingresar
            </Button>
          </form>

          {/* Register section */}
          <div className="mt-5 text-center">
            <p className="text-gray-600 text-xs mb-3">¿No tienes una cuenta?</p>
            <Link to="/register?type=broker">
              <Button variant="primary" className="bg-blue-500 hover:bg-blue-600 px-8 py-2 rounded-full text-sm font-medium">
                Regístrate
              </Button>
            </Link>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center justify-center gap-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-gray-400 text-xs">o</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          {/* Company code button */}
          <Link to="/register-company">
            <Button variant="primary" className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl text-sm font-medium">
              Regístrate con código de empresa
            </Button>
          </Link>

          <p className="text-center text-xs text-gray-500 mt-3 px-4 leading-relaxed">
            Registro para personal de empresa. Usa el código que te proporcionaron.
          </p>
        </div>
      </div>
    </div>
  );
}
