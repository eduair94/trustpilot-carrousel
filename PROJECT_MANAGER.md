# Project Manager (PM) - Trustpilot Reviews Carousel

## 📋 Resumen del Proyecto

**Nombre:** Trustpilot Reviews Carousel  
**Descripción:** Desarrollo de un iframe embebible que muestra un carrousel de reseñas de Trustpilot, configurable mediante parámetros URL y responsive.  
**Tecnologías:** Next.js 14+, TypeScript, React 18+, Tailwind CSS

## 🎯 Objetivos del Proyecto

### Objetivo Principal
Crear un widget iframe que permita a los usuarios mostrar reseñas de Trustpilot de forma elegante y personalizable en sus sitios web.

### Objetivos Específicos
- ✅ Implementar carrousel responsive de reseñas
- ✅ Configuración vía parámetros URL
- ✅ Protección del endpoint backend
- ✅ Interfaz user-friendly
- ✅ Optimización para rendimiento
- ✅ Compatibilidad cross-browser

## 🚀 Alcance del Proyecto

### Funcionalidades Incluidas
1. **Carrousel de Reseñas**
   - Visualización de reseñas de Trustpilot
   - Navegación automática y manual
   - Animaciones suaves
   - Indicadores de posición

2. **Configuración por URL**
   - `domain`: Dominio objetivo para las reseñas
   - `page`: Página de reseñas a mostrar
   - `autoplay`: Activar/desactivar reproducción automática
   - `interval`: Intervalo de cambio automático (ms)
   - `theme`: Tema visual (light/dark)
   - `maxReviews`: Número máximo de reseñas
   - `rating`: Filtro por calificación mínima
   - `language`: Idioma de las reseñas

3. **Backend Proxy**
   - Endpoint seguro para consultas a Trustpilot API
   - Cache de respuestas
   - Rate limiting
   - Validación de dominios

4. **Responsive Design**
   - Mobile-first approach
   - Breakpoints optimizados
   - Touch gestures para móviles

### Funcionalidades Excluidas (Fuera del Alcance)
- ❌ Panel de administración
- ❌ Base de datos propia
- ❌ Autenticación de usuarios
- ❌ Análiticas avanzadas

## 🛠️ Stack Tecnológico Recomendado

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript 5+
- **Styling:** Tailwind CSS 3+
- **Componentes:** Headless UI / Radix UI
- **Animaciones:** Framer Motion
- **Estado:** Zustand (si es necesario)

### Librería para Carrousel
**Opciones Evaluadas:**
1. **Swiper.js** ⭐ (RECOMENDADO)
   - Soporte nativo para React
   - Touch gestures
   - Lazy loading
   - Altamente customizable
   - Bundle pequeño

2. **Embla Carousel**
   - Ligero y performante
   - TypeScript nativo
   - Plugins modulares

3. **React Slick**
   - Ampliamente usado
   - Mayor bundle size
   - Menos performante

### Backend
- **Runtime:** Node.js 18+
- **API:** Next.js API Routes
- **HTTP Client:** Fetch nativo
- **Cache:** Redis (opcional) / Memory cache
- **Validación:** Zod

## 📐 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Cliente (Website)                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              iframe embebido                            ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │         Next.js SSR Page                            │││
│  │  │  ┌─────────────────┐ ┌─────────────────────────────┐│││
│  │  │  │   Carrousel     │ │      Reviews Data           ││││
│  │  │  │   Component     │ │      (Pre-rendered)         ││││
│  │  │  └─────────────────┘ └─────────────────────────────┘│││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Server-Side Render
                            │
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Server                            │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐ │
│  │   URL Params    │ │      Cache      │ │  Rate Limit   │ │
│  │   Validation    │ │   (Redis/Memory)│ │  (by IP)      │ │
│  └─────────────────┘ └─────────────────┘ └───────────────┘ │
│                            │                               │
│                    ┌───────▼──────┐                        │
│                    │ Server Fetch │                        │
│                    │  (getReviews) │                        │
│                    └───────┬──────┘                        │
└─────────────────────────────┼─────────────────────────────────┘
                            │ Direct API Call
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 External Reviews API                        │
│                 (api.trustpilot.com)                        │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Estructura del Proyecto

```
trustpilot-carrousel/
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── .env.local
├── .env.example
├── .gitignore
├── 
├── public/
│   ├── favicon.ico
│   └── demo.html
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── StarRating.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewsCarrousel.tsx
│   │   └── ErrorBoundary.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   ├── config.ts
│   │   ├── trustpilot-server.ts
│   │   └── cache.ts
│   │
│   ├── hooks/
│   │   └── useURLParams.ts
│   │
│   └── styles/
│       └── globals.css
│
├── docs/
│   ├── API.md
│   ├── INTEGRATION.md
│   └── CUSTOMIZATION.md
│
└── tests/
    ├── __mocks__/
    ├── components/
    ├── lib/
    └── api/
```

## ⏱️ Cronograma del Proyecto

### Sprint 1: Configuración y Base (Semana 1)
- [x] Configuración del proyecto Next.js
- [x] Configuración TypeScript y linting
- [x] Setup Tailwind CSS
- [x] Estructura de carpetas
- [x] Configuración de entorno

### Sprint 2: Server-Side Data Fetching (Semana 1-2)
- [ ] Desarrollo de trustpilot-server.ts
- [ ] Implementación de cache en servidor
- [ ] Rate limiting por IP
- [ ] Validación de parámetros URL
- [ ] Manejo de errores en servidor

### Sprint 3: Frontend Base (Semana 2)
- [ ] Componente ReviewCard
- [ ] Parser de parámetros URL
- [ ] Hook useReviews
- [ ] Estados de carga y error

### Sprint 4: Carrousel (Semana 2-3)
- [ ] Integración Swiper.js
- [ ] Implementación del carrousel
- [ ] Navegación manual
- [ ] Autoplay configurable
- [ ] Responsive design

### Sprint 5: Personalización (Semana 3)
- [ ] Temas (light/dark)
- [ ] Configuraciones avanzadas
- [ ] Filtros de reseñas
- [ ] Optimizaciones de performance

### Sprint 6: Testing y Documentación (Semana 4)
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Documentación de API
- [ ] Guía de integración
- [ ] Optimización final

## 🔧 Configuración de Parámetros

### Parámetros URL Soportados

```typescript
interface CarrouselConfig {
  domain: string;           // REQUERIDO: dominio objetivo
  page?: number;            // Página de reseñas (default: 1)
  autoplay?: boolean;       // Autoplay (default: true)
  interval?: number;        // Intervalo en ms (default: 5000)
  theme?: 'light' | 'dark'; // Tema (default: 'light')
  maxReviews?: number;      // Máximo reseñas (default: 10)
  minRating?: 1|2|3|4|5;   // Rating mínimo (default: 1)
  language?: string;        // Idioma (default: 'en')
  showRating?: boolean;     // Mostrar rating (default: true)
  showDate?: boolean;       // Mostrar fecha (default: true)
  height?: number;          // Altura del iframe (default: 400)
  width?: number;           // Ancho del iframe (default: '100%')
}
```

### Ejemplo de Uso

```html
<iframe 
  src="https://trustpilot-carrousel.vercel.app/?domain=www.google.com&page=1&theme=dark&autoplay=true&interval=3000"
  width="100%" 
  height="400"
  frameborder="0">
</iframe>
```

## 🎨 Design System

### Colores
```css
:root {
  --primary: #00b67a;      /* Trustpilot Green */
  --secondary: #dcdce6;    /* Light Gray */
  --accent: #ff3722;       /* Red for low ratings */
  --warning: #ffb829;      /* Yellow for medium ratings */
  --background: #ffffff;   /* White */
  --surface: #f7f8fc;      /* Light background */
  --text: #191919;         /* Dark text */
  --text-secondary: #666;  /* Gray text */
}
```

### Tipografía
- **Font Family:** Inter, system-ui, sans-serif
- **Sizes:** 12px, 14px, 16px, 18px, 24px

### Spacing
- **Base:** 4px
- **Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## 🔒 Seguridad

### Medidas Implementadas
1. **Rate Limiting:** 100 requests/minute por IP
2. **CORS:** Configuración restrictiva
3. **Validación:** Sanitización de parámetros
4. **Cache:** Evitar llamadas excesivas a API
5. **Error Handling:** No exposición de datos internos

### Variables de Entorno
```env
# .env.local
TRUSTPILOT_API_KEY=your_api_key_here
REDIS_URL=redis://localhost:6379
NODE_ENV=production
ALLOWED_ORIGINS=https://example.com,https://another-site.com
```

## 🚀 Deployment

### Plataformas Recomendadas
1. **Vercel** ⭐ (RECOMENDADO)
   - Optimizado para Next.js
   - Edge functions
   - Deploy automático
   - Domain personalizado

2. **Netlify**
   - Alternativa sólida
   - Edge functions
   - Forms handling

3. **Railway**
   - Simple y rápido
   - Database incluida

### CI/CD Pipeline
- **GitHub Actions** para testing automático
- **Deploy automático** en merge a main
- **Preview deployments** para PRs

## 📊 Métricas y Monitoring

### KPIs a Monitorear
- **Performance:** Core Web Vitals
- **Uptime:** 99.9% target
- **Load Time:** < 2 segundos
- **API Response Time:** < 500ms
- **Error Rate:** < 1%

### Herramientas
- **Vercel Analytics** para performance
- **Sentry** para error tracking
- **Google Analytics** para uso (opcional)

## 🧪 Testing Strategy

### Tipos de Tests
1. **Unit Tests:** Jest + Testing Library
2. **Integration Tests:** API endpoints
3. **E2E Tests:** Playwright
4. **Visual Regression:** Chromatic (opcional)

### Coverage Target
- **Código:** > 85%
- **Componentes críticos:** 100%

## 💰 Estimación de Costos

### Desarrollo
- **Tiempo estimado:** 3-4 semanas
- **Esfuerzo:** 120-160 horas

### Infraestructura (Mensual)
- **Vercel Pro:** $20/mes
- **Redis Cloud:** $5/mes (opcional)
- **Domain:** $10/año
- **Total:** ~$25/mes

## 🔮 Roadmap Futuro

### V2.0 (Futuras mejoras)
- [ ] Panel de administración
- [ ] Analytics dashboard
- [ ] A/B testing de temas
- [ ] Widget builder visual
- [ ] Múltiples fuentes de reseñas
- [ ] WebComponents version

## 📞 Contacto y Soporte

### Documentación
- **API Docs:** `/docs/API.md`
- **Integration Guide:** `/docs/INTEGRATION.md`
- **Customization:** `/docs/CUSTOMIZATION.md`

### Issues y Soporte
- **GitHub Issues:** Para bugs y features
- **Documentation:** Wiki del repositorio
- **Examples:** Carpeta `/examples`

---

**Última actualización:** Agosto 2025  
**Versión del documento:** 1.0  
**Estado:** En desarrollo
