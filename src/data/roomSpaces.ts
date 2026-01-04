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
    id: 'room-scan',
    name: 'Espacio 1',
    path: '/models/rooms/room-scan.glb',
  },
  {
    id: 'room-scan1',
    name: 'Espacio 2',
    path: '/models/rooms/room-scan1.glb',
  },
];

// Para desarrollo futuro: función para escanear carpeta dinámicamente
// Nota: En producción, esto requeriría un endpoint backend
export const getRoomsFromFolder = async (): Promise<RoomSpace[]> => {
  // TODO: Implementar escaneo de carpeta con backend
  // Por ahora, retornamos la lista estática
  return availableRooms;
};
