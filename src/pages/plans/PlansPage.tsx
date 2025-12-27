import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';
import { api } from '@/services/api';
import { formatCurrency } from '@/utils/helpers';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Plan } from '@/types';

export function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await api.plans.getAll();
      setPlans(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  const currentPlan = user?.plan || 'starter';

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-700">
      <TopBar title="Planes" showBack />

      <div className="p-4 md:p-6 md:max-w-6xl md:mx-auto pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Elige tu plan</h1>
          <p className="text-white/90">Selecciona el plan que mejor se adapte a tus necesidades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan.toLowerCase() === plan.name.toLowerCase().replace('plan ', '');
            
            return (
              <Card key={plan.id} className={`overflow-hidden ${isCurrentPlan ? 'ring-4 ring-primary-400' : ''}`}>
                <div className={`p-6 ${isCurrentPlan ? 'bg-primary-50' : 'bg-white'}`}>
                  {isCurrentPlan && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                        Tu plan actual
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatCurrency(plan.price, plan.currency)}
                    </span>
                    <span className="text-gray-600 ml-2">mensual</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-6">
                    Para {plan.userLimit === 1 ? '1 usuario' : `${plan.userLimit} usuarios`}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg
                          className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Revisa tu plan
                    </Button>
                  ) : (
                    <Button variant="primary" className="w-full">
                      Obtener
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">
            Todos los planes incluyen actualización de planta, inserción de muebles en tu tour,
            personalización y analítica de datos.
          </p>
        </div>
      </div>
    </div>
  );
}
