/**
 * CDN Build Entry Point for Trustpilot Iframe Widget
 *
 * This file exports the vanilla JavaScript components to the global window object
 * for CDN usage without module bundlers.
 */

import { TrustpilotWidget, autoInit, createTrustpilotWidget } from './vanilla';

// Extend window interface for CDN usage
declare global {
  interface Window {
    TrustpilotWidget: typeof TrustpilotWidget;
    createTrustpilotWidget: typeof createTrustpilotWidget;
  }
}

// Attach to window object for global access
if (typeof window !== 'undefined') {
  window.TrustpilotWidget = TrustpilotWidget;
  window.createTrustpilotWidget = createTrustpilotWidget;

  // Auto-initialize on DOM ready if not already done
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    // DOM already loaded, run immediately
    setTimeout(autoInit, 0);
  }
}

// Also export as ES modules for bundler compatibility
export { TrustpilotWidget, autoInit, createTrustpilotWidget };
