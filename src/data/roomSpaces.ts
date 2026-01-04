// Lista de espacios 3D disponibles en public/models/rooms
export interface RoomSpace {
  id: string;
  name: string;
  path: string;
  thumbnail?: string;
}

// Esta lista será reemplazada por un escaneo dinámico de la carpeta
export const availableRooms: RoomSpace[] = [
  {
    id: 'room-scan1',
    name: 'Sala de estar',
    path: '/models/rooms/room-scan1.glb',
    thumbnail: '/models/rooms/Sala de estar.jpeg',
  },
  {
    id: '04-01-2026',
    name: 'Habitación',
    path: '/models/rooms/04-01-2026.glb',
    thumbnail: '/models/rooms/Habitación.jpeg',
  },
];

// Para desarrollo futuro: función para escanear carpeta dinámicamente
// Nota: En producción, esto requeriría un endpoint backend
export const getRoomsFromFolder = async (): Promise<RoomSpace[]> => {
  // TODO: Implementar escaneo de carpeta con backend
  // Por ahora, retornamos la lista estática
  return availableRooms;
};
