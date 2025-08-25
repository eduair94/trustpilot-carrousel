import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TrustpilotIframeProps } from './types';
import {
  buildIframeUrl,
  generateIframeId,
  mergeConfig,
  validateDomain,
} from './utils';

// Declare global iframe resizer - it will be loaded from CDN
declare global {
  interface Window {
    iframeResize?: (
      options: {
        log?: boolean;
        checkOrigin?: boolean;
        resizeFrom?: 'parent' | 'child';
        autoResize?: boolean;
        bodyPadding?: number;
        bodyMargin?: number;
        heightCalculationMethod?: string;
        widthCalculationMethod?: string;
        tolerance?: number;
        onInit?: () => void;
        onResized?: (data: {
          width: number;
          height: number;
          type?: string;
        }) => void;
        onMessage?: (data: { message: string; messageData?: string }) => void;
      },
      target: string | HTMLElement
    ) => Array<{ close: () => void }>;
  }
}

/**
 * React component for Trustpilot iframe widget with automatic resizing
 */
export const TrustpilotIframe: React.FC<TrustpilotIframeProps> = ({
  domain,
  title = 'Trustpilot Reviews',
  loading = <div>Loading reviews...</div>,
  error,
  onReady,
  onResize,
  onError,
  className,
  style,
  ...config
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<Array<{ close: () => void }> | null>(null);
  const iframeIdRef = useRef<string>(generateIframeId());

  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Merge config with defaults
  const mergedConfig = mergeConfig({ domain, ...config });

  // Validate domain
  const isValidDomain = validateDomain(domain);

  // Load iframe resizer script
  const loadIframeResizer = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // Check if already loaded
      if (window.iframeResize) {
        resolve();
        return;
      }

      // Load from CDN
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.5.3/index.umd.js';
      script.async = true;
      script.onload = () => {
        if (window.iframeResize) {
          resolve();
        } else {
          reject(new Error('Failed to load iframe resizer'));
        }
      };
      script.onerror = () =>
        reject(new Error('Failed to load iframe resizer script'));
      document.head.appendChild(script);
    });
  }, []);

  // Handle iframe load
  const handleIframeLoad = useCallback(async () => {
    setIsLoading(false);

    if (!isValidDomain) {
      const errorMsg = `Invalid domain: ${domain}`;
      setErrorState(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // Initialize iframe resizer
    if (iframeRef.current && !resizerRef.current) {
      try {
        await loadIframeResizer();

        if (window.iframeResize && iframeRef.current) {
          const resizer = window.iframeResize(
            {
              log: process.env.NODE_ENV === 'development',
              checkOrigin: false,
              resizeFrom: 'child',
              autoResize: true,
              bodyPadding: 0,
              bodyMargin: 0,
              heightCalculationMethod: 'bodyScroll',
              widthCalculationMethod: 'scroll',
              tolerance: 5,
              onInit: () => {
                setIsReady(true);
                onReady?.();
              },
              onResized: (data: {
                width: number;
                height: number;
                type?: string;
              }) => {
                onResize?.({
                  width: data.width,
                  height: data.height,
                });
              },
              onMessage: (data: { message: string; messageData?: string }) => {
                if (data.message === 'error') {
                  const errorMsg = data.messageData || 'Unknown error occurred';
                  setErrorState(errorMsg);
                  onError?.(errorMsg);
                }
              },
            },
            iframeRef.current
          );

          resizerRef.current = resizer;
        }
      } catch (err) {
        const errorMsg = `Failed to initialize iframe resizer: ${err instanceof Error ? err.message : 'Unknown error'}`;
        setErrorState(errorMsg);
        onError?.(errorMsg);
      }
    }
  }, [domain, isValidDomain, onReady, onError, onResize, loadIframeResizer]);

  // Handle iframe error
  const handleIframeError = useCallback(() => {
    const errorMsg = 'Failed to load iframe content';
    setIsLoading(false);
    setErrorState(errorMsg);
    onError?.(errorMsg);
  }, [onError]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (resizerRef.current && Array.isArray(resizerRef.current)) {
        resizerRef.current.forEach(resizer => {
          if (resizer && typeof resizer.close === 'function') {
            resizer.close();
          }
        });
      }
      resizerRef.current = null;
    };
  }, []);

  // Update iframe src when config changes
  useEffect(() => {
    if (iframeRef.current && isValidDomain) {
      const newSrc = buildIframeUrl(mergedConfig);
      if (iframeRef.current.src !== newSrc) {
        setIsLoading(true);
        setErrorState(null);
        setIsReady(false);
        iframeRef.current.src = newSrc;
      }
    }
  }, [mergedConfig, isValidDomain]);

  // Early return for invalid domain
  if (!isValidDomain) {
    const errorMsg = `Invalid domain: ${domain}`;
    const errorContent = typeof error === 'function' ? error(errorMsg) : error;
    return (
      <div
        className={`trustpilot-iframe-error ${className || ''}`}
        style={style}
      >
        {errorContent || (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
            }}
          >
            <strong>Error:</strong> {errorMsg}
          </div>
        )}
      </div>
    );
  }

  // Build iframe URL
  const iframeUrl = buildIframeUrl(mergedConfig);

  return (
    <div
      ref={containerRef}
      className={`trustpilot-iframe-container ${className || ''}`}
      style={style}
    >
      {/* Loading state */}
      {isLoading && !errorState && (
        <div className='trustpilot-iframe-loading'>{loading}</div>
      )}

      {/* Error state */}
      {errorState && (
        <div className='trustpilot-iframe-error'>
          {typeof error === 'function'
            ? error(errorState)
            : error || (
                <div
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#dc3545',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                  }}
                >
                  <strong>Error:</strong> {errorState}
                </div>
              )}
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        id={iframeIdRef.current}
        src={iframeUrl}
        title={title}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        style={{
          width: '100%',
          minHeight: config.height ? `${config.height}px` : '400px',
          border: 'none',
          overflow: 'hidden',
          display: (isLoading && !isReady) || errorState ? 'none' : 'block',
        }}
        scrolling='no'
        frameBorder='0'
        allowTransparency
        role='region'
        aria-label='Trustpilot customer reviews'
      />
    </div>
  );
};

// Default export for convenience
export default TrustpilotIframe;
