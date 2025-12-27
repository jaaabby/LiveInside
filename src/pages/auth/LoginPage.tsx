import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
      name: 'Empresa 1',
      type: (searchParams.get('type') as 'broker' | 'buyer') || 'broker',
      plan: 'pro',
      companyName: 'Empresa 1',
    });

    setIsLoading(false);
    navigate('/properties');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-700 flex flex-col p-6 safe-top safe-bottom">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">LiveInside</h1>
            <p className="text-white/90 font-medium">INICIO DE SESIÓN</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('email')}
              type="email"
              placeholder="Correo electrónico"
              error={errors.email?.message}
              className="bg-white"
            />
            <Input
              {...register('password')}
              type="password"
              placeholder="Contraseña"
              error={errors.password?.message}
              className="bg-white"
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-white/90 hover:text-white underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              isLoading={isLoading}
            >
              Ingresar
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-white/90 text-sm">¿No tienes una cuenta?</p>
            <Link to="/register">
              <Button variant="primary" className="w-full bg-secondary-500 hover:bg-secondary-600">
                Regístrate
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm mb-3">o</p>
            <button className="w-full bg-white text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Ingresar con Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login-company"
              className="text-white/90 text-sm hover:text-white underline"
            >
              Ingresar como invitado
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
