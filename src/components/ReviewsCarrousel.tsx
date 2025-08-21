import { CompanyInfo, NormalizedReview, ThemeConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import { ClientCarrousel } from './ClientCarrousel';
import { ReviewCard } from './ReviewCard';

// ============================================
// COMPONENT INTERFACES
// ============================================

interface CarrouselConfig {
  autoplay: boolean;
  interval: number;
  theme: ThemeConfig;
  showRating: boolean;
  showDate: boolean;
  showAvatar: boolean;
  showReply: boolean;
  maxReviews: number;
  height: number;
}

interface ReviewsCarrouselProps {
  reviews: NormalizedReview[];
  company: CompanyInfo;
  config: CarrouselConfig;
  className?: string;
}

// ============================================
// REVIEWS CARROUSEL COMPONENT
// ============================================

export function ReviewsCarrousel({
  reviews,
  company,
  config,
  className,
}: ReviewsCarrouselProps) {
  // For SSR, render a simple fallback, then hydrate with the interactive carrousel
  return (
    <Suspense
      fallback={
        <StaticReviewsGrid
          reviews={reviews}
          company={company}
          config={config}
          className={className}
        />
      }
    >
      <ClientCarrousel
        reviews={reviews}
        company={company}
        config={config}
        className={className}
      />
    </Suspense>
  );
}

// ============================================
// STATIC REVIEWS GRID (FALLBACK)
// ============================================

interface StaticReviewsGridProps {
  reviews: NormalizedReview[];
  company: CompanyInfo;
  config: CarrouselConfig;
  className?: string;
}

export function StaticReviewsGrid({
  reviews,
  company,
  config,
  className,
}: StaticReviewsGridProps) {
  const { theme, showRating, showDate, maxReviews, height } = config;
  const displayReviews = reviews.slice(0, maxReviews);

  const containerStyles = {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  };

  return (
    <div
      className={cn('w-full overflow-hidden rounded-lg', className)}
      style={{ ...containerStyles, height: `${height}px` }}
    >
      {/* Company Header */}
      <div
        className='px-6 py-4 border-b'
        style={{ borderColor: theme.colors.border }}
      >
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-semibold'>{company.name}</h2>
            <div className='flex items-center gap-2 text-sm opacity-75'>
              <span>⭐ {company.average_rating.toFixed(1)}</span>
              <span>•</span>
              <span>{company.total_reviews} reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div
        className='p-4 overflow-y-auto'
        style={{ height: `${height - 80}px` }}
      >
        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {displayReviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              theme={theme}
              showRating={showRating}
              showDate={showDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
