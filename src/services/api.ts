import type { Property, Product, Quote } from '@/types';
import { mockProperties, mockProducts, mockQuotes, mockCatalogs, mockAnalytics, mockPlans } from '@/mocks/data';
import { availableRooms } from '@/data/roomSpaces';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Crear propiedades desde espacios disponibles con información completa
const createPropertiesFromSpaces = (): Property[] => {
  const getSpaceDescription = (spaceName: string): string => {
    const descriptions: Record<string, string> = {
      'Living Room': 'Amplio living comedor con excelente iluminación natural. Espacio ideal para reuniones familiares y momentos de relajación. Cuenta con grandes ventanales y una distribución que permite múltiples configuraciones de mobiliario.',
      'Kitchen': 'Cocina moderna y funcional equipada con espacios de almacenamiento optimizados. Diseñada para maximizar la eficiencia en la preparación de alimentos, con amplias superficies de trabajo y excelente ventilación natural.',
      'Bedroom': 'Dormitorio espacioso y acogedor con closet incorporado. Ambiente tranquilo y privado, ideal para el descanso. Cuenta con buena circulación de aire y espacio suficiente para una cama king size y muebles adicionales.',
      'Office': 'Home office perfectamente diseñado para el trabajo remoto. Espacio silencioso y bien iluminado que fomenta la productividad. Incluye conexiones eléctricas estratégicamente ubicadas y espacio para escritorio amplio.',
      'Bathroom': 'Baño completo con acabados modernos y distribución eficiente. Equipado con ducha, lavamanos y sanitario de línea contemporánea. Excelente ventilación y espacios de almacenamiento.',
      'Dining Room': 'Comedor elegante con espacio para mesa grande y sillas. Perfecto para cenas familiares y reuniones sociales. Bien conectado con la cocina y el living, facilitando la circulación durante eventos.'
    };
    return descriptions[spaceName] || 'Espacio versátil y bien distribuido, ideal para personalizar según tus necesidades. Cuenta con buena iluminación y amplias posibilidades de decoración.';
  };

  const getSpaceAreas = (spaceName: string): string[] => {
    const areas: Record<string, string[]> = {
      'Living Room': ['Zona de estar', 'Área de TV', 'Espacio de lectura', 'Rincón social'],
      'Kitchen': ['Área de cocción', 'Zona de preparación', 'Espacio de almacenaje', 'Barra desayunador'],
      'Bedroom': ['Zona de descanso', 'Área de closet', 'Rincón de lectura', 'Espacio para tocador'],
      'Office': ['Zona de trabajo', 'Área de almacenamiento', 'Espacio para reuniones', 'Rincón de lectura'],
      'Bathroom': ['Zona de ducha', 'Área de lavamanos', 'Espacio de almacenaje'],
      'Dining Room': ['Área de comedor', 'Zona de aparador', 'Espacio de circulación']
    };
    return areas[spaceName] || ['Área principal', 'Zona flexible', 'Espacio multifuncional'];
  };

  return availableRooms.map((room, index) => ({
    id: room.id,
    name: room.name,
    address: `Espacio ${index + 1} - Demo`,
    city: 'Santiago',
    region: 'Metropolitana',
    country: 'Chile',
    images: [room.thumbnail || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    status: 'active' as const,
    visits: Math.floor(Math.random() * 200) + 50,
    createdAt: new Date().toISOString(),
    roomModelPath: room.path,
    roomModelId: room.id,
    bedrooms: Math.floor(Math.random() * 3) + 2,
    bathrooms: Math.floor(Math.random() * 2) + 1,
    area: Math.floor(Math.random() * 50) + 60,
    description: getSpaceDescription(room.name),
    spaces: getSpaceAreas(room.name)
  }));
};

export const api = {
  properties: {
    getAll: async (): Promise<Property[]> => {
      await delay(500);
      return createPropertiesFromSpaces();
    },
    getById: async (id: string): Promise<Property | undefined> => {
      await delay(300);
      const properties = createPropertiesFromSpaces();
      return properties.find((p) => p.id === id);
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
