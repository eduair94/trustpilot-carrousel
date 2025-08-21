import { NormalizedReview, ThemeConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { StarRating } from './ui/StarRating';

// ============================================
// COMPONENT INTERFACES
// ============================================

interface ReviewCardProps {
  review: NormalizedReview;
  theme: ThemeConfig;
  showRating?: boolean;
  showDate?: boolean;
  className?: string;
  compact?: boolean;
}

// ============================================
// REVIEW CARD COMPONENT
// ============================================

export function ReviewCard({
  review,
  theme,
  showRating = true,
  showDate = true,
  className,
  compact = false,
}: ReviewCardProps) {
  const cardStyles = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text;

    // Find last space within acceptable range to avoid breaking words
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    // If we have a good breaking point (not too early), use it
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }

    // Otherwise, just truncate and add ellipsis
    return truncated.trim() + '...';
  };

  return (
    <article
      className={cn(
        'p-4 rounded-lg border shadow-sm transition-shadow hover:shadow-md',
        'flex flex-col gap-3',
        compact ? 'min-h-[150px]' : 'min-h-[180px] max-h-[400px]',
        'overflow-hidden',
        className
      )}
      style={cardStyles}
    >
      {/* Header: Rating & Date */}
      <header className='flex items-start justify-between gap-2'>
        {showRating && (
          <StarRating
            rating={review.rating}
            size='sm'
            theme={theme}
            className='flex-shrink-0'
          />
        )}

        {showDate && (
          <time
            className='text-xs opacity-60 flex-shrink-0'
            dateTime={review.date}
            style={{ color: theme.colors.textSecondary }}
          >
            {formatDate(review.date)}
          </time>
        )}
      </header>

      {/* Review Title */}
      {review.title && (
        <h3 className='font-semibold text-sm leading-tight break-words'>
          <span className={compact ? 'line-clamp-1' : 'line-clamp-2'}>
            {review.title}
          </span>
        </h3>
      )}

      {/* Review Content */}
      <div className='flex-grow overflow-hidden'>
        <p
          className={cn(
            'text-sm leading-relaxed break-words overflow-hidden',
            compact ? 'line-clamp-3' : 'line-clamp-5'
          )}
          style={{
            color: theme.colors.textSecondary,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {compact ? truncateText(review.content, 200) : review.content}
        </p>
      </div>

      {/* Author Info */}
      <footer
        className='flex items-center gap-3 pt-2 border-t'
        style={{ borderColor: theme.colors.border }}
      >
        {/* Avatar */}
        <div className='flex-shrink-0'>
          {review.author.avatar ? (
            <img
              src={review.author.avatar}
              alt={`${review.author.name}'s avatar`}
              className='w-8 h-8 rounded-full object-cover'
              loading='lazy'
            />
          ) : (
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium'
              style={{
                backgroundColor: theme.colors.primary + '20',
                color: theme.colors.primary,
              }}
            >
              {review.author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Author Details */}
        <div className='flex-grow min-w-0'>
          <p className='font-medium text-sm truncate'>{review.author.name}</p>
          {review.author.location && (
            <p
              className='text-xs opacity-60 truncate'
              style={{ color: theme.colors.textSecondary }}
            >
              {review.author.location}
            </p>
          )}
        </div>

        {/* Verified Badge */}
        {review.verified && (
          <div
            className='flex-shrink-0 px-2 py-1 rounded text-xs font-medium'
            style={{
              backgroundColor: theme.colors.success + '20',
              color: theme.colors.success || '#10b981',
            }}
            title='Verified purchase'
          >
            ✓ Verified
          </div>
        )}
      </footer>

      {/* Company Reply */}
      {review.reply && (
        <div
          className='mt-3 p-3 rounded-md border-l-4 overflow-hidden'
          style={{
            backgroundColor: theme.colors.background,
            borderLeftColor: theme.colors.primary,
          }}
        >
          <div className='flex items-center gap-2 mb-2'>
            <span
              className='text-xs font-medium'
              style={{ color: theme.colors.primary }}
            >
              {review.reply.author} replied
            </span>
            <time
              className='text-xs opacity-60'
              dateTime={review.reply.date}
              style={{ color: theme.colors.textSecondary }}
            >
              {formatDate(review.reply.date)}
            </time>
          </div>
          <p
            className={cn(
              'text-sm break-words',
              compact ? 'line-clamp-2' : 'line-clamp-3'
            )}
            style={{
              color: theme.colors.textSecondary,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {compact
              ? truncateText(review.reply.content, 120)
              : review.reply.content}
          </p>
        </div>
      )}

      {/* Helpful Counter */}
      {(review.helpful ?? 0) > 0 && (
        <div className='flex items-center gap-1 text-xs opacity-60'>
          <span>👍</span>
          <span>{review.helpful} found this helpful</span>
        </div>
      )}
    </article>
  );
}

// ============================================
// COMPACT REVIEW CARD
// ============================================

interface CompactReviewCardProps extends Omit<ReviewCardProps, 'compact'> {}

export function CompactReviewCard(props: CompactReviewCardProps) {
  return <ReviewCard {...props} compact={true} />;
}

// ============================================
// REVIEW CARD SKELETON
// ============================================

interface ReviewCardSkeletonProps {
  theme: ThemeConfig;
  className?: string;
}

export function ReviewCardSkeleton({
  theme,
  className,
}: ReviewCardSkeletonProps) {
  const cardStyles = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg border animate-pulse',
        'flex flex-col gap-3 min-h-[200px]',
        className
      )}
      style={cardStyles}
    >
      {/* Header Skeleton */}
      <div className='flex items-start justify-between gap-2'>
        <div
          className='h-4 w-20 rounded'
          style={{ backgroundColor: theme.colors.border }}
        />
        <div
          className='h-3 w-16 rounded'
          style={{ backgroundColor: theme.colors.border }}
        />
      </div>

      {/* Title Skeleton */}
      <div
        className='h-4 w-3/4 rounded'
        style={{ backgroundColor: theme.colors.border }}
      />

      {/* Content Skeleton */}
      <div className='space-y-2 flex-grow'>
        <div
          className='h-3 w-full rounded'
          style={{ backgroundColor: theme.colors.border }}
        />
        <div
          className='h-3 w-5/6 rounded'
          style={{ backgroundColor: theme.colors.border }}
        />
        <div
          className='h-3 w-4/5 rounded'
          style={{ backgroundColor: theme.colors.border }}
        />
      </div>

      {/* Footer Skeleton */}
      <div
        className='flex items-center gap-3 pt-2 border-t'
        style={{ borderColor: theme.colors.border }}
      >
        <div
          className='w-8 h-8 rounded-full'
          style={{ backgroundColor: theme.colors.border }}
        />
        <div className='flex-grow space-y-1'>
          <div
            className='h-3 w-24 rounded'
            style={{ backgroundColor: theme.colors.border }}
          />
          <div
            className='h-2 w-16 rounded'
            style={{ backgroundColor: theme.colors.border }}
          />
        </div>
      </div>
    </div>
  );
}
