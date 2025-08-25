# API Documentation

## Table of Contents

- [TrustpilotWidget Class](#trustpilotwidget-class)
- [React Component](#react-component)
- [Configuration Options](#configuration-options)
- [Event Callbacks](#event-callbacks)
- [Utility Functions](#utility-functions)
- [TypeScript Interfaces](#typescript-interfaces)

## TrustpilotWidget Class

The main JavaScript class for creating Trustpilot iframe widgets.

### Constructor

```typescript
constructor(config: VanillaTrustpilotConfig)
```

**Parameters:**
- `config` (VanillaTrustpilotConfig): Widget configuration options

**Example:**
```javascript
const widget = new TrustpilotWidget({
    target: '#my-widget',
    domain: 'google.com',
    theme: 'light',
    maxReviews: 5
});
```

### Methods

#### `updateConfig(newConfig: Partial<VanillaTrustpilotConfig>): void`

Updates the widget configuration and reloads the iframe if necessary.

**Parameters:**
- `newConfig`: Partial configuration object with new values

**Example:**
```javascript
widget.updateConfig({
    domain: 'apple.com',
    theme: 'dark',
    maxReviews: 10
});
```

#### `getConfig(): VanillaTrustpilotConfig`

Returns a copy of the current widget configuration.

**Returns:** Current configuration object

**Example:**
```javascript
const currentConfig = widget.getConfig();
console.log(currentConfig.domain); // 'google.com'
```

#### `isWidgetReady(): boolean`

Checks if the widget has finished loading and is ready to display.

**Returns:** `true` if widget is ready, `false` otherwise

**Example:**
```javascript
if (widget.isWidgetReady()) {
    console.log('Widget is ready!');
}
```

#### `destroy(): void`

Destroys the widget and cleans up all resources, event listeners, and DOM elements.

**Example:**
```javascript
widget.destroy(); // Clean cleanup
```

## React Component

The React component wrapper for the Trustpilot widget.

### TrustpilotIframe

```tsx
import { TrustpilotIframe } from 'trustpilot-iframe-widget';

<TrustpilotIframe
    domain="google.com"
    theme="light"
    maxReviews={5}
    onReady={() => console.log('Ready!')}
/>
```

### Props

All configuration options from `VanillaTrustpilotConfig` plus:

```typescript
interface TrustpilotIframeProps extends VanillaTrustpilotConfig {
    loading?: React.ReactNode;
    error?: (error: string) => React.ReactNode;
    colors?: {
        primary?: string;
        secondary?: string;
        background?: string;
        text?: string;
    };
}
```

## Configuration Options

### Core Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target` | `string \| HTMLElement` | **required** | Target element selector or element |
| `domain` | `string` | **required** | Domain to fetch reviews for |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Widget theme |
| `maxReviews` | `number` | `10` | Maximum number of reviews |
| `height` | `number` | `400` | Widget height in pixels |

### Display Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showRating` | `boolean` | `true` | Show star ratings |
| `showDate` | `boolean` | `true` | Show review dates |
| `showAvatar` | `boolean` | `true` | Show user avatars |
| `hideGlobalReviews` | `boolean` | `false` | Hide global review stats |
| `hideTopBanner` | `boolean` | `false` | Hide top banner |

### Carousel Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoplay` | `boolean` | `false` | Enable automatic carousel |
| `interval` | `number` | `5000` | Autoplay interval (milliseconds) |

### Styling Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `style` | `React.CSSProperties` | - | Inline styles |
| `title` | `string` | - | Custom widget title |

## Event Callbacks

### onReady

Called when the widget has finished loading and is ready to display.

```typescript
onReady?: () => void;
```

**Example:**
```javascript
{
    onReady: () => {
        console.log('Widget is ready!');
        // Hide loading spinner, show widget, etc.
    }
}
```

### onError

Called when an error occurs during widget loading or operation.

```typescript
onError?: (error: string) => void;
```

**Parameters:**
- `error`: Error message describing what went wrong

**Example:**
```javascript
{
    onError: (error) => {
        console.error('Widget error:', error);
        // Show error message, fallback content, etc.
    }
}
```

### onResize

Called when the widget iframe is resized (via iframe-resizer).

```typescript
onResize?: (data: {width: number, height: number}) => void;
```

**Parameters:**
- `data`: Object containing new width and height dimensions

**Example:**
```javascript
{
    onResize: ({width, height}) => {
        console.log(`Widget resized to ${width}x${height}`);
        // Adjust container, trigger animations, etc.
    }
}
```

## Utility Functions

### createTrustpilotWidget

Factory function for creating widget instances.

```typescript
function createTrustpilotWidget(config: VanillaTrustpilotConfig): TrustpilotWidget
```

**Parameters:**
- `config`: Widget configuration options

**Returns:** New TrustpilotWidget instance

**Example:**
```javascript
import { createTrustpilotWidget } from 'trustpilot-iframe-widget';

const widget = createTrustpilotWidget({
    target: '#widget',
    domain: 'google.com'
});
```

### autoInit

Automatically initializes all widgets found on the page using data attributes.

```typescript
function autoInit(): TrustpilotWidget[]
```

**Returns:** Array of created TrustpilotWidget instances

**Example:**
```javascript
import { autoInit } from 'trustpilot-iframe-widget';

// Initialize all widgets on the page
const widgets = autoInit();
console.log(`Initialized ${widgets.length} widgets`);
```

## TypeScript Interfaces

### VanillaTrustpilotConfig

Main configuration interface for the widget.

```typescript
interface VanillaTrustpilotConfig {
    target: string | HTMLElement;
    domain: string;
    theme?: 'light' | 'dark' | 'auto';
    maxReviews?: number;
    showRating?: boolean;
    showDate?: boolean;
    showAvatar?: boolean;
    autoplay?: boolean;
    interval?: number;
    height?: number;
    hideGlobalReviews?: boolean;
    hideTopBanner?: boolean;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
    onReady?: () => void;
    onError?: (error: string) => void;
    onResize?: (data: {width: number, height: number}) => void;
}
```

### TrustpilotIframeProps

React component props interface.

```typescript
interface TrustpilotIframeProps extends VanillaTrustpilotConfig {
    loading?: React.ReactNode;
    error?: (error: string) => React.ReactNode;
    colors?: {
        primary?: string;
        secondary?: string;
        background?: string;
        text?: string;
    };
}
```

## Error Handling

The widget includes comprehensive error handling:

### Common Errors

1. **Invalid Domain**: When the specified domain is invalid or empty
2. **Target Not Found**: When the target element doesn't exist
3. **Iframe Load Failure**: When the iframe fails to load
4. **Network Issues**: When there are connectivity problems
5. **Cross-Origin Issues**: When iframe communication fails

### Error Recovery

- Automatic retry for network issues
- Fallback content display on persistent errors
- Graceful degradation when iframe-resizer fails
- Console logging for debugging

### Best Practices

1. Always provide `onError` callback for error handling
2. Test with invalid domains to ensure proper error display
3. Provide fallback content for users with JavaScript disabled
4. Use HTTPS for security and cross-origin compatibility

## Browser Support

### Minimum Requirements

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+
- **Internet Explorer**: 11+ (with polyfills)

### Features by Browser

| Feature | Chrome 60+ | Firefox 55+ | Safari 12+ | Edge 79+ | IE 11+ |
|---------|------------|-------------|------------|----------|---------|
| Basic Widget | ✅ | ✅ | ✅ | ✅ | ✅* |
| iframe-resizer | ✅ | ✅ | ✅ | ✅ | ✅* |
| Auto-init | ✅ | ✅ | ✅ | ✅ | ✅* |
| TypeScript | ✅ | ✅ | ✅ | ✅ | ✅ |
| ES Modules | ✅ | ✅ | ✅ | ✅ | ❌ |

*Requires polyfills for IE11

## Performance Guidelines

### Bundle Size

- Main bundle: ~24KB minified + gzipped
- React component: Additional ~2KB
- iframe-resizer: ~8KB (included)

### Loading Performance

1. Use CDN for faster loading
2. Enable lazy loading for below-fold widgets
3. Preload iframe content when possible
4. Use appropriate `height` to prevent layout shifts

### Memory Management

1. Always call `destroy()` when removing widgets
2. Remove event listeners properly
3. Clean up React components in useEffect cleanup
4. Monitor for memory leaks in long-running applications

## Security Considerations

### Content Security Policy (CSP)

The widget is compatible with CSP. Required directives:

```
script-src 'self' https://unpkg.com https://cdn.jsdelivr.net;
frame-src https://trustpilot.checkleaked.com;
connect-src https://trustpilot.checkleaked.com;
```

### HTTPS Requirements

- Widget source must be served over HTTPS in production
- iframe content is served over HTTPS
- Cross-origin communication requires HTTPS

### XSS Protection

- All user inputs are sanitized
- iframe content is isolated
- No eval() or dangerous dynamic code execution
