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
  showAvatar?: boolean;
  showReply?: boolean;
  className?: string;
  compact?: boolean;
  availableHeight?: number; // Available height in pixels for smart content hiding
}

// ============================================
// REVIEW CARD COMPONENT
// ============================================

export function ReviewCard({
  review,
  theme,
  showRating = true,
  showDate = true,
  showAvatar = true,
  showReply = true,
  className,
  compact = false,
  availableHeight,
}: ReviewCardProps) {
  // Progressive content hiding based on available height
  const isVerySmall = availableHeight && availableHeight < 120; // Less than 120px = very aggressive hiding
  const isSmall = availableHeight && availableHeight < 150; // Less than 150px = some hiding
  const isCompact = compact || isSmall;
  
  // Determine what to hide based on available space
  const shouldHideTitle = isVerySmall;
  const shouldHideContent = isVerySmall; // Only hide content for very small heights
  const shouldHideReply = isSmall; // Hide replies for small heights
  const shouldReducePadding = isSmall; // Reduce padding for small heights
  
  const cardStyles = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    // Constrain max height based on available space to prevent cutoff
    ...(availableHeight && {
      maxHeight: `${availableHeight - 20}px`, // Leave 20px margin for padding
      minHeight: 'auto'
    })
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
        'rounded-lg border shadow-sm transition-shadow hover:shadow-md',
        'flex flex-col',
        shouldReducePadding ? 'p-2 gap-1' : 'p-4 gap-3', // Reduce padding and gap for small heights
        // Only set fixed height for normal compact mode, not when we have height constraints
        compact && !availableHeight ? 'h-[150px]' : 'h-full',
        'overflow-hidden',
        // Add explicit height constraint for very small containers
        availableHeight && availableHeight < 200 ? 'max-h-full' : '',
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

      {/* Review Title - Hide for very small heights */}
      {review.title && !shouldHideTitle && (
        <h3 className='font-semibold text-sm leading-tight break-words'>
          <span className={isCompact ? 'line-clamp-1' : 'line-clamp-2'}>
            {review.title}
          </span>
        </h3>
      )}

      {/* Review Content - Only show if we have enough space */}
      {!shouldHideContent && review.content ? (
        <div className='flex-grow overflow-hidden min-h-0'>
          <p
            className={cn(
              'text-sm leading-relaxed break-words overflow-hidden',
              isCompact ? 'line-clamp-2' : 'line-clamp-3',
              // Make content scrollable for very small heights
              isVerySmall && 'overflow-y-auto max-h-12'
            )}
            style={{
              color: theme.colors.textSecondary,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {isCompact ? truncateText(review.content, 120) : truncateText(review.content, 200)}
          </p>
        </div>
      ) : shouldHideContent ? (
        // Minimal spacer to maintain layout when content is hidden
        <div className='flex-grow min-h-0' />
      ) : (
        // Fallback if no content available
        <div className='flex-grow overflow-hidden min-h-0'>
          <p
            className='text-sm opacity-50 italic'
            style={{ color: theme.colors.textSecondary }}
          >
            No review content available
          </p>
        </div>
      )}

      {/* Author Info */}
      <footer
        className={cn(
          'flex items-center gap-3 border-t',
          shouldReducePadding ? 'pt-1' : 'pt-2'
        )}
        style={{ borderColor: theme.colors.border }}
      >
        {/* Avatar */}
        {showAvatar && (
          <div className='flex-shrink-0'>
            {review.author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.author.avatar}
                alt={`${review.author.name}'s avatar`}
                className={cn(
                  'rounded-full object-cover',
                  isVerySmall ? 'w-6 h-6' : 'w-8 h-8'
                )}
                loading='lazy'
              />
            ) : (
              <div
                className={cn(
                  'rounded-full flex items-center justify-center font-medium',
                  isVerySmall ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-xs'
                )}
                style={{
                  backgroundColor: theme.colors.primary + '20',
                  color: theme.colors.primary,
                }}
              >
                {review.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        {/* Author Details */}
        <div className='flex-grow min-w-0'>
          <p className={cn(
            'font-medium truncate',
            isVerySmall ? 'text-xs' : 'text-sm'
          )}>
            {review.author.name}
          </p>
          {review.author.location && !isVerySmall && (
            <p
              className='text-xs opacity-60 truncate'
              style={{ color: theme.colors.textSecondary }}
            >
              {review.author.location}
            </p>
          )}
        </div>

        {/* Verified Badge */}
        {review.verified && !isVerySmall && (
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

      {/* Company Reply - Only show if we have content space and reply exists */}
      {showReply && review.reply && !shouldHideReply && (
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

      {/* Helpful Counter - Hide for very small heights */}
      {(review.helpful ?? 0) > 0 && !isVerySmall && (
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

export function CompactReviewCard(props: ReviewCardProps) {
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
