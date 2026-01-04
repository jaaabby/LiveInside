// Lista de muebles personalizados en public/models/furniture
export interface CustomFurniture {
  id: string;
  name: string;
  path: string;
  icon?: string;
  catalog: string; // Catálogo/Retailer al que pertenece
}

export interface FurnitureCatalog {
  id: string;
  name: string;
  icon: string;
  logo: string; // Ruta al logo de la tienda
}

// Catálogos disponibles
export const furnitureCatalogs: FurnitureCatalog[] = [
  { id: 'ikea', name: 'IKEA', icon: '🔵', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/320px-Ikea_logo.svg.png' },
  { id: 'sodimac', name: 'Sodimac', icon: '🟠', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Logo_Sodimac.svg/320px-Logo_Sodimac.svg.png' },
  { id: 'casaideas', name: 'CasaIdeas', icon: '🟢', logo: 'https://www.casaideas.cl/img/Logo_Casa_Ideas.png' },
  { id: 'easy', name: 'Easy', icon: '🟣', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Easy_Logo.svg/320px-Easy_Logo.svg.png' }
];

// Esta lista será reemplazada por un escaneo dinámico de la carpeta
export const availableFurniture: CustomFurniture[] = [
  // Catálogo IKEA
  {
    id: 'sofa',
    name: 'Sofá',
    path: '/models/furniture/sofa.glb',
    icon: '🛋️',
    catalog: 'ikea'
  },
  {
    id: 'modular-sofa',
    name: 'Sofá Modular Escandinavo',
    path: '/models/furniture/uploads_files_6521001_Modular+Scandinavian+Sofa+Set+3D+Model.glb',
    icon: '🛋️',
    catalog: 'ikea'
  },
  {
    id: 'mesa',
    name: 'Mesa',
    path: '/models/furniture/mesa.glb',
    icon: '🪑',
    catalog: 'ikea'
  },
  {
    id: 'silla',
    name: 'Silla',
    path: '/models/furniture/silla.glb',
    icon: '💺',
    catalog: 'ikea'
  },
  
  // Catálogo Sodimac
  {
    id: 'cama',
    name: 'Cama',
    path: '/models/furniture/cama.glb',
    icon: '🛏️',
    catalog: 'sodimac'
  },
  {
    id: 'escritorio',
    name: 'Escritorio',
    path: '/models/furniture/escritorio.glb',
    icon: '🖥️',
    catalog: 'sodimac'
  },
  {
    id: 'estante-libros',
    name: 'Estante de Libros',
    path: '/models/furniture/estante_libros.glb',
    icon: '📚',
    catalog: 'sodimac'
  },
  {
    id: 'repisa',
    name: 'Repisa',
    path: '/models/furniture/repisa.glb',
    icon: '📦',
    catalog: 'sodimac'
  },
  
  // Catálogo CasaIdeas
  {
    id: 'wooden-armchair',
    name: 'Sillón de Madera',
    path: '/models/furniture/uploads_files_6515163_Wooden+Armchair+3D+Model.glb',
    icon: '🪑',
    catalog: 'casaideas'
  },
  {
    id: 'lampara',
    name: 'Lámpara',
    path: '/models/furniture/lampara.glb',
    icon: '💡',
    catalog: 'casaideas'
  },
  {
    id: 'alfombra',
    name: 'Alfombra',
    path: '/models/furniture/alfombra.glb',
    icon: '🧶',
    catalog: 'casaideas'
  },
  
  // Catálogo Easy
  {
    id: 'taburete',
    name: 'Taburete',
    path: '/models/furniture/taburete.glb',
    icon: '🪑',
    catalog: 'easy'
  },
  {
    id: 'planta',
    name: 'Planta',
    path: '/models/furniture/planta.glb',
    icon: '🪴',
    catalog: 'easy'
  },
  {
    id: 'bobesponja-peluche',
    name: 'Bob Esponja Peluche',
    path: '/models/furniture/bobesponja_peluche.glb',
    icon: '🧸',
    catalog: 'easy'
  }
];

// Helper para obtener muebles por catálogo
export const getFurnitureByCatalog = (catalogId: string): CustomFurniture[] => {
  return availableFurniture.filter(f => f.catalog === catalogId);
};

// Para desarrollo futuro: función para escanear carpeta dinámicamente
export const getFurnitureFromFolder = async (): Promise<CustomFurniture[]> => {
  // TODO: Implementar escaneo de carpeta con backend
  // Por ahora, retornamos la lista estática
  return availableFurniture;
};
