// Lista de muebles personalizados en public/models/furniture
export interface CustomFurniture {
  id: string;
  name: string;
  path: string;
  icon?: string;
}

// Esta lista será reemplazada por un escaneo dinámico de la carpeta
export const availableFurniture: CustomFurniture[] = [
  {
    id: 'sofa',
    name: 'Sofá',
    path: '/models/furniture/sofa.glb',
    icon: '🛋️'
  },
  {
    id: 'cama',
    name: 'Cama',
    path: '/models/furniture/cama.glb',
    icon: '🛏️'
  },
  {
    id: 'mesa',
    name: 'Mesa',
    path: '/models/furniture/mesa.glb',
    icon: '🪑'
  },
  {
    id: 'silla',
    name: 'Silla',
    path: '/models/furniture/silla.glb',
    icon: '💺'
  },
  {
    id: 'escritorio',
    name: 'Escritorio',
    path: '/models/furniture/escritorio.glb',
    icon: '🖥️'
  },
  {
    id: 'estante-libros',
    name: 'Estante de Libros',
    path: '/models/furniture/estante_libros.glb',
    icon: '📚'
  },
  {
    id: 'lampara',
    name: 'Lámpara',
    path: '/models/furniture/lampara.glb',
    icon: '💡'
  },
  {
    id: 'lampara-stormtrooper',
    name: 'Lámpara Stormtrooper',
    path: '/models/furniture/lampara_stormtrooper.glb',
    icon: '⚡'
  },
  {
    id: 'planta',
    name: 'Planta',
    path: '/models/furniture/planta.glb',
    icon: '🪴'
  },
  {
    id: 'alfombra',
    name: 'Alfombra',
    path: '/models/furniture/alfombra.glb',
    icon: '🧶'
  },
  {
    id: 'repisa',
    name: 'Repisa',
    path: '/models/furniture/repisa.glb',
    icon: '📦'
  },
  {
    id: 'taburete',
    name: 'Taburete',
    path: '/models/furniture/taburete.glb',
    icon: '🪑'
  },
  {
    id: 'velador',
    name: 'Velador',
    path: '/models/furniture/velador.glb',
    icon: '🕯️'
  },
  {
    id: 'bobesponja-peluche',
    name: 'Bob Esponja Peluche',
    path: '/models/furniture/bobesponja_peluche.glb',
    icon: '🧸'
  }
];

// Para desarrollo futuro: función para escanear carpeta dinámicamente
export const getFurnitureFromFolder = async (): Promise<CustomFurniture[]> => {
  // TODO: Implementar escaneo de carpeta con backend
  // Por ahora, retornamos la lista estática
  return availableFurniture;
};
