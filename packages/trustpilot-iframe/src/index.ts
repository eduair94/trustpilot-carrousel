// React Component Export
export {
  TrustpilotIframe,
  default as TrustpilotIframeReact,
} from './TrustpilotIframe';

// Vanilla JavaScript Exports
export { autoInit, createTrustpilotWidget, TrustpilotWidget } from './vanilla';

// Types
export type {
  TrustpilotIframeConfig,
  TrustpilotIframeInstance,
  TrustpilotIframeProps,
  VanillaTrustpilotConfig,
} from './types';

// Utilities
export {
  buildIframeUrl,
  mergeConfig,
  mergeVanillaConfig,
  validateDomain,
} from './utils';
