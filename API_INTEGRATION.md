# API Integration Guide - Trustpilot Reviews Carousel

## 🔌 Endpoint de Ejemplo

**URL Base:** `https://api.trustpilot.com/`

### Parámetros Soportados
```
GET /?domain=www.google.com&page=1
```

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `domain` | string | ✅ | Dominio objetivo para obtener reseñas | `www.google.com` |
| `page` | number | ❌ | Número de página (default: 1) | `1` |
| `limit` | number | ❌ | Límite de reseñas por página | `10` |
| `rating` | number | ❌ | Filtro por rating mínimo (1-5) | `4` |
| `sort` | string | ❌ | Ordenamiento (`latest`, `rating`) | `latest` |

## 📋 Estructura de Respuesta

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review_123",
        "author": {
          "name": "John Doe",
          "avatar": "https://avatar.url/image.jpg",
          "location": "New York, US"
        },
        "rating": 5,
        "title": "Excellent service!",
        "content": "I had a wonderful experience with this company...",
        "date": "2024-01-15T10:30:00Z",
        "verified": true,
        "helpful": 15,
        "reply": {
          "content": "Thank you for your review!",
          "date": "2024-01-16T09:00:00Z",
          "author": "Company Name"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_reviews": 47,
      "per_page": 10
    },
    "company": {
      "name": "Google",
      "domain": "www.google.com",
      "average_rating": 4.2,
      "total_reviews": 47,
      "trustpilot_url": "https://trustpilot.com/review/www.google.com"
    }
  },
  "cache": {
    "ttl": 300,
    "cached_at": "2024-01-15T10:30:00Z"
  }
}
```

### Respuesta de Error (400/404/500)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DOMAIN",
    "message": "The provided domain is not valid or not found on Trustpilot",
    "details": "Domain 'invalid-domain.com' could not be found"
  }
}
```

## 🛡️ Implementación del Proxy Backend

### Next.js API Route (`/api/reviews/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema de validación
const QuerySchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: z.enum(['latest', 'rating']).default('latest')
});

// Rate limiting simple (en memoria)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 100;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requests = rateLimitMap.get(ip);
  const validRequests = requests.filter((time: number) => time > windowStart);
  
  if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
}

// Cache simple en memoria
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Rate limit exceeded. Please try again later.' 
          } 
        },
        { status: 429 }
      );
    }

    // Validar parámetros
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);
    
    const validatedParams = QuerySchema.parse(queryParams);
    const { domain, page, limit, rating, sort } = validatedParams;

    // Verificar cache
    const cacheKey = `${domain}-${page}-${limit}-${rating}-${sort}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      return NextResponse.json(cachedData.data);
    }

    // Construir URL del endpoint externo
    const externalUrl = new URL('https://api.trustpilot.com/');
    externalUrl.searchParams.set('domain', domain);
    externalUrl.searchParams.set('page', page.toString());
    if (limit !== 10) externalUrl.searchParams.set('limit', limit.toString());
    if (rating) externalUrl.searchParams.set('rating', rating.toString());
    if (sort !== 'latest') externalUrl.searchParams.set('sort', sort);

    // Realizar la petición
    const response = await fetch(externalUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'TrustpilotCarrouselWidget/1.0',
        'Accept': 'application/json',
      },
      // Timeout de 10 segundos
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();

    // Validar estructura de respuesta
    if (!data.success || !data.data) {
      throw new Error('Invalid response format from external API');
    }

    // Cachear la respuesta
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error('API Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request parameters',
            details: error.errors
          }
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching reviews'
        }
      },
      { status: 500 }
    );
  }
}
```

## 🎨 Cliente Frontend (`lib/trustpilot-client.ts`)

```typescript
import { z } from 'zod';

// Types
export interface Review {
  id: string;
  author: {
    name: string;
    avatar?: string;
    location?: string;
  };
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful?: number;
  reply?: {
    content: string;
    date: string;
    author: string;
  };
}

export interface ApiResponse {
  success: boolean;
  data?: {
    reviews: Review[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_reviews: number;
      per_page: number;
    };
    company: {
      name: string;
      domain: string;
      average_rating: number;
      total_reviews: number;
      trustpilot_url: string;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface FetchReviewsParams {
  domain: string;
  page?: number;
  limit?: number;
  rating?: number;
  sort?: 'latest' | 'rating';
}

// Esquema de validación de respuesta
const ReviewSchema = z.object({
  id: z.string(),
  author: z.object({
    name: z.string(),
    avatar: z.string().optional(),
    location: z.string().optional(),
  }),
  rating: z.number().min(1).max(5),
  title: z.string(),
  content: z.string(),
  date: z.string(),
  verified: z.boolean(),
  helpful: z.number().optional(),
  reply: z.object({
    content: z.string(),
    date: z.string(),
    author: z.string(),
  }).optional(),
});

const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    reviews: z.array(ReviewSchema),
    pagination: z.object({
      current_page: z.number(),
      total_pages: z.number(),
      total_reviews: z.number(),
      per_page: z.number(),
    }),
    company: z.object({
      name: z.string(),
      domain: z.string(),
      average_rating: z.number(),
      total_reviews: z.number(),
      trustpilot_url: z.string(),
    }),
  }).optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }).optional(),
});

// Cliente para consumir la API
export class TrustpilotClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/reviews') {
    this.baseUrl = baseUrl;
  }

  async fetchReviews(params: FetchReviewsParams): Promise<ApiResponse> {
    try {
      const url = new URL(this.baseUrl, window.location.origin);
      
      // Agregar parámetros de consulta
      url.searchParams.set('domain', params.domain);
      if (params.page) url.searchParams.set('page', params.page.toString());
      if (params.limit) url.searchParams.set('limit', params.limit.toString());
      if (params.rating) url.searchParams.set('rating', params.rating.toString());
      if (params.sort) url.searchParams.set('sort', params.sort);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      // Validar respuesta
      const validatedData = ApiResponseSchema.parse(data);
      
      return validatedData;

    } catch (error) {
      console.error('TrustpilotClient Error:', error);
      
      return {
        success: false,
        error: {
          code: 'CLIENT_ERROR',
          message: 'Failed to fetch reviews',
          details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }
}

// Instance singleton
export const trustpilotClient = new TrustpilotClient();
```

## 🔐 Configuración de Seguridad

### Variables de Entorno

```env
# .env.local
TRUSTPILOT_API_KEY=your_api_key_if_needed
EXTERNAL_API_BASE_URL=https://api.trustpilot.com
CACHE_TTL_SECONDS=300
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
ALLOWED_ORIGINS=https://example.com,https://another-site.com
NODE_ENV=production
```

### Configuración CORS (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGINS || '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## 📊 Error Handling

### Códigos de Error Estándar

| Código | HTTP Status | Descripción |
|--------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Parámetros inválidos |
| `INVALID_DOMAIN` | 404 | Dominio no encontrado |
| `RATE_LIMIT_EXCEEDED` | 429 | Límite de requests excedido |
| `EXTERNAL_API_ERROR` | 502 | Error en API externa |
| `TIMEOUT` | 504 | Timeout de la petición |
| `INTERNAL_SERVER_ERROR` | 500 | Error interno del servidor |

### Manejo de Errores en Frontend

```typescript
// hooks/useReviews.ts
import { useQuery } from '@tanstack/react-query';
import { trustpilotClient } from '@/lib/trustpilot-client';

export function useReviews(params: FetchReviewsParams) {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => trustpilotClient.fetchReviews(params),
    retry: (failureCount, error: any) => {
      // No reintentar para errores 4xx
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
  });
}
```

Esta implementación proporciona una base sólida para la integración con la API de Trustpilot, incluyendo validación, cache, rate limiting y manejo robusto de errores.
