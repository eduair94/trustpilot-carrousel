# README - Trustpilot Reviews Carousel

## 🎠 Trustpilot Reviews Carousel

Un widget iframe embebible que muestra reseñas de Trustpilot en un elegante carrousel responsive, altamente configurable mediante parámetros URL.

### ✨ Características Principales

- 🎨 **Responsive Design** - Adaptable a cualquier tamaño de pantalla
- ⚡ **Performance Optimizado** - Carga rápida y suave
- 🛠️ **Altamente Configurable** - Personalización via URL parameters  
- 🔒 **Seguro** - Proxy backend que protege las API keys
- 🎯 **Fácil Integración** - Simple iframe embed
- 🌐 **Cross-browser Compatible** - Funciona en todos los navegadores modernos

## 🚀 Demo Rápido

```html
<iframe 
  src="https://your-domain.com/?domain=www.google.com&theme=dark&autoplay=true"
  width="100%" 
  height="400"
  frameborder="0">
</iframe>
```

## 📋 Tabla de Contenidos

- [Instalación](#-instalación)
- [Configuración](#-configuración)  
- [Parámetros URL](#-parámetros-url)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [API](#-api)
- [Desarrollo](#-desarrollo)
- [Deployment](#-deployment)
- [Contribuir](#-contribuir)

## 🛠️ Instalación

### Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/trustpilot-carrousel.git
cd trustpilot-carrousel

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en modo desarrollo
npm run dev
```

### Docker (Opcional)

```bash
# Construir imagen
docker build -t trustpilot-carrousel .

# Ejecutar contenedor
docker run -p 3000:3000 trustpilot-carrousel
```

## ⚙️ Configuración

### Variables de Entorno

```env
# .env.local
TRUSTPILOT_API_KEY=your_api_key_if_needed
EXTERNAL_API_BASE_URL=https://trustpilot.checkleaked.com
CACHE_TTL_SECONDS=300
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://example.com,https://another-site.com
```

## 🔧 Parámetros URL

### Parámetros Requeridos

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `domain` | string | Dominio de la empresa en Trustpilot | `www.google.com` |

### Parámetros Opcionales

| Parámetro | Tipo | Default | Descripción | Ejemplo |
|-----------|------|---------|-------------|---------|
| `page` | number | `1` | Página de reseñas | `1` |
| `autoplay` | boolean | `true` | Reproducción automática | `true` |
| `interval` | number | `5000` | Intervalo de autoplay (ms) | `3000` |
| `theme` | `light\|dark` | `light` | Tema visual | `dark` |
| `maxReviews` | number | `10` | Máximo número de reseñas | `5` |
| `minRating` | `1\|2\|3\|4\|5` | `1` | Rating mínimo | `4` |
| `language` | string | `en` | Idioma de las reseñas | `es` |
| `showRating` | boolean | `true` | Mostrar estrellas de rating | `false` |
| `showDate` | boolean | `true` | Mostrar fecha de reseña | `false` |
| `height` | number | `400` | Altura del iframe (px) | `300` |

## 💡 Ejemplos de Uso

### Básico
```html
<iframe 
  src="https://your-domain.com/?domain=www.example.com"
  width="100%" 
  height="400">
</iframe>
```

### Tema Oscuro con Autoplay Lento
```html
<iframe 
  src="https://your-domain.com/?domain=www.example.com&theme=dark&interval=8000"
  width="100%" 
  height="400">
</iframe>
```

### Solo Reseñas de 4-5 Estrellas
```html
<iframe 
  src="https://your-domain.com/?domain=www.example.com&minRating=4&maxReviews=5"
  width="100%" 
  height="300">
</iframe>
```

### Configuración Completa
```html
<iframe 
  src="https://your-domain.com/?domain=www.example.com&page=1&autoplay=true&interval=4000&theme=light&maxReviews=8&minRating=3&showRating=true&showDate=true"
  width="100%" 
  height="450">
</iframe>
```

## 📡 API

### Endpoint Interno

```
GET /api/reviews?domain=example.com&page=1
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review_123",
        "author": {
          "name": "John Doe",
          "avatar": "https://avatar.url/image.jpg"
        },
        "rating": 5,
        "title": "Great service!",
        "content": "I had an amazing experience...",
        "date": "2024-01-15T10:30:00Z",
        "verified": true
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_reviews": 47
    },
    "company": {
      "name": "Example Company",
      "average_rating": 4.2
    }
  }
}
```

### Códigos de Error

| Código | Status | Descripción |
|--------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Parámetros inválidos |
| `INVALID_DOMAIN` | 404 | Dominio no encontrado |
| `RATE_LIMIT_EXCEEDED` | 429 | Límite de requests excedido |
| `INTERNAL_SERVER_ERROR` | 500 | Error interno |

## 🛠️ Desarrollo

### Stack Tecnológico

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Carrousel:** Swiper.js
- **Animaciones:** Framer Motion
- **Validación:** Zod
- **Estado:** Zustand

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint

# Tests
npm test

# Tests con coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### Estructura del Proyecto

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # Página principal del carrousel
│   ├── layout.tsx      # Layout global
│   └── api/            # API routes
├── components/          # Componentes React
│   ├── ui/             # Componentes base
│   ├── ReviewCard.tsx  # Tarjeta de reseña individual
│   └── ReviewsCarrousel.tsx # Componente principal del carrousel
├── lib/                # Utilidades y configuración
├── hooks/              # Custom React hooks
└── types/              # Definiciones de tipos TypeScript
```

### Añadir Nueva Funcionalidad

1. **Fork** el repositorio
2. **Crear branch** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Desarrollar** y **testear** tu código
4. **Commit** con mensajes descriptivos (`git commit -m 'Add: nueva funcionalidad'`)
5. **Push** a tu fork (`git push origin feature/nueva-funcionalidad`)
6. **Abrir Pull Request**

## 🚀 Deployment

### Vercel (Recomendado)

1. **Conectar repositorio** en [Vercel](https://vercel.com)
2. **Configurar variables de entorno**
3. **Deploy automático** en cada push

### Alternativas

- **Netlify:** Build command: `npm run build`
- **Railway:** Auto-deploy desde GitHub
- **Docker:** Usar `Dockerfile` incluido

### Variables de Entorno de Producción

```env
NODE_ENV=production
EXTERNAL_API_BASE_URL=https://trustpilot.checkleaked.com
CACHE_TTL_SECONDS=300
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://example.com,https://another.com
```

## 🔒 Seguridad

- ✅ **Rate Limiting:** 100 requests/minuto por IP
- ✅ **CORS:** Configurado para dominios específicos
- ✅ **Input Validation:** Zod schemas para todos los parámetros
- ✅ **Error Handling:** No exposición de datos sensibles
- ✅ **Proxy Backend:** API keys protegidas del frontend

## 📊 Performance

- ⚡ **Core Web Vitals** optimizados
- 📦 **Bundle size** < 100KB gzipped
- 🚀 **First Load** < 2 segundos
- 💾 **Cache** automático (5 minutos)

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Coverage Objetivo
- **Líneas:** > 85%
- **Funciones:** > 90%
- **Componentes críticos:** 100%

## 📚 Documentación

- 📖 [Guía de Integración](docs/INTEGRATION.md)
- 🎨 [Guía de Personalización](docs/CUSTOMIZATION.md)
- 🔌 [Documentación API](docs/API.md)
- 🐛 [Troubleshooting](docs/TROUBLESHOOTING.md)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](CONTRIBUTING.md) antes de enviar PRs.

### Tipos de Contribuciones

- 🐛 **Bug fixes**
- ✨ **Nuevas funcionalidades**  
- 📚 **Documentación**
- ⚡ **Optimizaciones de performance**
- 🎨 **Mejoras de UI/UX**

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 💬 Soporte

- 🐛 **Issues:** [GitHub Issues](https://github.com/tu-usuario/trustpilot-carrousel/issues)
- 📧 **Email:** support@tu-dominio.com
- 💬 **Discord:** [Servidor de Discord](#)

## 🏆 Contributors

<a href="https://github.com/tu-usuario/trustpilot-carrousel/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=tu-usuario/trustpilot-carrousel" />
</a>

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!**
