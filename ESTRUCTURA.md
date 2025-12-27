# Árbol de Archivos Completo - LiveInside

```
7. PROTOTIPO/
│
├── node_modules/          # Dependencias (generado por npm install)
│
├── public/                # Assets estáticos (opcional)
│   └── vite.svg          # Favicon por defecto
│
├── src/
│   ├── app/
│   │   └── App.tsx                    # Router principal y configuración de rutas
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx          # Layout wrapper con sidebar/bottomnav
│   │   │   ├── BottomNav.tsx          # Navegación inferior (móvil)
│   │   │   ├── Sidebar.tsx            # Sidebar izquierdo (desktop)
│   │   │   └── TopBar.tsx             # Barra superior con título y acciones
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx             # Botón con variantes (primary, secondary, etc.)
│   │       ├── Card.tsx               # Container con CardHeader, CardBody, CardFooter
│   │       ├── Drawer.tsx             # Drawer animado (bottom, left, right)
│   │       ├── EmptyState.tsx         # Estado vacío con CTA
│   │       ├── Input.tsx              # Input con label, error, icon
│   │       ├── Loading.tsx            # LoadingSpinner y LoadingPage
│   │       ├── Modal.tsx              # Modal overlay centrado
│   │       └── Tabs.tsx               # Sistema de tabs
│   │
│   ├── pages/
│   │   ├── account/
│   │   │   └── AccountPage.tsx        # Perfil y datos de usuario/empresa
│   │   │
│   │   ├── analytics/
│   │   │   └── AnalyticsPage.tsx      # Dashboard con métricas y KPIs
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx          # Login con email/password
│   │   │   ├── OnboardingPage.tsx     # Selección tipo de usuario
│   │   │   └── RegisterPage.tsx       # Registro con tabs (Independiente/Empresa)
│   │   │
│   │   ├── cart/
│   │   │   └── CartPage.tsx           # Carrito con productos, cantidades, checkout
│   │   │
│   │   ├── catalogs/
│   │   │   ├── CatalogDetailPage.tsx  # Listado de productos por catálogo
│   │   │   └── CatalogsPage.tsx       # Grid de catálogos disponibles
│   │   │
│   │   ├── plans/
│   │   │   └── PlansPage.tsx          # Comparativa de planes de suscripción
│   │   │
│   │   ├── properties/
│   │   │   ├── NewPropertyPage.tsx    # Formulario crear propiedad
│   │   │   ├── PropertiesPage.tsx     # Listado de propiedades
│   │   │   └── PropertyDetailPage.tsx # Detalle + visor AR/3D placeholder
│   │   │
│   │   ├── quotes/
│   │   │   └── QuotesPage.tsx         # Listado de cotizaciones generadas
│   │   │
│   │   └── settings/
│   │       └── SettingsPage.tsx       # Menú de configuración
│   │
│   ├── stores/                        # Estado global con Zustand
│   │   ├── useAuthStore.ts            # Auth: user, login, logout, updateUser
│   │   └── useCartStore.ts            # Cart: items, add, remove, updateQty, clear
│   │
│   ├── services/
│   │   └── api.ts                     # Cliente API con simulación de delays
│   │
│   ├── mocks/
│   │   └── data.ts                    # Mock data: properties, products, catalogs, etc.
│   │
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces: User, Property, Product, etc.
│   │
│   ├── utils/
│   │   └── helpers.ts                 # Utilidades: cn(), formatCurrency(), formatDate()
│   │
│   ├── styles/
│   │   └── index.css                  # Tailwind imports + custom styles
│   │
│   └── main.tsx                       # Entry point de la aplicación
│
├── .eslintrc.cjs                      # Configuración ESLint
├── .gitignore                         # Archivos ignorados por Git
├── index.html                         # HTML base
├── package.json                       # Dependencias y scripts
├── postcss.config.js                  # PostCSS (Tailwind)
├── tailwind.config.js                 # Configuración Tailwind
├── tsconfig.json                      # Configuración TypeScript
├── tsconfig.node.json                 # TS config para Vite
├── vite.config.ts                     # Configuración Vite
└── README.md                          # Documentación completa

```

## Resumen de Archivos

### Configuración (8 archivos)
- package.json
- vite.config.ts
- tsconfig.json
- tsconfig.node.json
- tailwind.config.js
- postcss.config.js
- .eslintrc.cjs
- .gitignore

### Código Fuente (42 archivos)
- **App**: 1 archivo (App.tsx)
- **Components**: 12 archivos
  - Layout: 4 (AppLayout, BottomNav, Sidebar, TopBar)
  - UI: 8 (Button, Card, Drawer, EmptyState, Input, Loading, Modal, Tabs)
- **Pages**: 18 archivos
  - auth: 3
  - properties: 3
  - catalogs: 2
  - cart: 1
  - quotes: 1
  - analytics: 1
  - settings: 1
  - account: 1
  - plans: 1
- **Stores**: 2 archivos (useAuthStore, useCartStore)
- **Services**: 1 archivo (api.ts)
- **Mocks**: 1 archivo (data.ts)
- **Types**: 1 archivo (index.ts)
- **Utils**: 1 archivo (helpers.ts)
- **Styles**: 1 archivo (index.css)
- **Entry**: 2 archivos (main.tsx, index.html)

### Documentación
- README.md (este archivo)

**Total: ~53 archivos de código**

## Tamaño del Proyecto

- **Líneas de código aproximadas**: ~6,500
- **Componentes React**: 30+
- **Pantallas/Páginas**: 14
- **Hooks personalizados**: 2 (stores)
- **Tipos TypeScript**: 10+ interfaces

## Próximos Pasos para el Desarrollador

1. **Ejecutar `npm install`** para instalar dependencias
2. **Ejecutar `npm run dev`** para iniciar el servidor
3. **Navegar a http://localhost:3000**
4. **Probar el flujo completo**:
   - Onboarding → Login/Register
   - Crear propiedad
   - Navegar catálogos
   - Agregar productos al carrito
   - Generar cotización
   - Ver analíticas
   - Explorar configuración

5. **Para conectar backend real**:
   - Actualizar `src/services/api.ts`
   - Configurar `.env` con URL del API
   - Implementar manejo de tokens
   - Agregar interceptors de error

6. **Para integrar Unity**:
   - Instalar `react-unity-webgl`
   - Reemplazar placeholder en `PropertyDetailPage`
   - Implementar comunicación bidireccional
   - Sincronizar estado de objetos 3D

7. **Para deploy**:
   - Build: `npm run build`
   - Deploy carpeta `dist/` a Vercel, Netlify, etc.
   - Configurar variables de entorno
