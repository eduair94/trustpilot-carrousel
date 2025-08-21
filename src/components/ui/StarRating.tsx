'use client';

import { ThemeConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import React from 'react';

// ============================================
// STAR ICON COMPONENT
// ============================================

interface StarIconProps {
  filled?: boolean;
  size?: number;
  color?: string;
  emptyColor?: string;
  className?: string;
}

const StarIcon: React.FC<StarIconProps> = ({
  filled = false,
  size = 16,
  color = '#ffc107',
  emptyColor = '#e5e7eb',
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill={filled ? color : emptyColor}
      className={cn('flex-shrink-0', className)}
      aria-hidden='true'
    >
      <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
    </svg>
  );
};

// ============================================
// STAR RATING COMPONENT
// ============================================

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showValue?: boolean;
  showOutOf?: boolean;
  theme?: ThemeConfig;
  className?: string;
  precision?: 'full' | 'half';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  showOutOf = false,
  theme,
  className,
  precision = 'full',
  interactive = false,
  onChange,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  };

  const iconSize = sizes[size];
  const starColor = theme?.colors.star || '#ffc107';
  const emptyColor = theme?.colors.starEmpty || '#e5e7eb';

  const handleMouseEnter = (starIndex: number) => {
    if (interactive) {
      setHoverRating(starIndex + 1);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const handleClick = (starIndex: number) => {
    if (interactive && onChange) {
      onChange(starIndex + 1);
    }
  };

  const renderStar = (starIndex: number) => {
    const currentRating = interactive ? hoverRating || rating : rating;

    let filled = false;
    if (precision === 'half') {
      filled = currentRating >= starIndex + 0.5;
    } else {
      filled = currentRating > starIndex;
    }

    return (
      <button
        key={starIndex}
        type='button'
        className={cn(
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          interactive
            ? 'cursor-pointer hover:scale-110 transition-transform'
            : 'cursor-default',
          interactive && 'focus-visible:ring-blue-500'
        )}
        disabled={!interactive}
        onMouseEnter={() => handleMouseEnter(starIndex)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(starIndex)}
        aria-label={`Rate ${starIndex + 1} out of ${maxRating} stars`}
        tabIndex={interactive ? 0 : -1}
      >
        <StarIcon
          filled={filled}
          size={iconSize}
          color={starColor}
          emptyColor={emptyColor}
        />
      </button>
    );
  };

  const displayRating = Math.round(rating * 10) / 10; // Round to 1 decimal

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role='img'
      aria-label={`Rating: ${displayRating} out of ${maxRating} stars`}
    >
      <div className='flex items-center'>
        {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
      </div>

      {(showValue || showOutOf) && (
        <span
          className={cn(
            'ml-1 font-medium',
            size === 'xs' && 'text-xs',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-sm',
            size === 'lg' && 'text-base',
            size === 'xl' && 'text-lg'
          )}
        >
          {showValue && displayRating}
          {showValue && showOutOf && '/'}
          {showOutOf && maxRating}
        </span>
      )}
    </div>
  );
};

// ============================================
// COMPACT RATING COMPONENT
// ============================================

interface CompactRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'xs' | 'sm' | 'md';
  theme?: ThemeConfig;
  className?: string;
}

const CompactRating: React.FC<CompactRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'sm',
  theme,
  className,
}) => {
  const iconSize = size === 'xs' ? 12 : size === 'sm' ? 14 : 16;
  const starColor = theme?.colors.star || '#ffc107';
  const displayRating = Math.round(rating * 10) / 10;

  return (
    <div
      className={cn('inline-flex items-center gap-1', className)}
      role='img'
      aria-label={`Rating: ${displayRating} out of ${maxRating} stars`}
    >
      <StarIcon filled={true} size={iconSize} color={starColor} />
      <span
        className={cn(
          'font-medium',
          size === 'xs' && 'text-xs',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base'
        )}
      >
        {displayRating}
      </span>
    </div>
  );
};

// ============================================
// RATING DISTRIBUTION COMPONENT
// ============================================

interface RatingDistributionProps {
  distribution: Record<number, number>;
  totalReviews: number;
  maxRating?: number;
  theme?: ThemeConfig;
  className?: string;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({
  distribution,
  totalReviews,
  maxRating = 5,
  theme,
  className,
}) => {
  const starColor = theme?.colors.star || '#ffc107';

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const stars = maxRating - index;
        const count = distribution[stars] || 0;
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        return (
          <div key={stars} className='flex items-center gap-2 text-sm'>
            <span className='w-3 text-right font-medium'>{stars}</span>
            <StarIcon size={12} filled color={starColor} />
            <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-yellow-400 transition-all duration-300'
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className='w-10 text-right text-gray-600'>{count}</span>
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// EXPORTS
// ============================================

export { CompactRating, RatingDistribution, StarIcon, StarRating };
export type {
  CompactRatingProps,
  RatingDistributionProps,
  StarIconProps,
  StarRatingProps,
};
