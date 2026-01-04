// Lista de muebles personalizados en public/models/furniture
export interface CustomFurniture {
  id: string;
  name: string;
  path: string;
  image: string; // Ruta a la imagen del mueble
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
  { id: 'ikea', name: 'IKEA', icon: '🔵', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg' },
  { id: 'sodimac', name: 'Sodimac', icon: '🟠', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Logotipo_Sodimac.svg' },
  { id: 'casaideas', name: 'CasaIdeas', icon: '🟢', logo: 'https://integridad-corporativa.s3.amazonaws.com:443/casaideas/public-read/o_1g4sg7nbk5tu1sre131vreq9trb.png' },
  { id: 'easy', name: 'Easy', icon: '🟣', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Easy-Logo.svg'}
];

// Esta lista será reemplazada por un escaneo dinámico de la carpeta
export const availableFurniture: CustomFurniture[] = [
  // Catálogo IKEA
  {
    id: 'ikea-aire-acondicionado',
    name: 'Aire Acondicionado',
    path: '/models/furniture/IKEA/aire_acondicionado.glb',
    image: '/models/furniture/IKEA/aire_acondicionado.jpeg',
    icon: '❄️',
    catalog: 'ikea'
  },
  {
    id: 'ikea-bed',
    name: 'Cama',
    path: '/models/furniture/IKEA/bed.glb',
    image: '/models/furniture/IKEA/bed.jpeg',
    icon: '🛏️',
    catalog: 'ikea'
  },
  {
    id: 'ikea-closet',
    name: 'Closet',
    path: '/models/furniture/IKEA/closet.glb',
    image: '/models/furniture/IKEA/closet.jpeg',
    icon: '🚪',
    catalog: 'ikea'
  },
  {
    id: 'ikea-lampara',
    name: 'Lámpara',
    path: '/models/furniture/IKEA/lampara.glb',
    image: '/models/furniture/IKEA/lampara.jpeg',
    icon: '💡',
    catalog: 'ikea'
  },
  {
    id: 'ikea-mesa-centro',
    name: 'Mesa de Centro',
    path: '/models/furniture/IKEA/mesa_centro.glb',
    image: '/models/furniture/IKEA/mesa_centro.jpeg',
    icon: '🪑',
    catalog: 'ikea'
  },
  
  // Catálogo Sodimac
  {
    id: 'sodimac-puff',
    name: 'Puff',
    path: '/models/furniture/SODIMAC/puff.glb',
    image: '/models/furniture/SODIMAC/puff.jpeg',
    icon: '🪑',
    catalog: 'sodimac'
  },
  {
    id: 'sodimac-scandinavian-sofa',
    name: 'Sofá Escandinavo',
    path: '/models/furniture/SODIMAC/scandinavian_sofa.glb',
    image: '/models/furniture/SODIMAC/scandinavian_sofa.jpeg',
    icon: '🛋️',
    catalog: 'sodimac'
  },
  {
    id: 'sodimac-table-chair',
    name: 'Mesa y Silla',
    path: '/models/furniture/SODIMAC/table_chair_01.glb',
    image: '/models/furniture/SODIMAC/table_chair_01.jpeg',
    icon: '🪑',
    catalog: 'sodimac'
  },
  {
    id: 'sodimac-table-lamp',
    name: 'Lámpara de Mesa Yves',
    path: '/models/furniture/SODIMAC/Table_lampYves.gltf',
    image: '/models/furniture/SODIMAC/Table_lampYves.jpeg',
    icon: '💡',
    catalog: 'sodimac'
  },
  
  // Catálogo CasaIdeas
  {
    id: 'casaideas-black-leather-chair',
    name: 'Silla de Cuero Negro',
    path: '/models/furniture/CASAIDEAS/black_leather_chair.gltf',
    image: '/models/furniture/CASAIDEAS/black_leather_chair.png',
    icon: '🪑',
    catalog: 'casaideas'
  },
  {
    id: 'casaideas-tv',
    name: 'TV',
    path: '/models/furniture/CASAIDEAS/Tv.glb',
    image: '/models/furniture/CASAIDEAS/Tv.jpeg',
    icon: '📺',
    catalog: 'casaideas'
  },
  {
    id: 'casaideas-wall-plant',
    name: 'Planta de Pared',
    path: '/models/furniture/CASAIDEAS/wall_plant.glb',
    image: '/models/furniture/CASAIDEAS/wall_plant.jpeg',
    icon: '🪴',
    catalog: 'casaideas'
  },
  {
    id: 'casaideas-wooden-armchair',
    name: 'Sillón de Madera',
    path: '/models/furniture/CASAIDEAS/wooden_armchair.glb',
    image: '/models/furniture/CASAIDEAS/wooden_armchair.jpeg',
    icon: '🪑',
    catalog: 'casaideas'
  },
  
  // Catálogo Easy
  {
    id: 'easy-chair',
    name: 'Silla',
    path: '/models/furniture/EASY/chair.glb',
    image: '/models/furniture/EASY/chair.jpeg',
    icon: '🪑',
    catalog: 'easy'
  },
  {
    id: 'easy-coffee-table',
    name: 'Mesa de Café',
    path: '/models/furniture/EASY/coffee_table.glb',
    image: '/models/furniture/EASY/coffee_table.jpeg',
    icon: '☕',
    catalog: 'easy'
  },
  {
    id: 'easy-dinen-set',
    name: 'Juego de Comedor Blanco',
    path: '/models/furniture/EASY/dinen_set_white.glb',
    image: '/models/furniture/EASY/dinen_set_white.jpeg',
    icon: '🍽️',
    catalog: 'easy'
  },
  {
    id: 'easy-furniture',
    name: 'Mueble',
    path: '/models/furniture/EASY/furniture.glb',
    image: '/models/furniture/EASY/furniture.jpeg',
    icon: '🪑',
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
