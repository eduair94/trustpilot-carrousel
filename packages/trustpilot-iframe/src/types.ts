/**
 * Configuration options for the Trustpilot iframe widget
 */
export interface TrustpilotIframeConfig {
  /** Domain to fetch reviews for (e.g., 'google.com') */
  domain: string;

  /** Color theme configuration */
  theme?: 'light' | 'dark' | 'auto';

  /** Custom colors for theming */
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    border?: string;
  };

  /** Auto-play carousel */
  autoplay?: boolean;

  /** Auto-play interval in milliseconds */
  interval?: number;

  /** Maximum number of reviews to show */
  maxReviews?: number;

  /** Show star ratings */
  showRating?: boolean;

  /** Show review dates */
  showDate?: boolean;

  /** Show reviewer avatars */
  showAvatar?: boolean;

  /** Show company reply to reviews */
  showReply?: boolean;

  /** Hide global review statistics */
  hideGlobalReviews?: boolean;

  /** Hide top banner with company info */
  hideTopBanner?: boolean;

  /** Widget height (used for iframe sizing) */
  height?: number;

  /** Page number for pagination */
  page?: number;

  /** Number of reviews per page */
  limit?: number;

  /** Filter by minimum rating (1-5) */
  rating?: number;

  /** Sort order for reviews */
  sort?: 'latest' | 'rating';

  /** Custom CSS classes to add to the iframe */
  className?: string;

  /** Custom styles to apply to the iframe */
  style?: React.CSSProperties;

  /** Callback when iframe is loaded and ready */
  onReady?: () => void;

  /** Callback when iframe is resized */
  onResize?: (data: { width: number; height: number }) => void;

  /** Callback when an error occurs */
  onError?: (error: string) => void;
}

/**
 * Props for the React component
 */
export interface TrustpilotIframeProps extends TrustpilotIframeConfig {
  /** iframe title for accessibility */
  title?: string;

  /** Loading placeholder component or text */
  loading?: React.ReactNode;

  /** Error placeholder component or function */
  error?: React.ReactNode | ((error: string) => React.ReactNode);
}

/**
 * Options for vanilla JavaScript initialization
 */
/**
 * Options for vanilla JavaScript initialization
 */
export interface VanillaTrustpilotConfig extends TrustpilotIframeConfig {
  /** Target element selector or HTMLElement */
  target: string | HTMLElement;

  /** iframe title for accessibility */
  title?: string;

  /** Loading HTML content */
  loading?: string;

  /** Error HTML content or callback function */
  error?: string | ((error: string) => string);
}

/**
 * Return type for vanilla JavaScript initialization
 */
export interface TrustpilotIframeInstance {
  /** Destroy the iframe and cleanup */
  destroy: () => void;

  /** Update the configuration */
  updateConfig: (config: Partial<TrustpilotIframeConfig>) => void;

  /** Reload the iframe with current config */
  reload: () => void;

  /** Get current configuration */
  getConfig: () => TrustpilotIframeConfig;

  /** Get the iframe element */
  getIframe: () => HTMLIFrameElement | null;
}

/**
 * Iframe resizer instance interface
 */
export interface IframeResizerInstance {
  close: () => void;
}

/**
 * Iframe resizer options interface
 */
export interface IframeResizerOptions {
  log?: boolean;
  checkOrigin?: boolean;
  resizeFrom?: 'parent' | 'child';
  autoResize?: boolean;
  bodyPadding?: number;
  bodyMargin?: number;
  heightCalculationMethod?:
    | 'bodyOffset'
    | 'bodyScroll'
    | 'documentElementOffset'
    | 'documentElementScroll'
    | 'max'
    | 'min'
    | 'grow'
    | 'lowestElement'
    | 'taggedElement';
  widthCalculationMethod?:
    | 'bodyOffset'
    | 'bodyScroll'
    | 'documentElementOffset'
    | 'documentElementScroll'
    | 'max'
    | 'min'
    | 'scroll'
    | 'rightMostElement'
    | 'taggedElement';
  tolerance?: number;
  onInit?: () => void;
  onResized?: (data: { width: number; height: number; type?: string }) => void;
  onMessage?: (data: { message: string; messageData?: string }) => void;
}

/**
 * Iframe resizer function interface
 */
export interface IframeResizeFunction {
  (
    options: IframeResizerOptions,
    target: string | HTMLElement
  ): IframeResizerInstance[];
}
