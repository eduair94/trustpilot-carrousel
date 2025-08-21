# Investigación de Librerías - Trustpilot Carrousel

## 🎠 Librerías de Carrousel Evaluadas

### 1. Swiper.js ⭐ **RECOMENDADO**

**Pros:**
- ✅ Soporte nativo para React (`swiper/react`)
- ✅ TypeScript support completo
- ✅ Touch gestures optimizados
- ✅ Lazy loading incorporado
- ✅ Altamente customizable
- ✅ Bundle size razonable (~45KB)
- ✅ Excelente performance
- ✅ Auto-height y responsive
- ✅ Autoplay con pausado en hover
- ✅ Documentación excelente

**Contras:**
- ❌ Learning curve inicial
- ❌ Muchas opciones pueden ser overwhelming

**Instalación:**
```bash
npm install swiper
```

**Uso Básico:**
```tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';

<Swiper
  modules={[Navigation, Pagination, Autoplay]}
  spaceBetween={50}
  slidesPerView={1}
  autoplay={{ delay: 3000 }}
  navigation
  pagination={{ clickable: true }}
>
  <SwiperSlide>Slide 1</SwiperSlide>
  <SwiperSlide>Slide 2</SwiperSlide>
</Swiper>
```

### 2. Embla Carousel

**Pros:**
- ✅ Muy ligero (~12KB)
- ✅ TypeScript nativo
- ✅ API moderna y limpia
- ✅ Plugins modulares
- ✅ Excelente performance
- ✅ Framework agnostic

**Contras:**
- ❌ Menos opciones out-of-the-box
- ❌ Requiere más configuración manual
- ❌ Documentación menos extensa

**Instalación:**
```bash
npm install embla-carousel embla-carousel-react
```

### 3. React Slick

**Pros:**
- ✅ Ampliamente adoptado
- ✅ Muchos ejemplos disponibles
- ✅ Configuración simple

**Contras:**
- ❌ Bundle size grande (~60KB+)
- ❌ Basado en jQuery (slick-carousel)
- ❌ Performance inferior
- ❌ TypeScript support limitado
- ❌ Menos mantenido recientemente

### 4. Keen Slider

**Pros:**
- ✅ Muy ligero (~12KB)
- ✅ TypeScript support
- ✅ Good performance
- ✅ Plugin system

**Contras:**
- ❌ Comunidad más pequeña
- ❌ Menos features built-in

## 🎨 Librerías de UI Components

### 1. Headless UI ⭐ **RECOMENDADO**

**Pros:**
- ✅ Oficial de Tailwind
- ✅ Completamente unstyled
- ✅ Excelente accesibilidad
- ✅ TypeScript support
- ✅ Muy ligero

```bash
npm install @headlessui/react
```

### 2. Radix UI

**Pros:**
- ✅ Excelente accesibilidad
- ✅ Primitives approach
- ✅ TypeScript support
- ✅ Highly customizable

```bash
npm install @radix-ui/react-dialog @radix-ui/react-tooltip
```

## 🎭 Librerías de Animación

### 1. Framer Motion ⭐ **RECOMENDADO**

**Pros:**
- ✅ API declarativa
- ✅ Excelente performance
- ✅ Layout animations
- ✅ Gesture support
- ✅ TypeScript support

```bash
npm install framer-motion
```

**Uso:**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### 2. React Spring

**Pros:**
- ✅ Spring-based animations
- ✅ Hook-based API
- ✅ Good performance

## 🎯 Estado Management

### 1. Zustand ⭐ **RECOMENDADO para este proyecto**

**Pros:**
- ✅ Muy simple y ligero
- ✅ TypeScript first
- ✅ No boilerplate
- ✅ Perfecto para casos simples

```bash
npm install zustand
```

**Uso:**
```tsx
import { create } from 'zustand'

interface ReviewsStore {
  reviews: Review[]
  loading: boolean
  setReviews: (reviews: Review[]) => void
}

const useReviewsStore = create<ReviewsStore>((set) => ({
  reviews: [],
  loading: false,
  setReviews: (reviews) => set({ reviews }),
}))
```

### 2. React Query / TanStack Query

**Pros:**
- ✅ Excelente para data fetching
- ✅ Cache management
- ✅ Background updates
- ✅ Error handling

```bash
npm install @tanstack/react-query
```

## 🛠️ Utilidades

### 1. Clsx / CN ⭐ **RECOMENDADO**

```bash
npm install clsx
# o
npm install class-variance-authority
```

**Uso:**
```tsx
import clsx from 'clsx'

const className = clsx(
  'base-class',
  {
    'active': isActive,
    'disabled': isDisabled
  }
)
```

### 2. Date Formatting

**Opción 1: date-fns** (Ligera, modular)
```bash
npm install date-fns
```

**Opción 2: Day.js** (API como Moment.js, más ligero)
```bash
npm install dayjs
```

### 3. Validación

**Zod** ⭐ **RECOMENDADO**
```bash
npm install zod
```

```tsx
import { z } from 'zod'

const ConfigSchema = z.object({
  domain: z.string().url(),
  page: z.number().min(1).default(1),
  autoplay: z.boolean().default(true),
  theme: z.enum(['light', 'dark']).default('light')
})
```

## 📦 Recomendación Final de Dependencias

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "swiper": "^11.0.0",
    "framer-motion": "^10.0.0",
    "@headlessui/react": "^1.7.0",
    "clsx": "^2.0.0",
    "zod": "^3.22.0",
    "zustand": "^4.4.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "prettier": "^3.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0",
    "playwright": "^1.40.0"
  }
}
```

## 💡 Consideraciones de Performance

### Bundle Size Optimization
- **Tree shaking:** Importar solo módulos necesarios
- **Code splitting:** Dynamic imports para Swiper
- **Lazy loading:** Imágenes y componentes

### Runtime Performance
- **Virtualization:** Para muchas reseñas (opcional)
- **Memoization:** React.memo para ReviewCard
- **Debouncing:** Para parámetros dinámicos

## 🎯 Decisión Final

**Stack Recomendado:**
- **Carrousel:** Swiper.js
- **UI Components:** Headless UI
- **Animations:** Framer Motion
- **State:** Zustand
- **Styling:** Tailwind CSS
- **Validation:** Zod

Esta combinación ofrece el mejor balance entre funcionalidad, performance, y developer experience para el proyecto.
