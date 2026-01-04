# Estructura de Carpetas para Modelos 3D

## 📁 Estructura

```
public/models/
├── rooms/              # Espacios escaneados con Polycam
│   ├── room-scan.glb
│   ├── room-scan1.glb
│   └── COLOCAR_ESPACIOS_AQUI.md
│
├── furniture/          # Muebles personalizados
│   └── COLOCAR_MUEBLES_AQUI.md
│
└── README.md          # Este archivo
```

## 🏠 Carpeta `rooms/`

Aquí van los espacios escaneados que aparecerán en el selector al iniciar el tour virtual.

**Características:**
- Archivos `.glb` de habitaciones/espacios completos
- Se cargan sin escalar (mantienen dimensiones reales)
- El sistema detecta automáticamente el nivel del suelo
- Cada archivo aparece como opción en el selector de espacios

**Ejemplo de uso:**
1. Escanea una habitación con Polycam
2. Exporta como `.glb`
3. Colócalo en `public/models/rooms/`
4. Actualiza `src/data/roomSpaces.ts`

## 🪑 Carpeta `furniture/`

Aquí van los muebles personalizados que aparecerán en la biblioteca del sidebar.

**Características:**
- Archivos `.glb` de muebles individuales
- Se escalan automáticamente a ~1 metro
- Pueden moverse, rotarse y escalarse con controles
- Aparecen en una sección separada "Muebles Personalizados"

**Ejemplo de uso:**
1. Descarga o escanea un mueble
2. Exporta como `.glb`
3. Colócalo en `public/models/furniture/`
4. Actualiza `src/data/customFurniture.ts`

## 🔧 Cómo Actualizar los Modelos

### Para agregar espacios:
1. Coloca archivo en `public/models/rooms/nombre.glb`
2. Edita `src/data/roomSpaces.ts`
3. Agrega entrada en el array `availableRooms`:
```typescript
{
  id: 'nombre',
  name: 'Nombre Descriptivo',
  path: '/models/rooms/nombre.glb',
}
```

### Para agregar muebles:
1. Coloca archivo en `public/models/furniture/mueble.glb`
2. Edita `src/data/customFurniture.ts`
3. Agrega entrada en el array `availableFurniture`:
```typescript
{
  id: 'mueble',
  name: 'Nombre del Mueble',
  path: '/models/furniture/mueble.glb',
  icon: '🛋️'
}
```

## 📝 Notas

- **Formato:** Solo `.glb` (GLTF Binary)
- **Texturas:** Incluidas en el archivo
- **Origen:** Para muebles, el origen debe estar en la base para mejor posicionamiento
- **Tamaño:** Los espacios mantienen escala real, los muebles se ajustan automáticamente

## 🚀 Desarrollo Futuro

En el futuro, se puede implementar un sistema de escaneo automático que lea la carpeta y genere la lista dinámicamente sin necesidad de editar archivos TypeScript.
