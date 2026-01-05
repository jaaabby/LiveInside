export interface User {
  id: string;
  email: string;
  name: string;
  type: 'broker' | 'buyer';
  companyName?: string;
  companyRut?: string;
  companyCode?: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  plan?: 'starter' | 'pro' | 'business';
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
  internalId?: string;
  internalNotes?: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  status: 'active' | 'inactive' | 'rented';
  visits?: number;
  createdAt: string;
  roomModelPath?: string; // Ruta al modelo 3D del espacio
  roomModelId?: string; // ID del espacio 3D
  description?: string; // Descripción de la propiedad
  spaces?: string[]; // Lista de espacios disponibles
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  catalogId: string;
  images: string[];
  category: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  colors?: string[];
}

export interface Catalog {
  id: string;
  name: string;
  logo: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Quote {
  id: string;
  catalogName: string;
  date: string;
  items: CartItem[];
  total: number;
  currency: string;
  propertyId?: string;
  status: 'draft' | 'sent' | 'completed';
}

export interface AnalyticsData {
  totalVisits: number;
  visitsChange: number;
  topProduct?: {
    name: string;
    sku: string;
    image: string;
    views: number;
  };
  topColors?: Array<{ color: string; count: number }>;
  totalQuotes?: number;
  recentProperties?: Array<{
    id: string;
    name: string;
    visits: number;
    status: 'active' | 'inactive' | 'rented';
    image?: string;
    spaces?: string[];
    bedrooms?: number;
    bathrooms?: number;
  }>;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  userLimit: number;
  spacesLimit: number;
}

export interface ViewerMessage {
  type: 'loadProperty' | 'setNode' | 'spawnFurniture' | 'objectPlaced' | 'nodeChanged';
  payload?: {
    propertyId?: string;
    nodeId?: string;
    sku?: string;
    position?: { x: number; y: number; z: number };
  };
}
