// Import real Trustpilot interfaces
export * from './trustpilot.interface';

import { z } from 'zod';

// ============================================
// CARROUSEL CONFIGURATION
// ============================================

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
  hideRating?: boolean;
  hideDate?: boolean;
  hideAvatar?: boolean;
  hideReply?: boolean;
  hideGlobalReviews?: boolean;
  hideTopBanner?: boolean;
  height?: number;
  width?: string | number;
  autoHeight?: boolean;
}

export const CarrouselConfigSchema = z.object({
  domain: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  autoplay: z.coerce.boolean().default(true),
  interval: z.coerce.number().min(1000).max(10000).default(5000),
  theme: z.enum(['light', 'dark']).default('light'),
  maxReviews: z.coerce.number().min(1).max(50).default(10),
  minRating: z.coerce.number().min(1).max(5).default(1),
  language: z.string().default('en'),
  hideRating: z.coerce.boolean().default(false),
  hideDate: z.coerce.boolean().default(false),
  hideAvatar: z.coerce.boolean().default(false),
  hideReply: z.coerce.boolean().default(false),
  hideGlobalReviews: z.coerce.boolean().default(false),
  hideTopBanner: z.coerce.boolean().default(false),
  height: z.coerce.number().min(200).max(800).default(400),
  sort: z.enum(['latest', 'rating']).default('latest'),
  autoHeight: z.coerce.boolean().default(false),
});

// ============================================
// THEME CONFIGURATION
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
// NORMALIZED TYPES FOR OUR CARROUSEL
// ============================================

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

// ============================================
// FETCH PARAMETERS
// ============================================

export interface FetchReviewsParams {
  domain: string;
  page?: number;
  limit?: number;
  rating?: number;
  sort?: 'latest' | 'rating';
}

// Alias for backward compatibility
export type CompanyInfo = NormalizedCompanyInfo;
