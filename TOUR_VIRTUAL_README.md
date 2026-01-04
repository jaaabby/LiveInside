# Tour Virtual 3D - LiveInside

## 🎉 Nueva Funcionalidad Implementada

Se ha agregado una funcionalidad de **Tour Virtual 3D** a la aplicación LiveInside que permite visualizar propiedades en 3D y colocar muebles virtuales de manera interactiva.

## 📁 Archivos Creados

### Componentes
- `src/pages/properties/VirtualTourPage.tsx` - Página principal del tour virtual
- `src/components/three/ThreeScene.tsx` - Componente de renderizado 3D con Three.js
- `src/components/three/FurnitureSidebar.tsx` - Barra lateral con catálogo de muebles

### Rutas
- `/properties/:id/virtual-tour` - Ruta para acceder al tour virtual

## 🎨 Características

### Visualización 3D
- ✅ Habitación renderizada en 3D con Three.js
- ✅ Iluminación profesional multi-punto
- ✅ Cámara interactiva con controles de ratón
- ✅ Rotación orbital alrededor de la habitación
- ✅ Zoom con rueda del ratón

### Catálogo de Muebles
18 tipos de muebles disponibles:
- 🛋️ Sofá, Sillón
- 🪑 Mesa, Silla, Banco, Taburete
- 🛏️ Cama
- 💡 Lámpara
- 🪴 Planta
- 📚 Estantería
- 📺 TV
- 🖥️ Escritorio
- 🗄️ Cómoda, Gabinete
- 📦 Mesa de Noche
- ☕ Mesa de Centro
- 🧶 Alfombra
- 🪞 Espejo

### Controles Interactivos

#### Con el Ratón:
- **Click izquierdo + arrastrar**: Rotar la vista de la cámara
- **Rueda del ratón**: Hacer zoom in/out
- **Click en mueble**: Seleccionar mueble
- **Arrastrar mueble desde catálogo**: Colocar en la escena

#### Con el Teclado (cuando un mueble está seleccionado):
- **Q**: Rotar mueble hacia la izquierda
- **E**: Rotar mueble hacia la derecha
- **+**: Aumentar tamaño del mueble
- **-**: Reducir tamaño del mueble
- **Delete/Backspace**: Eliminar mueble
- **Escape**: Deseleccionar mueble

### Interfaz de Usuario

#### Header
- Logo LiveInside con gradiente
- Título "Tour Virtual" centrado
- Badge indicando "Habitación capturada con Polycam"
- Botón "Volver" para regresar a detalles de propiedad

#### Sidebar (Izquierda)
- **Catálogo de Muebles**: Grid 2x9 con muebles arrastrables
- **Estadísticas**: Contador de muebles colocados
- **Controles**: 
  - Restablecer Vista
  - Modo Wireframe
  - Limpiar Muebles
- **Calidad Visual**: Indicadores de configuración
- **Muebles Personalizados**: Opción para cargar archivos GLB
- **Tips e Instrucciones**: Guías de uso

#### Visor 3D (Centro)
- Vista 3D completa de la habitación
- Badge "Vista 3D Activa" en esquina superior izquierda
- Instrucciones flotantes en la parte inferior

## 🎮 Cómo Usar

1. **Acceder al Tour Virtual**
   - Ve a la página de detalles de una propiedad
   - Haz click en el botón "Tour Virtual 3D"

2. **Colocar Muebles**
   - Arrastra un mueble desde el catálogo lateral
   - Suéltalo en la ubicación deseada de la habitación
   - El mueble se colocará donde sueltes el cursor

3. **Seleccionar y Mover Muebles**
   - Haz click en un mueble para seleccionarlo (se ilumina en verde)
   - Arrastra el mueble para moverlo
   - Usa las teclas Q/E para rotarlo
   - Usa +/- para cambiar su tamaño

4. **Controlar la Cámara**
   - Click izquierdo + arrastrar para rotar
   - Rueda del ratón para zoom
   - Botón "Restablecer Vista" para volver a la vista inicial

## 🎨 Diseño

El diseño sigue la paleta de colores de LiveInside:
- **Primary**: `#4C6FFF` (Azul)
- **Secondary**: `#00D4AA` (Verde aqua)
- **Accent**: `#FF4C6F` (Rosa)
- **Background Dark**: `#0A0E27`
- **Card Background**: `#151B3D`
- **Border**: `#2D3561`

## 🔧 Tecnologías Utilizadas

- **Three.js**: Renderizado 3D
- **React**: Framework de UI
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **Lucide React**: Iconos

## 📦 Dependencias Instaladas

```bash
npm install three @types/three lucide-react
```

## 🚀 Próximas Mejoras Sugeridas

1. **Carga de Modelos 3D Reales**
   - Implementar carga de archivos GLB/GLTF de habitaciones escaneadas
   - Integración con Polycam API

2. **Catálogo de Muebles Expandido**
   - Cargar modelos 3D reales de muebles desde archivos
   - Texturas y materiales más realistas

3. **Guardado de Configuraciones**
   - Guardar disposición de muebles
   - Compartir configuraciones

4. **Realidad Aumentada**
   - Vista AR en dispositivos móviles
   - Integración con WebXR

5. **Más Controles**
   - Cambio de materiales/colores de muebles
   - Mediciones de distancia
   - Vista desde primera persona

## 📝 Notas Técnicas

- La escena por defecto muestra una habitación placeholder (plano de suelo y paredes)
- Los muebles son geometrías básicas de Three.js
- La iluminación incluye: luz ambiental, luz direccional principal, luz de relleno y luz de contorno
- El renderizado está optimizado con `setPixelRatio(Math.min(window.devicePixelRatio, 2))`
- Las sombras están desactivadas para mejor rendimiento

## 🐛 Resolución de Problemas

Si encuentras errores:
1. Asegúrate de que todas las dependencias estén instaladas
2. Verifica que el servidor esté corriendo
3. Limpia la caché del navegador
4. Verifica la consola del navegador para errores específicos

## 📞 Soporte

Para cualquier duda o problema, contacta al equipo de desarrollo.

---

**¡Disfruta del Tour Virtual 3D!** 🏠✨
