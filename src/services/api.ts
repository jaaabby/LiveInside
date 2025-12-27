import type { Property, Product, Quote } from '@/types';
import { mockProperties, mockProducts, mockQuotes, mockCatalogs, mockAnalytics, mockPlans } from '@/mocks/data';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  properties: {
    getAll: async (): Promise<Property[]> => {
      await delay(500);
      return mockProperties;
    },
    getById: async (id: string): Promise<Property | undefined> => {
      await delay(300);
      return mockProperties.find((p) => p.id === id);
    },
    create: async (property: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
      await delay(800);
      return {
        ...property,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
    },
    update: async (id: string, updates: Partial<Property>): Promise<Property> => {
      await delay(500);
      const property = mockProperties.find((p) => p.id === id);
      if (!property) throw new Error('Property not found');
      return { ...property, ...updates };
    },
    delete: async (id: string): Promise<void> => {
      await delay(500);
    },
  },

  catalogs: {
    getAll: async () => {
      await delay(300);
      return mockCatalogs;
    },
    getById: async (id: string) => {
      await delay(300);
      return mockCatalogs.find((c) => c.id === id);
    },
  },

  products: {
    getByCatalog: async (catalogId: string): Promise<Product[]> => {
      await delay(500);
      return mockProducts.filter((p) => p.catalogId === catalogId);
    },
    search: async (query: string, catalogId?: string): Promise<Product[]> => {
      await delay(400);
      let results = mockProducts;
      if (catalogId) {
        results = results.filter((p) => p.catalogId === catalogId);
      }
      if (query) {
        results = results.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      return results;
    },
  },

  quotes: {
    getAll: async (): Promise<Quote[]> => {
      await delay(500);
      return mockQuotes;
    },
    create: async (quote: Omit<Quote, 'id' | 'date'>): Promise<Quote> => {
      await delay(800);
      return {
        ...quote,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      };
    },
    sendByEmail: async (quoteId: string, email: string): Promise<void> => {
      await delay(1000);
      console.log(`Quote ${quoteId} sent to ${email}`);
    },
  },

  analytics: {
    getDashboard: async () => {
      await delay(600);
      return mockAnalytics;
    },
  },

  plans: {
    getAll: async () => {
      await delay(300);
      return mockPlans;
    },
  },
};
