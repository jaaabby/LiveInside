# 🎨 Guía para Cargar Modelos GLB en LiveInside

## ✅ Funcionalidad Implementada

Se ha agregado la capacidad completa de cargar modelos 3D en formato GLB/GLTF en el Tour Virtual.

## 📂 Carpeta de Modelos

Se creó la carpeta `public/models/` donde puedes colocar tus archivos GLB:

```
LiveInside/
└── public/
    └── models/
        ├── README.md
        ├── sofa-modern.glb (coloca aquí tus archivos)
        ├── chair-classic.glb
        └── ... (más modelos)
```

## 🎯 Tres Formas de Cargar Modelos

### 1. 📤 Cargar desde el Navegador (Usuario Final)

**Ubicación**: Sidebar → Sección "Muebles Personalizados"

**Pasos**:
1. Abre el Tour Virtual de una propiedad
2. En el sidebar, ve a la sección "Muebles Personalizados"
3. Click en "📂 Cargar Mueble GLB"
4. Selecciona un archivo `.glb` o `.gltf` desde tu computadora
5. El modelo se cargará automáticamente en el centro de la escena
6. ¡Listo! Puedes moverlo, rotarlo y escalarlo

**Formatos soportados**: 
- ✅ `.glb` (recomendado)
- ✅ `.gltf`

### 2. 🗂️ Modelos Predefinidos (Catálogo)

**Ubicación**: Sidebar → Pestaña "Modelos 3D"

**Configuración**:
1. Coloca tus archivos GLB en `public/models/`
2. Edita el archivo `src/data/predefinedModels.ts`
3. Agrega tu modelo a la lista:

```typescript
{
  id: 'sofa-modern',
  name: 'Sofá Moderno',
  icon: '🛋️',
  path: '/models/sofa-modern.glb',
  category: 'living',
  available: true  // ⚠️ Cambiar a true
}
```

4. Los usuarios verán el modelo en la pestaña "Modelos 3D (X)"
5. Click en el modelo para cargarlo automáticamente

### 3. 🔧 Arrastrar desde Muebles Básicos

Los muebles geométricos básicos (ya implementado):
- Arrástralos desde el catálogo
- Suéltalos en la escena
- Son figuras geométricas simples

## 🎨 Especificaciones Técnicas de los Modelos

### Formatos
- **GLB** (Binary glTF) - Recomendado ✅
  - Todo en un archivo
  - Incluye texturas
  - Más rápido de cargar
- **GLTF** (Text glTF)
  - Archivo JSON + assets externos
  - Útil para debug

### Tamaño Recomendado
- 📦 **Máximo**: 10MB por archivo
- 🎯 **Ideal**: 2-5MB
- ⚡ **Óptimo**: 500KB - 2MB

### Escala
- 1 unidad = 1 metro en Three.js
- El sistema auto-escala los modelos al cargar
- Escala máxima recomendada del objeto: 2m x 2m x 2m

### Polígonos
- 🟢 Bajo: 1K - 10K triángulos
- 🟡 Medio: 10K - 50K triángulos  
- 🔴 Alto: 50K+ triángulos (puede causar lag)

## 🛠️ Herramientas para Crear/Optimizar GLB

### Escaneo 3D
- **Polycam** (Móvil) - Escaneo con iPhone/Android
- **3D Scanner App** - Escaneo con LiDAR

### Modelado 3D
- **Blender** (Gratis) - Modelado profesional
- **SketchUp** - Modelado arquitectónico
- **Fusion 360** - Modelado CAD

### Optimización
```bash
# Instalar gltf-pipeline
npm install -g gltf-pipeline

# Optimizar GLB con Draco compression
gltf-pipeline -i input.glb -o output.glb -d

# Opciones adicionales
gltf-pipeline -i input.glb -o output.glb \
  --draco.compressionLevel 10 \
  --draco.quantizePositionBits 14 \
  --draco.quantizeNormalBits 10 \
  --draco.quantizeTexcoordBits 12
```

### Descarga de Modelos
- **Sketchfab** - Miles de modelos gratis
- **TurboSquid** - Modelos profesionales
- **CGTrader** - Marketplace de modelos
- **Free3D** - Modelos gratis

## 📝 Flujo de Trabajo Recomendado

### Para Usuarios Finales
1. Escanea tu mueble con Polycam
2. Exporta como GLB
3. Abre Tour Virtual en LiveInside
4. Click en "Cargar Mueble GLB"
5. Selecciona tu archivo
6. Coloca, mueve y ajusta

### Para Desarrolladores/Administradores
1. Recopila modelos GLB de calidad
2. Optimiza con gltf-pipeline
3. Coloca en `public/models/`
4. Actualiza `predefinedModels.ts`
5. Los usuarios los verán automáticamente

## 🎮 Controles con Modelos Cargados

Una vez que un modelo GLB está en la escena:

- **Click**: Seleccionar (se ilumina en verde)
- **Arrastrar**: Mover por el espacio
- **Q/E**: Rotar
- **+/-**: Escalar
- **Delete**: Eliminar
- **Escape**: Deseleccionar

## 📐 Ejemplo de Modelo GLB Válido

### Estructura de archivos
```
sofa-modern.glb
└── Contiene:
    ├── Geometría (mesh)
    ├── Materiales
    ├── Texturas (embedidas)
    └── Metadatos
```

### Propiedades ideales
- **Tamaño de archivo**: 2.5 MB
- **Triángulos**: 15,000
- **Texturas**: 2048x2048 (comprimidas)
- **Materiales**: PBR (Metallic-Roughness)
- **Escala**: 1.8m x 0.8m x 0.9m (sofá real)

## 🐛 Solución de Problemas

### ❌ "Error al cargar el archivo"
- **Causa**: Archivo corrupto o formato incorrecto
- **Solución**: Verifica que sea .glb o .gltf válido

### ❌ El modelo se ve muy pequeño/grande
- **Causa**: Escala incorrecta
- **Solución**: El sistema auto-escala, pero puedes usar +/- para ajustar

### ❌ El modelo se carga muy lento
- **Causa**: Archivo muy pesado
- **Solución**: Optimiza con gltf-pipeline

### ❌ Texturas no se ven
- **Causa**: Texturas no embedidas en GLB
- **Solución**: Usa GLB en lugar de GLTF, o embede las texturas

### ❌ El modelo aparece negro
- **Causa**: Sin normales o materiales incorrectos
- **Solución**: Recalcula normales en Blender antes de exportar

## 💡 Tips y Mejores Prácticas

1. **Usa GLB sobre GLTF**: Todo en un archivo, más fácil de manejar
2. **Optimiza antes de subir**: Reduce polígonos y comprime texturas
3. **Nombra descriptivamente**: `sofa-leather-brown.glb` > `model1.glb`
4. **Prueba primero**: Carga el modelo localmente antes de agregarlo al catálogo
5. **Escala real**: Usa dimensiones reales para mejores resultados
6. **Materiales PBR**: Usa Metallic-Roughness workflow para mejor realismo

## 📊 Códigos en el Sistema

### Archivo ThreeScene.tsx
- `loadCustomFurniture(file)` - Carga desde archivo seleccionado
- `loadFurnitureFromUrl(url, name)` - Carga desde URL/path
- Auto-centrado y escalado automático
- Configuración de materiales optimizada

### Archivo predefinedModels.ts
```typescript
export const predefinedModels = [
  {
    id: 'sofa-modern',           // ID único
    name: 'Sofá Moderno',        // Nombre visible
    icon: '🛋️',                  // Emoji
    path: '/models/sofa-modern.glb', // Path en public
    category: 'living',          // Categoría
    available: true              // ⚠️ true = visible
  }
];
```

## 🚀 Próximos Pasos

1. ✅ Carga de archivos GLB - **IMPLEMENTADO**
2. ✅ Catálogo de modelos predefinidos - **IMPLEMENTADO**
3. 🔄 Agregar tus propios modelos GLB en `public/models/`
4. 🔄 Actualizar `predefinedModels.ts` con tus modelos
5. 📱 (Futuro) Integración directa con Polycam API
6. 💾 (Futuro) Guardar configuraciones de escena

---

## ✨ ¡Todo Listo!

Ahora puedes:
- ✅ Cargar cualquier archivo GLB desde el navegador
- ✅ Tener un catálogo de modelos predefinidos
- ✅ Mover, rotar y escalar modelos 3D reales
- ✅ Combinar modelos básicos y realistas

**¡Disfruta creando espacios virtuales con muebles reales!** 🏠✨
