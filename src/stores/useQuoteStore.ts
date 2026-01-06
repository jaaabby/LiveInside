import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Quote } from '@/types';

interface QuoteState {
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, 'id' | 'date'>) => Quote;
  getQuotes: () => Quote[];
  getQuoteById: (id: string) => Quote | undefined;
  deleteQuote: (id: string) => void;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      quotes: [],
      
      addQuote: (quoteData) => {
        const newQuote: Quote = {
          ...quoteData,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        };
        
        set((state) => ({
          quotes: [newQuote, ...state.quotes],
        }));
        
        return newQuote;
      },
      
      getQuotes: () => {
        return get().quotes;
      },
      
      getQuoteById: (id) => {
        return get().quotes.find((q) => q.id === id);
      },
      
      deleteQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
        }));
      },
    }),
    {
      name: 'quote-storage',
    }
  )
);
