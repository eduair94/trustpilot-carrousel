# Changelog

All notable changes to the Trustpilot Iframe Widget will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-08-24

### Added
- Commercial services page link (https://trustpilot.checkleaked.com)
- GitHub stars request in README and documentation
- Funding information in package.json for npm
- Enhanced support section with commercial services

### Changed
- Updated README with commercial services information
- Improved demo pages with commercial and GitHub links
- Enhanced documentation with star requests

## [1.0.0] - 2025-08-24

### Added
- Initial release of Trustpilot Iframe Widget
- React component with full TypeScript support
- Vanilla JavaScript implementation with auto-initialization
- CDN distribution (UMD and minified versions)
- iframe-resizer integration for automatic height adjustment
- Cross-origin iframe communication support
- Comprehensive configuration options:
  - Theme support (light/dark/auto)
  - Customizable review count and display options
  - Autoplay carousel functionality
  - Event callbacks (onReady, onError, onResize)
- Multiple installation methods (npm, CDN)
- Complete TypeScript type definitions
- Responsive design support
- Error handling and fallback mechanisms
- Demo pages and documentation
- Browser compatibility (IE11+, modern browsers)
- Security features (CSP friendly, XSS protection)
- Performance optimizations (lazy loading, tree shaking)
- 🎉 Initial release of Trustpilot Iframe Widget
- ⚛️ React component with full TypeScript support
- 🌐 Vanilla JavaScript support for framework-free usage
- 📦 CDN-ready builds for easy integration
- 🔄 Automatic iframe resizing using iframe-resizer
- 🎨 Customizable themes (light, dark, auto)
- 🎛️ Extensive configuration options
- 📱 Responsive design for all screen sizes
- ♿ Accessibility features (ARIA labels, keyboard navigation)
- 🎯 Auto-initialization from HTML data attributes
- 🔧 Programmatic API for dynamic control
- 📊 Event callbacks (onReady, onResize, onError)
- 🎨 Custom color theming support
- 🔍 Domain validation
- 💾 Built-in error handling and fallbacks
- 📚 Comprehensive documentation and examples
- 🧪 Demo pages for both React and vanilla JavaScript
- 🚀 Multiple build formats (UMD, ESM, CommonJS)
- 📝 TypeScript definitions included
- 🎪 Support for multiple widgets on the same page

### Technical Features
- Built with TypeScript for type safety
- Rollup-based build system
- Babel transpilation for broad browser support
- ESLint and Prettier for code quality
- Jest setup for testing
- Comprehensive error handling
- Memory leak prevention with proper cleanup
- CDN-optimized minified builds
- Tree-shakeable ES modules
- React 16.8+ compatibility
- Modern browser support (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)

### Package Exports
- Main React component: `TrustpilotIframe`
- Vanilla JavaScript class: `TrustpilotWidget`
- Factory function: `createTrustpilotWidget`
- Auto-initialization: `autoInit`
- Utility functions: `buildIframeUrl`, `validateDomain`
- TypeScript types: Full interface definitions

### Build Outputs
- `dist/index.js` - CommonJS build
- `dist/index.esm.js` - ES Module build
- `dist/index.umd.js` - UMD build for React usage
- `dist/vanilla.umd.js` - UMD build for vanilla JavaScript
- `dist/vanilla.min.js` - Minified CDN build
- `dist/index.d.ts` - TypeScript definitions

### Documentation
- Comprehensive README with usage examples
- HTML demo page with interactive examples
- React demo component
- API reference documentation
- Configuration options reference
- Browser compatibility guide
- Troubleshooting section

## [Unreleased]

### Planned
- Unit tests for all components
- Integration tests for iframe communication
- Performance optimization
- Additional themes
- More customization options
- Accessibility improvements
- Better error messages
- Caching strategies
- Lazy loading support
