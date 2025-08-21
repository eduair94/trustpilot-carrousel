import { Suspense } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { ReviewsCarrousel } from '@/components/ReviewsCarrousel';
import { TrustpilotServerClient, getReviewsData } from '@/lib/trustpilot-server';
import { NormalizedReviewsData } from '@/lib/types';
import { CARROUSEL_CONFIG } from '@/lib/config';

// ============================================
// SEARCH PARAMS VALIDATION
// ============================================

const SearchParamsSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  page: z.coerce.number().min(1).default(1),
  autoplay: z.coerce.boolean().default(true),
  interval: z.coerce.number().min(1000).max(10000).default(5000),
  theme: z.enum(['light', 'dark']).default('light'),
  maxReviews: z.coerce.number().min(1).max(50).default(10),
  minRating: z.coerce.number().min(1).max(5).default(1),
  language: z.string().default('en'),
  showRating: z.coerce.boolean().default(true),
  showDate: z.coerce.boolean().default(true),
  height: z.coerce.number().min(200).max(800).default(400),
  sort: z.enum(['latest', 'rating']).default('latest'),
});

// ============================================
// LOADING COMPONENT
// ============================================

function CarrouselSkeleton() {
  return (
    <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading reviews...</div>
    </div>
  );
}

// ============================================
// ERROR COMPONENT
// ============================================

interface ErrorDisplayProps {
  message: string;
  theme: 'light' | 'dark';
}

function ErrorDisplay({ message, theme }: ErrorDisplayProps) {
  return (
    <div className={`w-full h-96 rounded-lg border flex items-center justify-center ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-700 text-gray-300' 
        : 'bg-gray-50 border-gray-200 text-gray-600'
    }`}>
      <div className="text-center p-6">
        <div className="text-red-500 mb-2">⚠️</div>
        <div className="text-sm font-medium mb-1">Unable to load reviews</div>
        <div className="text-xs opacity-75">{message}</div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CarrouselPage({ searchParams }: PageProps) {
  try {
    // Await searchParams as required by Next.js 15
    const searchParamsData = await searchParams;
    
    // Validate and parse search parameters
    const rawParams = Object.fromEntries(
      Object.entries(searchParamsData).map(([key, value]) => [
        key, 
        Array.isArray(value) ? value[0] : value
      ])
    );

    const validatedParams = SearchParamsSchema.parse(rawParams);
    
    // Validate domain format
    if (!TrustpilotServerClient.validateDomain(validatedParams.domain)) {
      return (
        <ErrorDisplay 
          message="Invalid domain format" 
          theme={validatedParams.theme}
        />
      );
    }

    // Get client IP for rate limiting
    const headersList = await headers();
    const clientIP = TrustpilotServerClient.getClientIP(Object.fromEntries(headersList.entries()));

    // Fetch reviews data on the server
    const reviewsData: NormalizedReviewsData | null = await getReviewsData({
      domain: validatedParams.domain,
      page: validatedParams.page,
      limit: validatedParams.maxReviews,
      sort: validatedParams.sort,
    }, clientIP);

    // Handle no data case
    if (!reviewsData || reviewsData.reviews.length === 0) {
      return (
        <ErrorDisplay 
          message={`No reviews found for ${validatedParams.domain}`}
          theme={validatedParams.theme}
        />
      );
    }

    // Configure theme
    const themeConfig = CARROUSEL_CONFIG.themes[validatedParams.theme];

    return (
      <main className="w-full h-full">
        <div 
          className="w-full"
          style={{ height: `${validatedParams.height}px` }}
        >
          <ReviewsCarrousel
            reviews={reviewsData.reviews}
            company={reviewsData.company}
            config={{
              autoplay: validatedParams.autoplay,
              interval: validatedParams.interval,
              theme: themeConfig,
              showRating: validatedParams.showRating,
              showDate: validatedParams.showDate,
              maxReviews: validatedParams.maxReviews,
              height: validatedParams.height,
            }}
          />
        </div>
      </main>
    );

  } catch (error) {
    console.error('Page Error:', error);
    
    // Get theme from params or default
    const resolvedSearchParamsForTheme = await searchParams;
    const theme = (resolvedSearchParamsForTheme.theme === 'dark' ? 'dark' : 'light') as 'light' | 'dark';
    
    if (error instanceof z.ZodError) {
      const missingDomain = error.issues.find((issue: any) => issue.path.includes('domain'));
      if (missingDomain) {
        return notFound();
      }
      
      return (
        <ErrorDisplay 
          message="Invalid configuration parameters" 
          theme={theme}
        />
      );
    }

    return (
      <ErrorDisplay 
        message="An unexpected error occurred" 
        theme={theme}
      />
    );
  }
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const domain = Array.isArray(resolvedSearchParams.domain) 
    ? resolvedSearchParams.domain[0] 
    : resolvedSearchParams.domain;
    
  if (!domain) {
    return {
      title: 'Trustpilot Reviews Carrousel',
      description: 'Display customer reviews in an elegant carousel format',
    };
  }

  return {
    title: `${domain} Reviews | Trustpilot Carrousel`,
    description: `Customer reviews for ${domain} displayed in an elegant carousel format`,
    robots: 'noindex, nofollow', // Don't index iframe content
  };
}
