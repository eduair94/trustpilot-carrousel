'use client';

import { CompanyInfo, NormalizedReview, ThemeConfig } from '@/lib/types';
import { useEffect } from 'react';
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
  hideGlobalReviews: boolean;
  hideTopBanner: boolean;
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  surfaceColor?: string;
  borderColor?: string;
  starColor?: string;
  transparent?: boolean;
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
  // Check iframe-resizer setup - this runs on the client
  useEffect(() => {
    // Dynamically import the iframe-resizer child to avoid SSR issues
    const loadIframeResizerChild = async () => {
      try {
        console.log('[ReviewsCarrouselClient] Loading iframe-resizer child...');
        await import('@iframe-resizer/child');
        console.log(
          '[ReviewsCarrouselClient] ✅ iframe-resizer child loaded successfully'
        );

        // Give the iframe-resizer child a moment to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log(
          '- window.iFrameResizer:',
          !!window.iFrameResizer ? 'LOADED' : 'NOT LOADED'
        );
        console.log(
          '- window.parentIFrame:',
          !!window.parentIFrame ? 'LOADED' : 'NOT LOADED'
        );
        console.log('- Is in iframe:', window.self !== window.top);

        // Log the actual objects if they exist
        if (window.iFrameResizer) {
          console.log(
            '[ReviewsCarrouselClient] ✅ iframe-resizer child is loaded:',
            window.iFrameResizer
          );
        } else {
          console.log(
            '[ReviewsCarrouselClient] ❌ iframe-resizer child is NOT loaded'
          );
        }

        if (window.parentIFrame) {
          console.log(
            '[ReviewsCarrouselClient] ✅ parentIFrame is available:',
            Object.keys(window.parentIFrame)
          );

          // Try to trigger a size update if we have parentIFrame available
          try {
            if (typeof window.parentIFrame.sendMessage === 'function') {
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
      } catch (error) {
        console.error(
          '[ReviewsCarrouselClient] ❌ Failed to load iframe-resizer child:',
          error
        );
      }
    };

    console.log('[ReviewsCarrouselClient] Checking iframe-resizer setup:');

    if (typeof window !== 'undefined') {
      // Load the child script first
      loadIframeResizerChild();
    } else {
      console.log(
        '[ReviewsCarrouselClient] Running in SSR mode - window not available'
      );
    }
  }, []);

  // For SSR, render a simple fallback, then hydrate with the interactive carrousel
  return (
    <ReviewsCarrousel
      reviews={reviews}
      company={company}
      config={config}
      className={className}
    />
  );
}
