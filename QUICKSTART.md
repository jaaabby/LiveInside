# 🚀 Guía de Inicio Rápido - LiveInside

## ⚡ Comandos Esenciales

```powershell
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Iniciar aplicación en modo desarrollo
npm run dev

# 3. Abrir navegador en http://localhost:3000
```

## 🎯 Flujo de Prueba Recomendado

### 1️⃣ Autenticación (2 min)
1. Abrir http://localhost:3000
2. Seleccionar "Corredor de propiedades"
3. Click en "Regístrate"
4. Llenar formulario (tab "Independiente" o "Empresa")
5. Click "Siguiente"
✅ Deberías ver el listado de propiedades

### 2️⃣ Crear Propiedad (1 min)
1. Click en card "+ AGREGAR UNA PROPIEDAD"
2. Llenar campos:
   - Dirección: "Av. Libertador 123"
   - Ciudad: "Santiago"
   - Región: "Metropolitana"
   - País: "Chile"
   - Nombre: "Casa Test"
3. Click "Guardar"
✅ Deberías ver tu nueva propiedad en el listado

### 3️⃣ Explorar Propiedad y Visor AR (2 min)
1. Click en cualquier card de propiedad
2. Ver detalles (dormitorios, baños, área)
3. Click botón de cámara (centro inferior)
✅ Deberías ver el placeholder del visor 3D/AR

4. Click "Catálogos" para explorar muebles
5. Click "X" para cerrar visor

### 4️⃣ Navegar Catálogos (2 min)
1. Desde el menú inferior, click "Cotizaciones" (ícono documento)
   O desde la página de propiedad, click "Catálogos"
2. Click en cualquier catálogo (ej: IKEA)
3. Ver productos con precios
✅ Deberías ver grid de productos

### 5️⃣ Agregar al Carrito (2 min)
1. Click en botón "+" de cualquier producto
2. Repetir con 3-4 productos
3. Ver indicador de carrito (número rojo en TopBar)
4. Click en ícono de carrito
✅ Deberías ver tus productos con cantidades

### 6️⃣ Generar Cotización (1 min)
1. En el carrito, ajustar cantidades con +/-
2. Ver subtotal actualizado
3. Click "Generar cotización"
✅ Deberías ser redirigido a Cotizaciones

### 7️⃣ Ver Analíticas (1 min)
1. Desde navegación inferior, click "Analíticas"
2. Ver dashboard con:
   - Total de visitas
   - Mueble más seleccionado
   - Colores populares
   - Propiedades recientes
✅ Deberías ver métricas y gráficos

### 8️⃣ Explorar Configuración (1 min)
1. Click "Configuración" (ícono engranaje)
2. Explorar menú de opciones
3. Click "Cuenta" → Ver perfil
4. Click "Mejora tu plan" → Ver planes
✅ Deberías ver tu plan actual marcado

### 9️⃣ Responsive Desktop (1 min)
1. Redimensionar ventana o abrir DevTools (F12)
2. Ver cambio a layout desktop:
   - Sidebar izquierdo aparece
   - Bottom nav desaparece
   - Cards en grid más amplio
✅ La UI debería adaptarse automáticamente

### 🔟 Cerrar Sesión
1. Ir a Configuración
2. Scroll abajo
3. Click "Cerrar Sesión"
✅ Deberías volver al login

---

## 📱 Testing en Móvil Real

### Opción 1: Túnel Local (Recomendado)
```powershell
# En otra terminal (mientras npm run dev está corriendo)
npx localtunnel --port 3000
# Copiar la URL generada y abrirla en tu móvil
```

### Opción 2: IP Local
```powershell
# 1. Obtener tu IP local
ipconfig
# Buscar "Dirección IPv4" (ej: 192.168.1.X)

# 2. Modificar vite.config.ts temporalmente:
# server: {
#   host: '0.0.0.0',
#   port: 3000,
# }

# 3. Abrir en móvil: http://192.168.1.X:3000
```

---

## 🐛 Problemas Comunes

### ❌ Error: "Cannot find module '@/...'"
**Solución:**
```powershell
# Reinstalar dependencias
rm -rf node_modules
rm package-lock.json
npm install
```

### ❌ Puerto 3000 ocupado
**Solución:**
```powershell
# Cambiar puerto en vite.config.ts
server: {
  port: 3001,
}
```

### ❌ Estilos Tailwind no cargan
**Solución:**
```powershell
# Verificar que PostCSS y Tailwind estén instalados
npm install -D tailwindcss postcss autoprefixer

# Reiniciar dev server
Ctrl+C
npm run dev
```

### ❌ TypeScript errores
**Solución:**
```powershell
# Verificar versión de TypeScript
npm list typescript

# Reinstalar dependencias de desarrollo
npm install -D typescript @types/react @types/react-dom
```

---

## 🔥 Scripts Útiles

```powershell
# Desarrollo
npm run dev              # Inicia servidor (http://localhost:3000)

# Build
npm run build           # Compila para producción
npm run preview         # Preview del build

# Limpieza
npm run lint            # Ejecuta linter
rm -rf dist             # Limpia carpeta de build
rm -rf node_modules     # Limpia dependencias (para reinstalar)

# Instalación limpia
npm ci                  # Instala exactas versiones (más rápido)
```

---

## 📊 Checklist de Funcionalidades

- [ ] Onboarding y selección de usuario
- [ ] Login y registro con validación
- [ ] Persistencia de sesión (refresh mantiene login)
- [ ] Crear nueva propiedad
- [ ] Listar propiedades con cards
- [ ] Ver detalle de propiedad
- [ ] Placeholder visor AR/3D
- [ ] Navegar catálogos (grid responsive)
- [ ] Ver productos por catálogo
- [ ] Agregar productos al carrito
- [ ] Modificar cantidades en carrito
- [ ] Generar cotización
- [ ] Ver lista de cotizaciones
- [ ] Dashboard con métricas
- [ ] Ver y editar perfil
- [ ] Ver planes disponibles
- [ ] Navegación bottom (móvil)
- [ ] Navegación sidebar (desktop)
- [ ] Responsive completo (320px → 1920px)
- [ ] Estados de loading
- [ ] Estados vacíos (empty states)
- [ ] Validación de formularios
- [ ] Cerrar sesión

---

## 🎨 Acceso Rápido por Rol

### 👨‍💼 Corredor de Propiedades
**Flujo principal:**
1. Login → Propiedades
2. Crear propiedad → Abrir visor AR
3. Catálogos → Agregar muebles
4. Generar cotización
5. Analíticas para ver métricas

### 🏠 Comprador/Arrendatario
**Flujo principal:**
1. Login → Ver propiedades disponibles
2. Explorar propiedad en 3D
3. Ver catálogos de muebles
4. Guardar favoritos (mock)

---

## 📞 Soporte

Si encuentras errores o tienes dudas:
1. Revisar consola del navegador (F12)
2. Revisar terminal donde corre `npm run dev`
3. Consultar README.md principal
4. Revisar ESTRUCTURA.md para entender arquitectura

---

**¡Listo para comenzar! 🚀**

Ejecuta `npm install` y luego `npm run dev`
