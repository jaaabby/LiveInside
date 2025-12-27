import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TopBar } from '@/components/layout/TopBar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';

const propertySchema = z.object({
  address: z.string().min(5, 'Dirección requerida'),
  city: z.string().min(2, 'Ciudad requerida'),
  region: z.string().min(2, 'Región requerida'),
  postalCode: z.string().optional(),
  country: z.string().min(2, 'País requerido'),
  name: z.string().min(2, 'Nombre de presentación requerido'),
  internalNotes: z.string().optional(),
  internalId: z.string().optional(),
});

type PropertyForm = z.infer<typeof propertySchema>;

export function NewPropertyPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      country: 'Chile',
    },
  });

  const onSubmit = async (data: PropertyForm) => {
    setIsLoading(true);
    try {
      await api.properties.create({
        ...data,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
        status: 'active',
        visits: 0,
      });
      navigate('/properties');
    } catch (error) {
      console.error('Error creating property:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Nueva propiedad" showBack />

      <div className="p-4 md:p-6 md:max-w-2xl md:mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Dirección</h2>
                <p className="text-sm text-gray-500">Ubicación de la propiedad</p>
              </div>
            </div>

            <Input
              {...register('address')}
              label="Dirección 1"
              placeholder="Calle, número, depto"
              error={errors.address?.message}
            />

            <Input
              {...register('city')}
              label="Ciudad/Localidad"
              placeholder="Ciudad"
              error={errors.city?.message}
            />

            <Input
              {...register('region')}
              label="Región"
              placeholder="Región"
              error={errors.region?.message}
            />

            <Input
              {...register('postalCode')}
              label="Código Postal"
              placeholder="Código postal"
              error={errors.postalCode?.message}
            />

            <Input
              {...register('country')}
              label="País"
              placeholder="País"
              error={errors.country?.message}
            />
          </div>

          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Información</h2>
                <p className="text-sm text-gray-500">Detalles adicionales</p>
              </div>
            </div>

            <Input
              {...register('name')}
              label="Nombre presentación"
              placeholder="Ej: Casa Calbuco"
              error={errors.name?.message}
            />

            <Input
              {...register('internalNotes')}
              label="Notas internas"
              placeholder="Notas privadas"
              error={errors.internalNotes?.message}
            />

            <Input
              {...register('internalId')}
              label="ID interno"
              placeholder="Código interno"
              error={errors.internalId?.message}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            Guardar
          </Button>
        </form>
      </div>
    </div>
  );
}
