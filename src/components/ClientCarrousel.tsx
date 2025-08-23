'use client';

import {
  NormalizedCompanyInfo,
  NormalizedReview,
  ThemeConfig,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ReviewCard } from './ReviewCard';
import { CompactRating } from './ui/StarRating';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  hideGlobalReviews: boolean;
  hideTopBanner: boolean;
}

interface ClientCarrouselProps {
  reviews: NormalizedReview[];
  company: NormalizedCompanyInfo;
  config: CarrouselConfig;
  className?: string;
}

// ============================================
// CLIENT-SIDE CARROUSEL COMPONENT
// ============================================

export function ClientCarrousel({
  reviews,
  company,
  config,
  className,
}: ClientCarrouselProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    autoplay,
    interval,
    theme,
    showRating,
    showDate,
    showAvatar,
    showReply,
    maxReviews,
    height,
    hideGlobalReviews,
    hideTopBanner,
  } = config;

  // Limit reviews to max count
  const displayReviews = reviews.slice(0, maxReviews);

  // Configure Swiper modules
  const swiperModules = [Navigation, Pagination, A11y];
  if (autoplay) {
    swiperModules.push(Autoplay);
  }

  // Theme-based styles
  const containerStyles = {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  };

  const navigationStyles = {
    '--swiper-navigation-color': theme.colors.primary,
    '--swiper-navigation-size': '24px',
  } as React.CSSProperties;

  const paginationStyles = {
    '--swiper-pagination-color': theme.colors.primary,
    '--swiper-pagination-bullet-inactive-color': theme.colors.secondary,
    '--swiper-pagination-bullet-size': '8px',
    '--swiper-pagination-bullet-horizontal-gap': '4px',
  } as React.CSSProperties;

  if (displayReviews.length === 0) {
    return (
      <div
        className={cn(
          'w-full flex items-center justify-center rounded-lg border',
          className
        )}
        style={{
          ...containerStyles,
          height: `${height}px`,
          borderColor: theme.colors.border,
        }}
      >
        <div className='text-center p-6'>
          <div className='text-2xl mb-2'>📝</div>
          <div className='text-sm font-medium mb-1'>No reviews available</div>
          <div className='text-xs opacity-75'>
            No reviews found for {company.domain}
          </div>
        </div>
      </div>
    );
  }

  // Show loading skeleton while hydrating
  if (!isClient) {
    return (
      <div
        className={cn(
          'w-full h-full relative overflow-hidden rounded-lg',
          className
        )}
        style={containerStyles}
      >
        {/* Company Header */}
        {!hideTopBanner && (
          <div
            className='px-6 py-4 border-b'
            style={{ borderColor: theme.colors.border }}
          >
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-lg font-semibold'>{company.name}</h2>
                {!hideGlobalReviews && (
                  <div className='flex items-center gap-2 text-sm opacity-75'>
                    <CompactRating
                      rating={company.average_rating}
                      size='xs'
                      theme={theme}
                    />
                    <span>•</span>
                    <span>{company.total_reviews} reviews</span>
                  </div>
                )}
              </div>
              <div className='text-xs opacity-50'>
                <a
                  href={company.trustpilot_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:underline'
                  style={{ color: theme.colors.primary }}
                >
                  View on Trustpilot
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        <div
          className='p-4 flex items-center justify-center'
          style={{
            height: hideTopBanner ? `${height}px` : `${height - 80}px`,
          }}
        >
          <div className='animate-pulse text-center'>
            <div className='text-sm opacity-60'>Loading carrousel...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full h-full relative overflow-hidden rounded-lg',
        className
      )}
      style={containerStyles}
    >
      {/* Company Header */}
      {!hideTopBanner && (
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
              {!hideGlobalReviews && (
                <div
                  className={cn(
                    'flex items-center gap-2 opacity-75',
                    height <= 220 ? 'text-xs' : 'text-sm'
                  )}
                >
                  <CompactRating
                    rating={company.average_rating}
                    size={height <= 220 ? 'xs' : 'sm'}
                    theme={theme}
                  />
                  <span>•</span>
                  <span>{company.total_reviews} reviews</span>
                </div>
              )}
            </div>
            {height > 180 && ( // Hide "View on Trustpilot" for very small heights
              <div className='text-xs opacity-50'>
                <a
                  href={company.trustpilot_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:underline'
                  style={{ color: theme.colors.primary }}
                >
                  View on Trustpilot
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews Carousel */}
      <div
        className='relative'
        style={{
          height: hideTopBanner
            ? `${height}px`
            : `${Math.max(height - (height <= 220 ? 60 : 80), 120)}px`, // Dynamic header height
          minHeight: '120px', // Minimum height for very small widgets
        }}
      >
        <Swiper
          modules={swiperModules}
          spaceBetween={16}
          slidesPerView={1}
          autoHeight={false}
          navigation={{
            enabled: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={
            autoplay
              ? {
                  delay: interval,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          loop={displayReviews.length > 1}
          speed={600}
          grabCursor={true}
          keyboard={{
            enabled: true,
          }}
          a11y={{
            prevSlideMessage: 'Previous review',
            nextSlideMessage: 'Next review',
            paginationBulletMessage: 'Go to review {{index}}',
          }}
          className='h-full swiper-equal-height'
          style={{
            ...navigationStyles,
            ...paginationStyles,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
              autoHeight: false,
            },
            768: {
              slidesPerView: Math.min(2, displayReviews.length),
              spaceBetween: 24,
              autoHeight: false,
            },
            1024: {
              slidesPerView: Math.min(3, displayReviews.length),
              spaceBetween: 32,
              autoHeight: false,
            },
          }}
        >
          {displayReviews.map(review => (
            <SwiperSlide key={review.id} className='h-full'>
              <div
                className={cn(
                  'h-full flex',
                  height <= 250 ? 'p-2' : 'p-4' // Reduce padding for small heights
                )}
              >
                <ReviewCard
                  review={review}
                  theme={theme}
                  showRating={showRating}
                  showDate={showDate}
                  showAvatar={showAvatar}
                  showReply={showReply}
                  className='flex-1 flex flex-col'
                  compact={height <= 250} // Enable compact mode for small heights
                  availableHeight={Math.max(
                    height -
                      (hideTopBanner ? 0 : height <= 220 ? 60 : 80) -
                      (height <= 250 ? 16 : 32), // Account for dynamic padding
                    100
                  )}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Footer with branding */}
      <div
        className='absolute bottom-0 right-0 px-2 py-1 text-xs opacity-40'
        style={{ color: theme.colors.textSecondary }}
      >
        <a
          href={company.trustpilot_url}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline hover:opacity-60 transition-opacity'
          style={{ color: 'inherit' }}
        >
          Powered by Trustpilot
        </a>
      </div>
    </div>
  );
}
