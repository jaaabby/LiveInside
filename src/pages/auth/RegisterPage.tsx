import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { WavesHeader } from '@/components/ui/WavesHeader';
import { useAuthStore } from '@/stores/useAuthStore';

const individualSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

const companySchema = z.object({
  companyName: z.string().min(2, 'Nombre de empresa requerido'),
  companyRut: z.string().min(5, 'RUT requerido'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  companyCode: z.string().min(3, 'Código de empresa requerido'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type IndividualForm = z.infer<typeof individualSchema>;
type CompanyForm = z.infer<typeof companySchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBroker = searchParams.get('type') === 'broker';
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [_activeTab, setActiveTab] = useState('individual');

  const individualForm = useForm<IndividualForm>({
    resolver: zodResolver(individualSchema),
  });

  const companyForm = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
  });

  const onSubmitIndividual = async (data: IndividualForm) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    login({
      id: '1',
      email: data.email,
      name: `${data.name} ${data.lastName}`,
      type: 'broker',
      plan: 'starter',
    });

    setIsLoading(false);
    navigate('/properties');
  };

  const onSubmitCompany = async (data: CompanyForm) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    login({
      id: '1',
      email: data.email,
      name: data.companyName,
      type: 'broker',
      companyName: data.companyName,
      companyRut: data.companyRut,
      companyCode: data.companyCode,
      plan: 'pro',
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
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 text-white hover:text-white/80 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-6 pt-32 pb-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-700 mb-2">Crear Cuenta</h1>
            <p className="text-gray-600 text-sm">Ingresa los datos</p>
          </div>

          {isBroker ? (
            <div>
            <Tabs
              tabs={[
                {
                  id: 'individual',
                  label: 'Independiente',
                  content: (
                    <form onSubmit={individualForm.handleSubmit(onSubmitIndividual)} className="space-y-3.5">
                      <Input
                        {...individualForm.register('name')}
                        placeholder="Nombre"
                        error={individualForm.formState.errors.name?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />
                      <Input
                        {...individualForm.register('lastName')}
                        placeholder="Apellidos"
                        error={individualForm.formState.errors.lastName?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />
                      <Input
                        {...individualForm.register('email')}
                        type="email"
                        placeholder="Correo electrónico"
                        error={individualForm.formState.errors.email?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />
                      <Input
                        {...individualForm.register('password')}
                        type="password"
                        placeholder="Crear contraseña"
                        error={individualForm.formState.errors.password?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />
                      <Input
                        {...individualForm.register('confirmPassword')}
                        type="password"
                        placeholder="Confirmar contraseña"
                        error={individualForm.formState.errors.confirmPassword?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />

                      <div className="text-[11px] text-gray-600 leading-tight">
                        <label className="flex items-start gap-2">
                          <input type="checkbox" className="mt-0.5" required />
                          <span>
                            Para continuar acepta nuestros{' '}
                            <a href="#" className="text-primary-600 underline">
                              términos & condiciones
                            </a>{' '}
                            y nuestras políticas de privacidad.
                          </span>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-base font-medium mt-4"
                        isLoading={isLoading}
                      >
                        Siguiente
                      </Button>

                      <div className="text-center mt-4">
                        <p className="text-xs text-gray-600 mb-3">o regístrate con Google</p>
                        <button
                          type="button"
                          className="w-full bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          </svg>
                          Regístrate con Google
                        </button>
                      </div>

                      <p className="text-center text-xs text-gray-600 mt-4">
                        ¿Ya tienes una cuenta?{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="text-primary-600 font-medium underline"
                        >
                          Ingresar
                        </button>
                      </p>
                    </form>
                  ),
                },
                {
                  id: 'company',
                  label: 'Empresa',
                  content: (
                    <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-3.5">
                      <Input
                        {...companyForm.register('companyName')}
                        placeholder="Nombre de la empresa"
                        error={companyForm.formState.errors.companyName?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />
                      <Input
                        {...companyForm.register('companyRut')}
                        placeholder="Rut empresa"
                        error={companyForm.formState.errors.companyRut?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />
                      <Input
                        {...companyForm.register('email')}
                        type="email"
                        placeholder="Correo electrónico"
                        error={companyForm.formState.errors.email?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />
                      <Input
                        {...companyForm.register('password')}
                        type="password"
                        placeholder="Crear contraseña"
                        error={companyForm.formState.errors.password?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />
                      <Input
                        {...companyForm.register('confirmPassword')}
                        type="password"
                        placeholder="Confirmar contraseña"
                        error={companyForm.formState.errors.confirmPassword?.message}
                        className="bg-white border-2 border-purple-200 focus:border-primary-500"
                      />

                      <div className="text-[11px] text-gray-600 leading-tight">
                        <label className="flex items-start gap-2">
                          <input type="checkbox" className="mt-0.5" required />
                          <span>
                            Para continuar acepta nuestros{' '}
                            <a href="#" className="text-primary-600 underline">
                              términos & condiciones
                            </a>{' '}
                            y nuestras políticas de privacidad.
                          </span>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-base font-medium mt-4"
                        isLoading={isLoading}
                      >
                        Siguiente
                      </Button>

                      <div className="text-center mt-4">
                        <p className="text-xs text-gray-600 mb-3">o regístrate con Google</p>
                        <button
                          type="button"
                          className="w-full bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          </svg>
                          Regístrate con Google
                        </button>
                      </div>

                      <p className="text-center text-xs text-gray-600 mt-4">
                        ¿Ya tienes una cuenta?{' '}
                        <button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="text-primary-600 font-medium underline"
                        >
                          Ingresar
                        </button>
                      </p>
                    </form>
                  ),
                },
              ]}
              defaultTab="individual"
              onChange={setActiveTab}
            />
          </div>
          ) : (
            <form onSubmit={individualForm.handleSubmit(onSubmitIndividual)} className="space-y-3.5">
              <Input
                {...individualForm.register('name')}
                placeholder="Nombre"
                error={individualForm.formState.errors.name?.message}
                className="bg-white border-2 border-purple-200 focus:border-primary-500"
              />
              <Input
                {...individualForm.register('lastName')}
                placeholder="Apellidos"
                error={individualForm.formState.errors.lastName?.message}
                className="bg-white border-2 border-purple-200 focus:border-primary-500"
              />
              <Input
                {...individualForm.register('email')}
                type="email"
                placeholder="Correo electrónico"
                error={individualForm.formState.errors.email?.message}
                className="bg-white border-2 border-purple-200 focus:border-primary-500"
              />
              <Input
                {...individualForm.register('password')}
                type="password"
                placeholder="Crear contraseña"
                error={individualForm.formState.errors.password?.message}
                className="bg-white border-2 border-purple-200 focus:border-primary-500"
              />
              <Input
                {...individualForm.register('confirmPassword')}
                type="password"
                placeholder="Confirmar contraseña"
                error={individualForm.formState.errors.confirmPassword?.message}
                className="bg-white border-2 border-purple-200 focus:border-primary-500"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-base font-medium mt-4"
                isLoading={isLoading}
              >
                Siguiente
              </Button>

              <div className="text-[11px] text-gray-600 leading-tight pt-2">
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5" required />
                  <span>
                    Para continuar acepta nuestros{' '}
                    <a href="#" className="text-primary-600 underline">
                      términos & condiciones
                    </a>{' '}
                    y nuestras políticas de privacidad.
                  </span>
                </label>
              </div>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-600 mb-3">o regístrate con Google</p>
                <button
                  type="button"
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  </svg>
                  Regístrate con Google
                </button>
              </div>

              <p className="text-center text-xs text-gray-600 mt-4">
                ¿Ya tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-primary-600 font-medium underline"
                >
                  Ingresar
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
