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

        {/* Loading skeleton */}
        <div
          className='p-4 flex items-center justify-center'
          style={{ height: `${height - 80}px` }}
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

      {/* Reviews Carousel */}
      <div
        className='relative'
        style={{ height: `${height - 80}px` }} // Subtract header height
      >
        <Swiper
          modules={swiperModules}
          spaceBetween={16}
          slidesPerView={1}
          autoHeight={true}
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
          className='h-full'
          style={{
            ...navigationStyles,
            ...paginationStyles,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
              autoHeight: true,
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
              <div className='p-4 h-full'>
                <ReviewCard
                  review={review}
                  theme={theme}
                  showRating={showRating}
                  showDate={showDate}
                  showAvatar={showAvatar}
                  showReply={showReply}
                  className='h-full'
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
        Powered by Trustpilot
      </div>
    </div>
  );
}
