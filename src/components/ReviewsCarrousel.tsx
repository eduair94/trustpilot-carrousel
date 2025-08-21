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
  const {
    theme,
    showRating,
    showDate,
    showAvatar,
    showReply,
    maxReviews,
    height,
  } = config;
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
        className={cn(
          'border-b',
          height <= 220 ? 'px-3 py-2' : 'px-6 py-4' // Compact header for small heights
        )}
        style={{ borderColor: theme.colors.border }}
      >
        <div className='flex items-center justify-between'>
          <div>
            <h2
              className={cn(
                'font-semibold',
                height <= 220 ? 'text-base' : 'text-lg'
              )}
            >
              {company.name}
            </h2>
            <div
              className={cn(
                'flex items-center gap-2 opacity-75',
                height <= 220 ? 'text-xs' : 'text-sm'
              )}
            >
              <span>⭐ {company.average_rating.toFixed(1)}</span>
              <span>•</span>
              <span>{company.total_reviews} reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div
        className={cn(
          'overflow-y-auto',
          height <= 250 ? 'p-2' : 'p-4' // Reduce padding for small heights
        )}
        style={{ height: `${height - (height <= 220 ? 60 : 80)}px` }}
      >
        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {displayReviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              theme={theme}
              showRating={showRating}
              showDate={showDate}
              showAvatar={showAvatar}
              showReply={showReply}
              availableHeight={
                height - (height <= 220 ? 60 : 80) - (height <= 250 ? 16 : 32)
              } // Dynamic available height accounting for padding
            />
          ))}
        </div>
      </div>
    </div>
  );
}
