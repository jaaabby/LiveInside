# 🎯 Decisiones Técnicas y Mejores Prácticas

## Arquitectura General

### Patrón: Feature-Based Structure
```
src/
├── app/          # Configuración y setup
├── components/   # Componentes reutilizables
├── pages/        # Pantallas organizadas por feature
├── stores/       # Estado global
├── services/     # Lógica de negocio
└── types/        # Definiciones TypeScript
```

**Razón:** Escalabilidad y mantenibilidad. Cada feature es autocontenida.

---

## Estado Global (Zustand)

### ¿Por qué Zustand sobre Redux?

#### Performance
```typescript
// Zustand: re-render solo donde se usa
const name = useAuthStore((state) => state.user?.name);

// Redux: todo el consumer re-renderiza
const { user } = useSelector((state) => state.auth);
```

#### Simplicidad
```typescript
// Zustand: ~15 líneas
export const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
}));

// Redux: ~50 líneas (actions, reducer, types)
```

#### Bundle Size
- Zustand: 2.9 KB
- Redux Toolkit: 12.3 KB
- Context API: 0 KB (pero peor performance)

---

## Formularios (React Hook Form + Zod)

### Ventajas sobre Formik

#### Performance
```typescript
// RHF: Uncontrolled (sin re-renders)
const { register } = useForm();
<input {...register('email')} />

// Formik: Controlled (re-render por cada tecla)
<Field name="email" />
```

#### Validación Type-Safe
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>; // ✅ Auto-typed
```

#### Bundle Size
- RHF: 8.6 KB
- Formik: 13.1 KB

---

## Estilos (Tailwind CSS)

### Mobile-First Approach

```css
/* ❌ Desktop-first (difícil mantener) */
.card {
  width: 400px;
  @media (max-width: 768px) {
    width: 100%;
  }
}

/* ✅ Mobile-first (escalable) */
.card {
  width: 100%;
  @media (min-width: 768px) {
    width: 400px;
  }
}
```

En Tailwind:
```jsx
<div className="w-full md:w-96">
```

### Utilidades Personalizadas

```css
/* src/styles/index.css */
@layer utilities {
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

**Razón:** Soporte para notch en móviles (iPhone X+)

---

## Componentes UI

### Patrón: Compound Components

```typescript
// ✅ Flexible y composable
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
  <CardFooter>Actions</CardFooter>
</Card>

// ❌ Props explosion
<Card 
  title="Title" 
  content="Content" 
  footer="Actions"
/>
```

### Función Helper `cn()`

```typescript
import { clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Uso:
<div className={cn(
  'base-styles',
  isActive && 'active-styles',
  className
)} />
```

**Razón:** Merge de clases condicionales sin conflictos.

---

## Routing (React Router v6)

### Rutas Protegidas

```typescript
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
```

**Ventajas:**
- Reutilizable
- Type-safe
- Fácil agregar middleware (roles, permissions)

### Rutas Anidadas

```typescript
<Route element={<AppLayout />}>
  <Route path="/properties" element={<PropertiesPage />} />
  <Route path="/properties/:id" element={<PropertyDetailPage />} />
</Route>
```

**Razón:** Layout compartido (sidebar, bottomnav) sin duplicación.

---

## API Layer

### Abstracción con Delays Simulados

```typescript
export const api = {
  properties: {
    getAll: async (): Promise<Property[]> => {
      await delay(500); // Simula latencia
      return mockProperties;
    },
  },
};
```

**Ventajas:**
1. Simula comportamiento real (loading states)
2. Fácil migrar a API real (solo cambiar implementación)
3. No necesita backend para desarrollo

### Migración a API Real

```typescript
// Antes (mock)
const properties = mockProperties;

// Después (real)
const response = await fetch(`${API_URL}/properties`);
const properties = await response.json();
```

---

## TypeScript Strictness

### Configuración Strict

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Razón:** Catch errores en tiempo de compilación, no runtime.

### Tipos Compartidos

```typescript
// types/index.ts
export interface User { ... }
export interface Property { ... }

// Uso en múltiples archivos
import type { User } from '@/types';
```

---

## Performance Optimizations

### 1. Code Splitting por Ruta

```typescript
// ✅ Lazy loading (automático con Vite)
const PropertiesPage = lazy(() => import('./pages/properties/PropertiesPage'));

// Build genera chunks separados:
// - properties-[hash].js
// - catalogs-[hash].js
// - etc.
```

### 2. Imágenes Optimizadas

```typescript
// ✅ Lazy loading nativo
<img 
  src={property.image} 
  loading="lazy"
  alt={property.name}
/>

// ✅ Responsive
<img 
  srcSet="
    image-small.jpg 480w,
    image-medium.jpg 768w,
    image-large.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 3. Zustand Selectors Granulares

```typescript
// ❌ Re-render innecesario
const { user, isAuthenticated } = useAuthStore();

// ✅ Re-render solo si name cambia
const name = useAuthStore((state) => state.user?.name);
```

---

## Accesibilidad (a11y)

### ARIA Labels

```typescript
<button aria-label="Cerrar modal">
  <XIcon />
</button>
```

### Focus Management

```typescript
// Modal automáticamente trap focus
<Modal isOpen={true}>
  <input autoFocus />
</Modal>
```

### Keyboard Navigation

```typescript
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
```

---

## Error Handling

### Boundary Pattern (Futuro)

```typescript
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

### Toast Notifications (Futuro)

```typescript
import { toast } from 'sonner';

try {
  await api.properties.create(data);
  toast.success('Propiedad creada');
} catch (error) {
  toast.error('Error al crear propiedad');
}
```

---

## Testing Strategy (Para Futuro)

### 1. Unit Tests (Vitest)
```typescript
// stores/useAuthStore.test.ts
describe('useAuthStore', () => {
  it('should login user', () => {
    const { login } = useAuthStore.getState();
    login(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
```

### 2. Component Tests (Testing Library)
```typescript
// Button.test.tsx
test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### 3. E2E Tests (Playwright)
```typescript
// e2e/login.spec.ts
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'test@test.com');
  await page.fill('[name=password]', 'password');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/properties');
});
```

---

## Git Workflow

### Branch Strategy
```bash
main          # Producción
├── develop   # Integración
├── feature/* # Features nuevas
└── hotfix/*  # Fixes urgentes
```

### Commit Messages
```bash
# ✅ Descriptivos
feat: add property detail page
fix: correct cart total calculation
refactor: extract API client
docs: update README with deployment steps

# ❌ Vagos
update code
fix bug
changes
```

---

## Environment Variables

### Setup
```bash
# .env.local (no commitear)
VITE_API_URL=https://api.liveinside.com
VITE_GOOGLE_CLIENT_ID=xxx

# vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}
```

### Uso
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Build Optimization

### Vite Config
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['zustand', 'react-hook-form', 'zod'],
        },
      },
    },
  },
});
```

**Resultado:**
- Chunks separados para vendors
- Mejor cache del navegador
- Menor tiempo de carga inicial

---

## Security Best Practices

### 1. XSS Prevention
```typescript
// ✅ React escapa automáticamente
<div>{userInput}</div>

// ❌ Peligroso
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 2. CSRF Tokens (Con Backend Real)
```typescript
const response = await fetch('/api/properties', {
  headers: {
    'X-CSRF-Token': getCsrfToken(),
  },
});
```

### 3. Sanitize URLs
```typescript
const sanitizeUrl = (url: string) => {
  const allowedProtocols = ['http:', 'https:'];
  try {
    const parsed = new URL(url);
    return allowedProtocols.includes(parsed.protocol) ? url : '#';
  } catch {
    return '#';
  }
};
```

---

## Deployment Checklist

- [ ] Build sin warnings
- [ ] TypeScript sin errores
- [ ] ESLint sin warnings
- [ ] Todas las imágenes optimizadas
- [ ] Variables de entorno configuradas
- [ ] HTTPS habilitado
- [ ] Gzip/Brotli compression
- [ ] Cache headers configurados
- [ ] Analytics setup (Google Analytics, etc.)
- [ ] Error tracking (Sentry, etc.)
- [ ] Lighthouse score > 90

---

## Recursos Adicionales

### Documentación
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

### Herramientas
- [VS Code Extensions](https://marketplace.visualstudio.com)
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Error Lens
- [Chrome DevTools](https://developer.chrome.com/docs/devtools)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)

---

**Última actualización:** Diciembre 2025
