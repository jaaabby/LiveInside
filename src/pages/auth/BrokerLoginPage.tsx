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
                src="/src/assets/images/logo_color_vertical_LiveInside (4) (2).png" 
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
              className="w-full bg-primary-600 hover:bg-primary-700"
              isLoading={isLoading}
            >
              Ingresar
            </Button>
          </form>

          {/* Register section */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600 text-sm">¿No tienes una cuenta?</p>
            <Link to="/register?type=broker">
              <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700">
                Regístrate
              </Button>
            </Link>
          </div>

          {/* Divider */}
          <div className="mt-6 mb-6 text-center">
            <span className="text-gray-400 text-sm">o</span>
          </div>

          {/* Company code button */}
          <Link to="/register-company">
            <Button variant="primary" className="w-full bg-blue-600 hover:bg-blue-700">
              Regístrate con código de empresa
            </Button>
          </Link>

          <p className="text-center text-xs text-gray-500 mt-4">
            Dirigido para personas de empresas. Usa el código que te dieron.
          </p>
        </div>
      </div>
    </div>
  );
}
