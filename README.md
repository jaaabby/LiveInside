# LiveInside - Plataforma de Propiedades con AR

Aplicación web móvil y de escritorio para corredores de propiedades que permite gestionar inmuebles, visualizarlos en 3D/AR, navegar catálogos de muebles y generar cotizaciones.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm/pnpm
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

La aplicación se abrirá en `http://localhost:3000`

### Credenciales de prueba

Para acceder rápidamente:
- Email: cualquier email válido
- Password: cualquier password de 6+ caracteres

## 🏗️ Stack Tecnológico

### Core
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

### Routing & Estado
- **React Router v6** - Navegación SPA
- **Zustand** - Estado global (auth, cart)
- **Zustand Persist** - Persistencia localStorage

### Estilos
- **TailwindCSS** - Utility-first CSS
- **Mobile-first** - Diseño responsive

### Formularios & Validación
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de schemas
- **@hookform/resolvers** - Integración RHF + Zod

### Utilidades
- **clsx** - Composición de clases CSS
- **date-fns** (implícito) - Manejo de fechas

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Configuración principal
│   └── App.tsx            # Router y configuración de rutas
├── components/
│   ├── layout/            # Layout components
│   │   ├── AppLayout.tsx  # Layout principal con sidebar/bottomnav
│   │   ├── BottomNav.tsx  # Navegación inferior móvil
│   │   ├── TopBar.tsx     # Barra superior
│   │   └── Sidebar.tsx    # Sidebar desktop
│   └── ui/                # Componentes UI reutilizables
│       ├── Button.tsx     # Botón con variantes
│       ├── Input.tsx      # Input con label y error
│       ├── Card.tsx       # Contenedor de contenido
│       ├── Modal.tsx      # Modal overlay
│       ├── Drawer.tsx     # Drawer bottom/side
│       ├── Tabs.tsx       # Sistema de tabs
│       ├── Loading.tsx    # Spinners y estados de carga
│       └── EmptyState.tsx # Estados vacíos
├── pages/                 # Páginas/Vistas
│   ├── auth/             # Autenticación
│   │   ├── OnboardingPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── properties/       # Gestión de propiedades
│   │   ├── PropertiesPage.tsx      # Lista
│   │   ├── PropertyDetailPage.tsx  # Detalle + visor AR
│   │   └── NewPropertyPage.tsx     # Formulario
│   ├── catalogs/         # Catálogos de muebles
│   │   ├── CatalogsPage.tsx        # Grid de catálogos
│   │   └── CatalogDetailPage.tsx   # Productos
│   ├── cart/             # Carrito de compras
│   │   └── CartPage.tsx
│   ├── quotes/           # Cotizaciones
│   │   └── QuotesPage.tsx
│   ├── analytics/        # Dashboard y métricas
│   │   └── AnalyticsPage.tsx
│   ├── settings/         # Configuración
│   │   └── SettingsPage.tsx
│   ├── account/          # Perfil de usuario
│   │   └── AccountPage.tsx
│   └── plans/            # Planes de suscripción
│       └── PlansPage.tsx
├── stores/               # Estado global (Zustand)
│   ├── useAuthStore.ts   # Autenticación y usuario
│   └── useCartStore.ts   # Carrito de compras
├── services/            # Capa de servicios
│   └── api.ts           # Cliente API con mocks
├── mocks/               # Datos de prueba
│   └── data.ts          # Mock data: properties, products, etc.
├── types/               # Definiciones TypeScript
│   └── index.ts         # Interfaces y tipos
├── utils/               # Funciones utilitarias
│   └── helpers.ts       # cn(), formatCurrency(), etc.
├── styles/              # Estilos globales
│   └── index.css        # Tailwind imports + custom
└── main.tsx             # Entry point
```

## 🎨 Decisiones de Diseño

### 1. Vite vs Next.js
**Elegido: Vite**

**Razón:** 
- La aplicación no requiere SSR (Server-Side Rendering)
- No hay SEO crítico (app privada, detrás de login)
- Vite ofrece HMR más rápido y build más simple
- Menor complejidad para el scope del proyecto

### 2. Zustand vs Redux Toolkit
**Elegido: Zustand**

**Razón:**
- API más simple y menos boilerplate
- Suficiente para el estado de esta app (auth + cart)
- Mejor performance (sin context, suscripciones granulares)
- Middleware de persist integrado
- Más ligero (< 3KB)

### 3. TailwindCSS Mobile-First
**Estrategia:**
- Clases base sin prefijo = móvil
- `md:` = tablet (768px+)
- `lg:` = desktop (1024px+)
- Componentes UI abstraídos para consistencia
- Sistema de colores primary/secondary customizado

### 4. React Hook Form + Zod
**Razón:**
- Mejor performance (uncontrolled inputs)
- Validación type-safe con Zod
- Menos re-renders
- Integración nativa con mensajes de error

### 5. Arquitectura de API Mock
**Implementación:**
- Capa de abstracción `api.ts` que simula delays
- Fácil migración a API real (solo cambiar implementación)
- Datos mock centralizados en `mocks/data.ts`
- Todas las operaciones retornan Promises

## 📱 Funcionalidades Implementadas

### Autenticación
- [x] Onboarding con selección de tipo de usuario
- [x] Login con email/password
- [x] Registro con tabs (Independiente/Empresa)
- [x] Validación de formularios (Zod)
- [x] Persistencia de sesión (localStorage)
- [x] Logout

### Propiedades
- [x] Listado de propiedades con cards
- [x] Agregar nueva propiedad (formulario completo)
- [x] Detalle de propiedad
- [x] Placeholder para visor AR/3D (Unity preparado)
- [x] Estados: activa, inactiva, rentada
- [x] Métricas por propiedad (visitas)

### Catálogos y Productos
- [x] Grid de catálogos (IKEA, SODIMAC, CASA IDEAS, EASY)
- [x] Listado de productos por catálogo
- [x] Agregar productos al carrito
- [x] Indicador de items en carrito

### Carrito de Compras
- [x] Ver productos agregados
- [x] Incrementar/decrementar cantidad
- [x] Eliminar productos
- [x] Calcular subtotal
- [x] Generar cotización
- [x] Enviar cotización por email (modal)
- [x] Limpiar carrito después de cotizar

### Cotizaciones
- [x] Listado de cotizaciones generadas
- [x] Estados: borrador, enviada, completada
- [x] Fecha y total por cotización
- [x] Descarga PDF (placeholder)
- [x] Reenvío por email (placeholder)

### Analíticas / Dashboard
- [x] Total de visitas con cambio porcentual
- [x] Mueble más seleccionado
- [x] Colores más aplicados
- [x] Propiedades recientes
- [x] Acordeones para análisis detallados

### Configuración y Cuenta
- [x] Menú de configuración
- [x] Ver y editar perfil de usuario
- [x] Ver plan actual
- [x] Gestión de configuraciones
- [x] Cerrar sesión

### Planes
- [x] Comparativa de planes (Starter, Pro, Business)
- [x] Indicador de plan actual
- [x] Features por plan
- [x] Precio mensual

### Navegación
- [x] Bottom navigation (móvil)
- [x] Sidebar (desktop)
- [x] TopBar con acciones contextuales
- [x] Breadcrumbs implícitos (botón "volver")
- [x] Rutas protegidas (requieren auth)

### UX/UI
- [x] Loading states (spinners, skeletons)
- [x] Empty states con call-to-action
- [x] Error states en formularios
- [x] Mensajes de confirmación (modals)
- [x] Transiciones suaves
- [x] Hover states y feedback visual

## 🔮 Integración Futura con Unity

### Preparación Actual

El componente `ARViewer` en `PropertyDetailPage.tsx` está preparado para recibir Unity:

```typescript
interface ViewerMessage {
  type: 'loadProperty' | 'setNode' | 'spawnFurniture' | 'objectPlaced' | 'nodeChanged';
  payload?: {
    propertyId?: string;
    nodeId?: string;
    sku?: string;
    position?: { x: number; y: number; z: number };
  };
}
```

### Flujo de Integración

1. **React → Unity:**
   ```typescript
   // Cargar propiedad en visor
   sendToUnity({ type: 'loadProperty', payload: { propertyId: '123' } });
   
   // Cambiar nodo/habitación
   sendToUnity({ type: 'setNode', payload: { nodeId: 'bedroom-1' } });
   
   // Spawnear mueble
   sendToUnity({ type: 'spawnFurniture', payload: { sku: 'IKEA-001' } });
   ```

2. **Unity → React:**
   ```typescript
   // Escuchar eventos de Unity
   useEffect(() => {
     window.addEventListener('unity-message', (event) => {
       const msg = event.detail as ViewerMessage;
       if (msg.type === 'objectPlaced') {
         // Actualizar estado React
       }
     });
   }, []);
   ```

### Tareas para Integración Real

1. Agregar Unity WebGL build al proyecto
2. Implementar `react-unity-webgl` o similar
3. Conectar mensajes bidireccionales
4. Agregar catálogo de muebles lateral/drawer
5. Sincronizar estado de objetos colocados
6. Guardar configuraciones de staging

## 🔧 Cómo Agregar Nuevas Pantallas

### 1. Crear el componente de página

```typescript
// src/pages/nueva-feature/NuevaPage.tsx
import { TopBar } from '@/components/layout/TopBar';

export function NuevaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Nueva Feature" showBack />
      <div className="p-4">
        {/* Tu contenido */}
      </div>
    </div>
  );
}
```

### 2. Agregar ruta en App.tsx

```typescript
import { NuevaPage } from '@/pages/nueva-feature/NuevaPage';

// En el router:
<Route
  path="/nueva-feature"
  element={
    <PrivateRoute>
      <NuevaPage />
    </PrivateRoute>
  }
/>
```

### 3. Agregar navegación (opcional)

En `BottomNav.tsx` o `Sidebar.tsx`:

```typescript
{
  id: 'nueva',
  label: 'Nueva',
  path: '/nueva-feature',
  icon: <svg>...</svg>,
}
```

## 🎯 Cómo Agregar Nuevos Componentes

### Componente UI Reutilizable

```typescript
// src/components/ui/Badge.tsx
import { cn } from '@/utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-block px-2 py-1 text-xs font-medium rounded-full',
      variant === 'success' && 'bg-green-100 text-green-700',
      variant === 'warning' && 'bg-yellow-100 text-yellow-700',
    )}>
      {children}
    </span>
  );
}
```

### Componente de Feature

```typescript
// src/components/features/PropertyCard.tsx
import { Card } from '@/components/ui/Card';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-lg">
      {/* Implementación */}
    </Card>
  );
}
```

## 🔌 Cómo Conectar a un Backend Real

### 1. Configurar variables de entorno

```bash
# .env
VITE_API_URL=https://api.liveinside.com
```

### 2. Actualizar servicios API

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  properties: {
    getAll: async (): Promise<Property[]> => {
      const response = await fetch(`${API_URL}/properties`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return response.json();
    },
    // ... resto de métodos
  },
};
```

### 3. Manejar autenticación real

```typescript
// src/services/auth.ts
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  // Guardar token
  localStorage.setItem('token', data.token);
  return data.user;
}
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia dev server en puerto 3000

# Build
npm run build        # Compila para producción en /dist
npm run preview      # Preview del build de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## 🌐 Compatibilidad de Navegadores

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 PWA (Preparación)

Para convertir en PWA:

1. Agregar `vite-plugin-pwa`
2. Configurar manifest en `vite.config.ts`
3. Agregar service worker
4. Configurar iconos y splash screens

## 🧪 Testing (Para Futuro)

Stack recomendado:
- **Vitest** - Unit tests
- **Testing Library** - Component tests
- **Playwright** - E2E tests

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Subir carpeta dist/
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 📄 Licencia

Proyecto académico - PIINFO 2025

## 👥 Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.

---

**Última actualización:** Diciembre 2025
