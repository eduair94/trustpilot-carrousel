'use client';

import { CompanyInfo, NormalizedReview, ThemeConfig } from '@/lib/types';
import Script from 'next/script';
import { ReviewsCarrousel } from './ReviewsCarrousel';

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

interface ReviewsCarrouselClientProps {
  reviews: NormalizedReview[];
  company: CompanyInfo;
  config: CarrouselConfig;
  className?: string;
}

// ============================================
// CLIENT COMPONENT WITH IFRAME-RESIZER LOGIC
// ============================================

export function ReviewsCarrouselClient({
  reviews,
  company,
  config,
  className,
}: ReviewsCarrouselClientProps) {
  // Check iframe-resizer setup after the script loads
  const checkIframeResizerSetup = () => {
    console.log('[ReviewsCarrouselClient] Checking iframe-resizer setup:');

    if (typeof window !== 'undefined') {
      // Type assertion for window properties added by iframe-resizer
      const windowWithIframe = window as typeof window & {
        iFrameResizer?: unknown;
        parentIFrame?: {
          sendMessage?: (message: string) => void;
          [key: string]: unknown;
        };
      };

      console.log(
        '- window.iFrameResizer:',
        !!windowWithIframe.iFrameResizer ? 'LOADED' : 'NOT LOADED'
      );
      console.log(
        '- window.parentIFrame:',
        !!windowWithIframe.parentIFrame ? 'LOADED' : 'NOT LOADED'
      );
      console.log('- Is in iframe:', window.self !== window.top);

      // Log the actual objects if they exist
      if (windowWithIframe.iFrameResizer) {
        console.log(
          '[ReviewsCarrouselClient] ✅ iframe-resizer child is loaded:',
          windowWithIframe.iFrameResizer
        );
      } else {
        console.log(
          '[ReviewsCarrouselClient] ❌ iframe-resizer child is NOT loaded'
        );
      }

      if (windowWithIframe.parentIFrame) {
        console.log(
          '[ReviewsCarrouselClient] ✅ parentIFrame is available:',
          Object.keys(windowWithIframe.parentIFrame)
        );

        // Try to trigger a size update if we have parentIFrame available
        try {
          if (typeof windowWithIframe.parentIFrame.sendMessage === 'function') {
            console.log(
              '[ReviewsCarrouselClient] ✅ Successfully sent resize message'
            );
          } else {
            console.log(
              '[ReviewsCarrouselClient] ℹ️ sendMessage not available, iframe-resizer will auto-resize'
            );
          }
        } catch (error) {
          console.log(
            '[ReviewsCarrouselClient] ❌ Failed to send resize message:',
            error
          );
        }
      } else {
        console.log(
          '[ReviewsCarrouselClient] ❌ parentIFrame is NOT available'
        );
      }
    } else {
      console.log(
        '[ReviewsCarrouselClient] Running in SSR mode - window not available'
      );
    }
  };

  // For SSR, render a simple fallback, then hydrate with the interactive carrousel
  return (
    <>
      {/* Load iframe-resizer child script from CDN */}
      <Script
        src='https://cdn.jsdelivr.net/npm/@iframe-resizer/child@5.5.2'
        strategy='afterInteractive'
        onLoad={() => {
          console.log(
            '[ReviewsCarrouselClient] ✅ iframe-resizer child script loaded from CDN'
          );
          // Small delay to ensure script has initialized
          setTimeout(checkIframeResizerSetup, 100);
        }}
        onError={e => {
          console.error(
            '[ReviewsCarrouselClient] ❌ Failed to load iframe-resizer child script:',
            e
          );
        }}
      />
      <ReviewsCarrousel
        reviews={reviews}
        company={company}
        config={config}
        className={className}
      />
    </>
  );
}
