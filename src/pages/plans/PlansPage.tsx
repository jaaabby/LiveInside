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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center justify-between">
        <button onClick={() => window.history.back()} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <img
          src="/logo_blanco_horizontal.png"
          alt="LiveInside"
          className="h-8"
        />
        <div className="w-6" />
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar title="Planes" />
      </div>

      <div className="p-4 md:p-6 md:max-w-6xl md:mx-auto pb-24 md:pb-6">
        <div className="space-y-4 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan.toLowerCase() === plan.name.toLowerCase().replace('plan ', '');
            
            return (
              <Card key={plan.id} className={`overflow-hidden border-2 ${isCurrentPlan ? 'border-primary-400' : 'border-gray-200'}`}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(plan.price, plan.currency)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">mensual</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    Para {plan.userLimit === 1 ? '1 usuario' : `${plan.userLimit} usuarios`}
                  </p>

                  <ul className="space-y-2 mb-4">
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

                  {isCurrentPlan && (
                    <div className="mb-3">
                      <span className="inline-block w-full text-center px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg">
                        Tu plan actual
                      </span>
                    </div>
                  )}

                  <Button 
                    variant={isCurrentPlan ? "outline" : "primary"} 
                    className={`w-full ${isCurrentPlan ? 'bg-primary-100 text-primary-700 border-0' : 'bg-primary-600'}`}
                  >
                    {isCurrentPlan ? 'Revisa tu plan' : 'Obtener'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
