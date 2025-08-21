'use client';

import { useEffect, useState } from 'react';

interface IframeResizerDemoProps {
  src: string;
  width?: string;
  height?: string | number;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
}

export function IframeResizerDemo({
  src,
  width = '100%',
  height = '400',
  className = '',
  title = '',
  style = {},
}: IframeResizerDemoProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [IframeResizer, setIframeResizer] = useState<any>(null);

  useEffect(() => {
    // Dynamically import the IframeResizer to avoid SSR issues
    const loadIframeResizer = async () => {
      try {
        const iframeResizerModule = await import('@iframe-resizer/react');
        setIframeResizer(() => iframeResizerModule.default);
      } catch (error) {
        console.error('Failed to load IframeResizer:', error);
      }
    };

    loadIframeResizer();
  }, []);

  // Check if the src contains autoHeight=true parameter
  const hasAutoHeight = src.includes('autoHeight=true');

  // If IframeResizer hasn't loaded yet or autoHeight is not enabled, use regular iframe
  if (!IframeResizer || !hasAutoHeight) {
    return (
      <iframe
        src={src}
        width={width}
        height={height}
        className={className}
        title={title}
        style={style}
      />
    );
  }

  // Use IframeResizer component for auto-height functionality
  return (
    <IframeResizer
      src={src}
      license='GPLv3'
      checkOrigin={false}
      log={true}
      waitForLoad={false}
      warningTimeout={10000}
      scrolling={false}
      style={{
        width: width === '100%' ? '100%' : width,
        minWidth: width === '100%' ? '100%' : undefined,
        border: 'none',
        ...style,
      }}
      className={className}
      title={title}
    />
  );
}
