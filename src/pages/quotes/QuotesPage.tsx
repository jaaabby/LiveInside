import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Card } from '@/components/ui/Card';
import { LoadingPage } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/services/api';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { generateQuotePDF } from '@/utils/pdfGenerator';
import type { Quote } from '@/types';

export function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const data = await api.quotes.getAll();
      setQuotes(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async (quote: Quote) => {
    await generateQuotePDF(quote);
  };

  if (isLoading) return <LoadingPage />;

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  const statusLabels = {
    draft: 'Borrador',
    sent: 'Enviada',
    completed: 'Completada',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-primary-600 px-4 py-4 flex items-center gap-3">
        <img
          src="/src/assets/images/logo_blanco_horizontal.png"
          alt="LiveInside"
          className="h-8"
        />
        <h1 className="text-white text-lg font-semibold">Cotizaciones</h1>
      </header>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <TopBar title="Cotizaciones" />
      </div>

      <div className="p-4 md:p-6 md:max-w-4xl md:mx-auto pb-24 md:pb-6">{quotes.length === 0 ? (
          <EmptyState
            icon={
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="No tienes cotizaciones"
            description="Las cotizaciones que generes aparecerán aquí"
          />
        ) : (
          <>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">COTIZACIONES</h2>
              <p className="text-sm text-primary-600">{quotes.length} en total</p>
            </div>

            <div className="space-y-3">
              {quotes.map((quote) => (
                <Card key={quote.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-600 text-sm mb-1">
                        Cotización {quote.id.padStart(3, '0')} / {quote.catalogName}
                      </h3>
                      <p className="text-xs text-gray-500">Fecha {formatDate(quote.date)}</p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button 
                        onClick={() => handleDownloadPDF(quote)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Descargar PDF"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                          <path d="M8 10h8v2H8zm0 4h8v2H8z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
