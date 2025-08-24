import { z } from 'zod';

// ============================================
// REVIEW TYPES
// ============================================

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

export interface Company {
  name: string;
  domain: string;
  average_rating: number;
  total_reviews: number;
  trustpilot_url: string;
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  total_reviews: number;
  per_page: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse {
  success: boolean;
  data?: {
    reviews: Review[];
    pagination: Pagination;
    company: Company;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  cache?: {
    ttl: number;
    cached_at: string;
  };
}

// Import real Trustpilot interfaces
export * from './trustpilot.interface';

// Our internal types for the carrousel
export interface CarrouselConfig {
  domain: string;
  page?: number;
  autoplay?: boolean;
  interval?: number;
  theme?: 'light' | 'dark';
  maxReviews?: number;
  minRating?: number;
  language?: string;
  showRating?: boolean;
  showDate?: boolean;
  showAvatar?: boolean;
  showReply?: boolean;
  height?: number;
  width?: string | number;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    warning: string;
    success: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    star: string;
    starEmpty: string;
  };
  typography: {
    fontFamily: string;
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// Normalized review interface for our carrousel
export interface NormalizedReview {
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

// Normalized company info
export interface NormalizedCompanyInfo {
  name: string;
  domain: string;
  average_rating: number;
  total_reviews: number;
  trustpilot_url: string;
}

// Normalized data structure
export interface NormalizedReviewsData {
  reviews: NormalizedReview[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_reviews: number;
    per_page: number;
  };
  company: NormalizedCompanyInfo;
}

export interface FetchReviewsParams {
  domain: string;
  page?: number;
  limit?: number;
  rating?: number;
  sort?: 'latest' | 'rating';
}

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const ReviewSchema = z.object({
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

export const CompanySchema = z.object({
  name: z.string(),
  domain: z.string(),
  average_rating: z.number(),
  total_reviews: z.number(),
  trustpilot_url: z.string(),
});

export const PaginationSchema = z.object({
  current_page: z.number(),
  total_pages: z.number(),
  total_reviews: z.number(),
  per_page: z.number(),
});

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    reviews: z.array(ReviewSchema),
    pagination: PaginationSchema,
    company: CompanySchema,
  }).optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }).optional(),
  cache: z.object({
    ttl: z.number(),
    cached_at: z.string(),
  }).optional(),
});

export const CarrouselConfigSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  page: z.coerce.number().min(1).default(1),
  autoplay: z.coerce.boolean().default(true),
  interval: z.coerce.number().min(1000).max(30000).default(5000),
  theme: z.enum(['light', 'dark']).default('light'),
  maxReviews: z.coerce.number().min(1).max(50).default(10),
  minRating: z.coerce.number().min(1).max(5).default(1),
  language: z.string().default('en'),
  showRating: z.coerce.boolean().default(true),
  showDate: z.coerce.boolean().default(true),
  showAvatar: z.coerce.boolean().default(true),
  showReply: z.coerce.boolean().default(true),
  height: z.coerce.number().min(200).max(800).default(400),
  width: z.union([z.string(), z.number()]).default('100%'),
});

export const FetchReviewsParamsSchema = z.object({
  domain: z.string().min(1),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  rating: z.coerce.number().min(1).max(5).optional(),
  sort: z.enum(['latest', 'rating']).default('latest'),
});

// ============================================
// ERROR TYPES
// ============================================

export interface ApiError extends Error {
  code: string;
  status?: number;
  details?: unknown;
}

export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_DOMAIN: 'INVALID_DOMAIN',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  TIMEOUT: 'TIMEOUT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export type ApiErrorCode = keyof typeof API_ERROR_CODES;

// ============================================
// THEME TYPES
// ============================================

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    warning: string;
    success: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    star: string;
    starEmpty: string;
  };
  typography: {
    fontFamily: string;
    sizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface ReviewCardProps {
  review: Review;
  config: CarrouselConfig;
  theme: ThemeConfig;
}

export interface ReviewsCarrouselProps {
  config: CarrouselConfig;
}

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  theme: ThemeConfig;
}

// ============================================
// UTILITY TYPES
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingState {
  status: Status;
  error?: string | null;
}
