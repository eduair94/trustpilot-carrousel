# Trustpilot Iframe Widget

[![npm version](https://img.shields.io/npm/v/trustpilot-iframe-widget.svg)](https://www.npmjs.com/package/trustpilot-iframe-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/eduair94/trustpilot-carrousel?style=social)](https://github.com/eduair94/trustpilot-carrousel)

An easy-to-use, lightweight Trustpilot iframe widget with automatic resizing, React support, and CDN distribution. Perfect for embedding Trustpilot reviews in your web applications with minimal setup.

> 💼 **Professional Services**: Need custom integrations or commercial support? Visit our [commercial page](https://trustpilot.checkleaked.com) for professional services.
>
> ⭐ **Love this package?** Give us a star on [GitHub](https://github.com/eduair94/trustpilot-carrousel) — it helps us continue developing and maintaining this open-source project!

## 🌟 Features

- 🚀 **Easy Integration** - Works with vanilla JavaScript, React, and any web framework
- 📱 **Responsive Design** - Automatically adapts to different screen sizes
- 🔄 **Auto-Resizing** - Dynamic height adjustment based on content using iframe-resizer
- ⚡ **CDN Support** - Ready-to-use via CDN for quick deployment
- 🎨 **Customizable** - Theme support (light/dark/auto) and custom styling
- 🛡️ **TypeScript** - Full TypeScript support with comprehensive type definitions
- 🌐 **Cross-Origin** - Handles cross-origin iframe communication seamlessly
- 📦 **Lightweight** - Minimal bundle size with tree-shaking support
- ✅ **TypeScript** - Full TypeScript support with detailed type definitions
## 📦 Installation

### NPM/Yarn

```bash
npm install trustpilot-iframe-widget
# or
yarn add trustpilot-iframe-widget
```

### CDN

```html
<!-- For vanilla JavaScript usage -->
<script src="https://unpkg.com/trustpilot-iframe-widget@latest/dist/vanilla.min.js"></script>

<!-- Or via jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/trustpilot-iframe-widget@latest/dist/vanilla.min.js"></script>
```

## 🚀 Quick Start

### Vanilla JavaScript (Auto-initialization)

Simply add the script tag and use data attributes:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Widget will auto-initialize on page load -->
    <div
        data-trustpilot-domain="google.com"
        data-theme="light"
        data-max-reviews="5"
        data-show-rating="true"
        data-height="400"
    ></div>

    <script src="https://unpkg.com/trustpilot-iframe-widget@latest/dist/vanilla.min.js"></script>
</body>
</html>
```

### Vanilla JavaScript (Manual)

```html
<div id="trustpilot-widget"></div>

<script src="https://unpkg.com/trustpilot-iframe-widget@latest/dist/vanilla.min.js"></script>
<script>
    const widget = window.createTrustpilotWidget({
        target: '#trustpilot-widget',
        domain: 'google.com',
        theme: 'light',
        maxReviews: 5,
        height: 400,
        onReady: () => console.log('Widget loaded!'),
        onError: (error) => console.error('Widget error:', error)
    });
</script>
```

### React

```jsx
import React from 'react';
import { TrustpilotIframe } from 'trustpilot-iframe-widget';

function App() {
    return (
        <div>
            <h1>Our Reviews</h1>
            <TrustpilotIframe
                domain="google.com"
                theme="light"
                maxReviews={5}
                showRating={true}
                height={400}
                onReady={() => console.log('Widget ready!')}
                onError={(error) => console.error('Error:', error)}
            />
        </div>
    );
}

export default App;
```

### ES Modules

```javascript
import { TrustpilotWidget, createTrustpilotWidget } from 'trustpilot-iframe-widget';

// Using the class directly
const widget = new TrustpilotWidget({
    target: '#my-widget',
    domain: 'apple.com',
    theme: 'dark',
    maxReviews: 3
});

// Or using the helper function
const widget2 = createTrustpilotWidget({
    target: '#another-widget',
    domain: 'microsoft.com',
    theme: 'auto'
});
```

### Node.js/CommonJS

```javascript
const { TrustpilotWidget } = require('trustpilot-iframe-widget');

const widget = new TrustpilotWidget({
    target: '#widget',
    domain: 'amazon.com'
});
```
      />
    </div>
  );
}

export default App;
```

### Vanilla JavaScript (Programmatic)

```javascript
import { createTrustpilotWidget } from 'trustpilot-iframe-widget';

// Create widget programmatically
const widget = createTrustpilotWidget({
  target: '#trustpilot-reviews', // CSS selector or HTMLElement
  domain: 'google.com',
  theme: 'light',
  maxReviews: 10,
  showRating: true,
  onReady: () => console.log('Reviews loaded!'),
  onError: (error) => console.error('Error:', error)
});
```

### Vanilla JavaScript (CDN + HTML Data Attributes)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <!-- Widget container with data attributes -->
  <div 
    data-trustpilot-domain="google.com"
    data-theme="light"
    data-max-reviews="10"
    data-show-rating="true"
    data-autoplay="true"
    data-interval="5000"
    id="trustpilot-widget">
    Loading reviews...
  </div>

  <!-- Load widget script -->
  <script src="https://unpkg.com/trustpilot-iframe-widget@latest/dist/vanilla.min.js"></script>
  
  <!-- Widget auto-initializes from data attributes -->
</body>
</html>
```

### Vanilla JavaScript (CDN + Manual Initialization)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <div id="my-reviews"></div>

  <script src="https://unpkg.com/trustpilot-iframe-widget@latest/dist/vanilla.min.js"></script>
  <script>
    // Manual initialization after DOM ready
    document.addEventListener('DOMContentLoaded', function() {
      const widget = window.createTrustpilotWidget({
        target: '#my-reviews',
        domain: 'google.com',
        theme: 'dark',
        maxReviews: 5,
        showRating: true,
        onReady: function() {
          console.log('Trustpilot widget loaded!');
        }
      });
    });
  </script>
</body>
</html>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `domain` | `string` | **required** | Domain to fetch reviews for (e.g., 'google.com') |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Color theme |
| `autoplay` | `boolean` | `true` | Auto-play carousel |
| `interval` | `number` | `5000` | Auto-play interval in milliseconds |
| `maxReviews` | `number` | `10` | Maximum number of reviews to show |
| `showRating` | `boolean` | `true` | Show star ratings |
| `showDate` | `boolean` | `true` | Show review dates |
| `showAvatar` | `boolean` | `true` | Show reviewer avatars |
| `showReply` | `boolean` | `true` | Show company replies |
| `hideGlobalReviews` | `boolean` | `false` | Hide global review statistics |
| `hideTopBanner` | `boolean` | `false` | Hide top banner with company info |
| `height` | `number` | `400` | Initial widget height in pixels |
| `page` | `number` | `1` | Page number for pagination |
| `limit` | `number` | `20` | Reviews per page |
| `rating` | `number` | `undefined` | Filter by minimum rating (1-5) |
| `sort` | `'latest' \| 'rating'` | `'latest'` | Sort order for reviews |
| `className` | `string` | `undefined` | Custom CSS classes |
| `onReady` | `() => void` | `undefined` | Callback when widget is ready |
| `onResize` | `(data) => void` | `undefined` | Callback when widget resizes |
| `onError` | `(error) => void` | `undefined` | Callback when error occurs |

### Custom Colors

```javascript
{
  domain: 'google.com',
  colors: {
    primary: '#ff6b35',
    secondary: '#2196f3',
    background: '#ffffff',
    text: '#333333',
    border: '#e0e0e0'
  }
}
```

### Data Attributes (HTML)

All configuration options can be specified as data attributes:

```html
<div 
  data-trustpilot-domain="google.com"
  data-theme="dark"
  data-autoplay="false"
  data-max-reviews="5"
  data-show-rating="true"
  data-show-date="false"
  data-hide-top-banner="true"
  data-height="300">
</div>
```

## API Reference

### React Component Props

```typescript
interface TrustpilotIframeProps {
  domain: string;
  title?: string;
  loading?: React.ReactNode;
  error?: React.ReactNode | ((error: string) => React.ReactNode);
  // ... all configuration options
}
```

### Vanilla JavaScript Class

```typescript
class TrustpilotWidget {
  constructor(config: VanillaTrustpilotConfig)
  
  // Update configuration
  updateConfig(newConfig: Partial<VanillaTrustpilotConfig>): void
  
  // Get current configuration
  getConfig(): VanillaTrustpilotConfig
  
  // Check if widget is ready
  isWidgetReady(): boolean
  
  // Destroy widget and cleanup
  destroy(): void
}
```

### Global Functions (CDN)

```javascript
// Create a new widget instance
window.createTrustpilotWidget(config)

// Auto-initialize widgets from data attributes
window.autoInit()

// Access the widget class
window.TrustpilotWidget
```

## Styling

The widget automatically includes basic styling, but you can customize the appearance:

```css
/* Container styling */
.trustpilot-iframe-container {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Loading state */
.trustpilot-iframe-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f5f5f5;
}

/* Error state */
.trustpilot-iframe-error {
  padding: 20px;
  text-align: center;
  color: #d32f2f;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
}
```

## Examples

### Multiple Widgets

```javascript
// Create multiple widgets on the same page
const widget1 = createTrustpilotWidget({
  target: '#reviews-1',
  domain: 'google.com',
  theme: 'light'
});

const widget2 = createTrustpilotWidget({
  target: '#reviews-2', 
  domain: 'microsoft.com',
  theme: 'dark'
});
```

### Dynamic Updates

```javascript
const widget = createTrustpilotWidget({
  target: '#reviews',
  domain: 'google.com'
});

// Update domain dynamically
widget.updateConfig({
  domain: 'apple.com',
  theme: 'dark'
});
```

### Error Handling

```javascript
createTrustpilotWidget({
  target: '#reviews',
  domain: 'google.com',
  onError: (error) => {
    console.error('Widget error:', error);
    // Show custom error message
    document.getElementById('reviews').innerHTML = 
      '<p>Unable to load reviews. Please try again later.</p>';
  }
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Internet Explorer 11+ (with polyfills)

## TypeScript

This package includes comprehensive TypeScript definitions. Import types as needed:

```typescript
import { 
  TrustpilotIframeProps, 
  VanillaTrustpilotConfig,
  TrustpilotWidget 
} from 'trustpilot-iframe-widget';
```

## Troubleshooting

### Widget Not Loading

1. Verify the domain is correct and accessible
2. Check browser console for error messages
3. Ensure the target element exists before initialization

### Resize Issues

1. Make sure iframe-resizer loads correctly from CDN
2. Check if content security policy blocks the resizer script
3. Verify parent container allows iframe resizing

### Performance

1. Use `maxReviews` to limit the number of reviews loaded
2. Consider lazy loading for widgets below the fold
3. Use appropriate caching headers for the widget script

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- � **Commercial Services**: [Professional Support & Custom Integrations](https://trustpilot.checkleaked.com)
- �📧 **Email**: [airaudoeduardo@gmail.com](mailto:airaudoeduardo@gmail.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/eduair94/trustpilot-carrousel/issues)
- 📖 **Documentation**: [Full Docs](https://github.com/eduair94/trustpilot-carrousel/tree/master/packages/trustpilot-iframe#readme)
- ⭐ **Star us on GitHub**: [Give us a star](https://github.com/eduair94/trustpilot-carrousel) to support the project!
