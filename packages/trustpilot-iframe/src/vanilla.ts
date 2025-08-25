import { VanillaTrustpilotConfig } from './types';
import {
  buildIframeUrl,
  generateIframeId,
  mergeVanillaConfig,
  validateDomain,
} from './utils';
import iframeResize from 'iframe-resizer/js/iframeResizer';

// Interface for iframe-resizer data
interface IframeResizerData {
  width: number;
  height: number;
  message?: {
    type: string;
    message?: string;
  };
}

// Interface for iframe-resizer instance
interface IframeResizerInstance {
  close: () => void;
}

/**
 * Vanilla JavaScript Trustpilot iframe widget with automatic resizing
 */
export class TrustpilotWidget {
  private container: HTMLElement;
  private iframe: HTMLIFrameElement | null = null;
  private loadingElement: HTMLElement | null = null;
  private errorElement: HTMLElement | null = null;
  private resizerInstance: IframeResizerInstance[] | null = null;
  private config: VanillaTrustpilotConfig;
  private iframeId: string;
  private isReady = false;
  private isLoading = false;

  constructor(config: VanillaTrustpilotConfig) {
    // Validate and get target element
    const target =
      typeof config.target === 'string'
        ? document.querySelector(config.target)
        : config.target;

    if (!target) {
      throw new Error(`Target element not found: ${config.target}`);
    }

    this.container = target as HTMLElement;
    this.config = mergeVanillaConfig(config);
    this.iframeId = generateIframeId();

    // Validate domain
    if (!validateDomain(this.config.domain)) {
      this.showError(`Invalid domain: ${this.config.domain}`);
      return;
    }

    this.init();
  }

  /**
   * Initialize the widget
   */
  private async init(): Promise<void> {
    try {
      // Add CSS classes
      this.container.classList.add('trustpilot-iframe-container');
      if (this.config.className) {
        this.container.classList.add(...this.config.className.split(' '));
      }

      // Apply custom styles
      if (this.config.style) {
        Object.assign(this.container.style, this.config.style);
      }

      // Create and show loading state
      this.showLoading();

      // Create iframe
      this.createIframe();
    } catch (error) {
      this.showError(
        `Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create and configure the iframe
   */
  private createIframe(): void {
    this.iframe = document.createElement('iframe');
    this.iframe.id = this.iframeId;
    this.iframe.src = buildIframeUrl(this.config);
    this.iframe.title = this.config.title || 'Trustpilot Reviews';
    this.iframe.setAttribute('scrolling', 'no');
    this.iframe.setAttribute('frameBorder', '0');
    this.iframe.setAttribute('allowTransparency', 'true');
    this.iframe.setAttribute('role', 'region');
    this.iframe.setAttribute('aria-label', 'Trustpilot customer reviews');

    // Set styles
    Object.assign(this.iframe.style, {
      width: '100%',
      minHeight: this.config.height ? `${this.config.height}px` : '400px',
      border: 'none',
      overflow: 'hidden',
      display: 'none', // Hidden until loaded
    });

    // Event listeners
    this.iframe.onload = () => this.handleIframeLoad();
    this.iframe.onerror = () => this.handleIframeError();

    this.container.appendChild(this.iframe);
  }

  /**
   * Handle iframe load event
   */
  private handleIframeLoad(): void {
    this.hideLoading();

    if (!this.iframe) return;

    try {
      // Use iframe-resizer for proper cross-origin iframe resizing
      this.resizerInstance = iframeResize(
        {
          log: false,
          checkOrigin: false,
          resizedCallback: (data: IframeResizerData) => {
            this.config.onResize?.({
              width: data.width,
              height: data.height,
            });
          },
          messageCallback: (data: { message?: { type: string; message?: string } }) => {
            if (data.message && data.message.type === 'error') {
              const errorMsg = data.message.message || 'Unknown error occurred';
              this.showError(errorMsg);
            }
          },
        },
        this.iframe
      );

      this.isReady = true;
      this.iframe!.style.display = 'block';
      this.config.onReady?.();
    } catch (error) {
      // If iframe-resizer fails, fallback to basic display
      console.warn('Failed to initialize iframe-resizer:', error);
      this.isReady = true;
      this.iframe!.style.display = 'block';
      this.config.onReady?.();
    }
  }

  /**
   * Handle iframe error event
   */
  private handleIframeError(): void {
    this.hideLoading();
    this.showError('Failed to load iframe content');
  }

  /**
   * Show loading state
   */
  private showLoading(): void {
    this.isLoading = true;
    this.hideError();

    if (!this.loadingElement) {
      this.loadingElement = document.createElement('div');
      this.loadingElement.className = 'trustpilot-iframe-loading';
      this.loadingElement.innerHTML =
        '<div style="padding: 20px; text-align: center;">Loading reviews...</div>';
    }

    this.container.appendChild(this.loadingElement);
  }

  /**
   * Hide loading state
   */
  private hideLoading(): void {
    this.isLoading = false;
    if (this.loadingElement && this.loadingElement.parentNode) {
      this.loadingElement.parentNode.removeChild(this.loadingElement);
    }
  }

  /**
   * Show error state
   */
  private showError(message: string): void {
    this.hideLoading();

    if (!this.errorElement) {
      this.errorElement = document.createElement('div');
      this.errorElement.className = 'trustpilot-iframe-error';
    }

    this.errorElement.innerHTML = `
      <div style="
        padding: 20px; 
        text-align: center; 
        color: #dc3545;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
      ">
        <strong>Error:</strong> ${message}
      </div>
    `;

    this.container.appendChild(this.errorElement);
    this.config.onError?.(message);
  }

  /**
   * Hide error state
   */
  private hideError(): void {
    if (this.errorElement && this.errorElement.parentNode) {
      this.errorElement.parentNode.removeChild(this.errorElement);
    }
  }

  /**
   * Update configuration and reload iframe
   */
  public updateConfig(newConfig: Partial<VanillaTrustpilotConfig>): void {
    this.config = mergeVanillaConfig({ ...this.config, ...newConfig });

    // Validate domain if it was changed
    if (newConfig.domain && !validateDomain(this.config.domain)) {
      this.showError(`Invalid domain: ${this.config.domain}`);
      return;
    }

    if (this.iframe) {
      const newUrl = buildIframeUrl(this.config);
      if (this.iframe.src !== newUrl) {
        this.showLoading();
        this.hideError();
        this.isReady = false;
        this.iframe.src = newUrl;
      }
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): VanillaTrustpilotConfig {
    return { ...this.config };
  }

  /**
   * Check if widget is ready
   */
  public isWidgetReady(): boolean {
    return this.isReady;
  }

  /**
   * Destroy the widget and cleanup resources
   */
  public destroy(): void {
    // Close iframe resizer instances
    if (this.resizerInstance && Array.isArray(this.resizerInstance)) {
      this.resizerInstance.forEach((resizer: IframeResizerInstance) => {
        if (resizer && typeof resizer.close === 'function') {
          resizer.close();
        }
      });
      this.resizerInstance = null;
    }

    // Remove elements
    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }

    this.hideLoading();
    this.hideError();

    // Clear references
    this.iframe = null;
    this.isReady = false;
    this.isLoading = false;
  }
}

/**
 * Global function for easy initialization
 */
export function createTrustpilotWidget(
  config: VanillaTrustpilotConfig
): TrustpilotWidget {
  return new TrustpilotWidget(config);
}

/**
 * Auto-initialize widgets from data attributes
 */
export function autoInit(): TrustpilotWidget[] {
  const widgets: TrustpilotWidget[] = [];
  const elements = document.querySelectorAll('[data-trustpilot-domain]:not([data-trustpilot-initialized])');

  elements.forEach(element => {
    try {
      // Mark as initialized to prevent duplicate processing
      element.setAttribute('data-trustpilot-initialized', 'true');
      
      const config: VanillaTrustpilotConfig = {
        target: element as HTMLElement,
        domain: element.getAttribute('data-trustpilot-domain') || '',
        theme:
          (element.getAttribute('data-theme') as 'light' | 'dark' | 'auto') ||
          'light',
        autoplay: element.getAttribute('data-autoplay') === 'true',
        interval: parseInt(element.getAttribute('data-interval') || '5000'),
        maxReviews: parseInt(element.getAttribute('data-max-reviews') || '10'),
        showRating: element.getAttribute('data-show-rating') !== 'false',
        showDate: element.getAttribute('data-show-date') !== 'false',
        showAvatar: element.getAttribute('data-show-avatar') !== 'false',
        hideGlobalReviews:
          element.getAttribute('data-hide-global-reviews') === 'true',
        hideTopBanner: element.getAttribute('data-hide-top-banner') === 'true',
        height: parseInt(element.getAttribute('data-height') || '400'),
        title: element.getAttribute('data-title') || undefined,
      };

      const widget = new TrustpilotWidget(config);
      widgets.push(widget);
    } catch (error) {
      console.error('Failed to initialize Trustpilot widget:', error);
    }
  });

  return widgets;
}
