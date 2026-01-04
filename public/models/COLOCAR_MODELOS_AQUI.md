# 📦 Ejemplo de Estructura para tus Modelos GLB

Coloca tus archivos .glb directamente en esta carpeta.

## 📝 Lista de Archivos que Puedes Agregar

Según la configuración en `src/data/predefinedModels.ts`, puedes agregar:

1. **sofa-modern.glb** - Sofá moderno con texturas
2. **chair-classic.glb** - Silla clásica de madera
3. **bed-queen.glb** - Cama queen size
4. **table-coffee.glb** - Mesa de centro
5. **lamp-floor.glb** - Lámpara de pie

## 🎯 Cómo Activar un Modelo

Después de colocar el archivo aquí:

1. Ve a `src/data/predefinedModels.ts`
2. Encuentra el modelo correspondiente
3. Cambia `available: false` a `available: true`
4. El modelo aparecerá automáticamente en la pestaña "Modelos 3D" del sidebar

## 📥 Ejemplo de Uso

### Antes (modelo no disponible):
```typescript
{
  id: 'sofa-modern',
  name: 'Sofá Moderno',
  icon: '🛋️',
  path: '/models/sofa-modern.glb',
  category: 'living',
  available: false  // ❌ No se muestra
}
```

### Después (modelo disponible):
1. Colocas `sofa-modern.glb` en esta carpeta
2. Cambias a:
```typescript
{
  id: 'sofa-modern',
  name: 'Sofá Moderno',
  icon: '🛋️',
  path: '/models/sofa-modern.glb',
  category: 'living',
  available: true  // ✅ Se muestra en el catálogo
}
```

## 🔍 Verificación

Para verificar que tu modelo está correctamente colocado:

1. Abre el navegador en `http://localhost:3001`
2. Ve a una propiedad
3. Click en "Tour Virtual 3D"
4. En el sidebar, click en la pestaña "Modelos 3D (X)"
5. Deberías ver tu modelo listado

Si no aparece:
- ✅ Verifica que el archivo esté en esta carpeta
- ✅ Verifica que el nombre coincida exactamente con el path
- ✅ Verifica que `available: true` en predefinedModels.ts
- ✅ Recarga la página

## 🎨 Nomenclatura Recomendada

Usa nombres descriptivos y en minúsculas:
- ✅ `sofa-leather-brown.glb`
- ✅ `chair-wood-classic.glb`
- ✅ `table-glass-modern.glb`
- ❌ `Model1.glb`
- ❌ `untitled.glb`
- ❌ `sofá moderno.glb` (evita espacios y acentos)

---

**¡Coloca aquí tus archivos GLB y actualiza predefinedModels.ts!** 🚀
