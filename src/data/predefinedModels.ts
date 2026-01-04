// Lista de modelos 3D disponibles en la carpeta public/models
export const predefinedModels = [
  {
    id: 'sofa-modern',
    name: 'Sofá Moderno',
    icon: '🛋️',
    path: '/models/sofa-modern.glb',
    category: 'living',
    available: false // Cambiar a true cuando el archivo esté disponible
  },
  {
    id: 'chair-classic',
    name: 'Silla Clásica',
    icon: '🪑',
    path: '/models/chair-classic.glb',
    category: 'living',
    available: false
  },
  {
    id: 'bed-queen',
    name: 'Cama Queen',
    icon: '🛏️',
    path: '/models/bed-queen.glb',
    category: 'bedroom',
    available: false
  },
  {
    id: 'table-coffee',
    name: 'Mesa de Centro',
    icon: '☕',
    path: '/models/table-coffee.glb',
    category: 'living',
    available: false
  },
  {
    id: 'lamp-floor',
    name: 'Lámpara de Pie',
    icon: '💡',
    path: '/models/lamp-floor.glb',
    category: 'lighting',
    available: false
  },
  // Agregar más modelos según los archivos que tengas
];

export type PredefinedModel = typeof predefinedModels[0];
