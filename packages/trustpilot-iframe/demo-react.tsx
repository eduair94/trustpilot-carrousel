import React, { useState } from 'react';
import { TrustpilotIframe } from './src/index';

const ReactDemo: React.FC = () => {
  const [domain, setDomain] = useState('google.com');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [maxReviews, setMaxReviews] = useState(5);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        🌟 Trustpilot Iframe Widget - React Demo
      </h1>

      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
        }}
      >
        <h2>Configuration</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Domain:
            </label>
            <input
              type='text'
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder='e.g., google.com'
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Theme:
            </label>
            <select
              value={theme}
              onChange={e =>
                setTheme(e.target.value as 'light' | 'dark' | 'auto')
              }
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option value='light'>Light</option>
              <option value='dark'>Dark</option>
              <option value='auto'>Auto</option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '5px',
                fontWeight: 'bold',
              }}
            >
              Max Reviews:
            </label>
            <input
              type='number'
              value={maxReviews}
              onChange={e => setMaxReviews(parseInt(e.target.value) || 5)}
              min='1'
              max='20'
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        {status && (
          <div
            style={{
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: status.startsWith('✅')
                ? '#d4edda'
                : status.startsWith('❌')
                  ? '#f8d7da'
                  : '#d1ecf1',
              color: status.startsWith('✅')
                ? '#155724'
                : status.startsWith('❌')
                  ? '#721c24'
                  : '#0c5460',
              border: `1px solid ${status.startsWith('✅') ? '#c3e6cb' : status.startsWith('❌') ? '#f5c6cb' : '#bee5eb'}`,
            }}
          >
            {status}
          </div>
        )}
      </div>

      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
        }}
      >
        <h2>Basic Example</h2>
        <TrustpilotIframe
          domain={domain}
          theme={theme}
          maxReviews={maxReviews}
          showRating={true}
          showDate={true}
          showAvatar={true}
          autoplay={true}
          interval={4000}
          loading={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '2px dashed #dee2e6',
              }}
            >
              <div>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
                <div>Loading {domain} reviews...</div>
              </div>
            </div>
          }
          error={error => (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: '#dc3545',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
              <strong>Failed to load reviews</strong>
              <div style={{ fontSize: '14px', marginTop: '5px' }}>
                Error: {error}
              </div>
            </div>
          )}
          onReady={() => {
            setStatus('✅ Reviews loaded successfully!');
            setLoading(false);
          }}
          onError={error => {
            setStatus(`❌ Error loading reviews: ${error}`);
            setLoading(false);
          }}
          onResize={data => {
            console.log('Widget resized:', data);
          }}
          style={{ border: '2px solid #e9ecef', borderRadius: '8px' }}
        />
      </div>

      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
        }}
      >
        <h2>Custom Styled Example</h2>
        <TrustpilotIframe
          domain='microsoft.com'
          theme='dark'
          maxReviews={3}
          showRating={true}
          showDate={false}
          hideTopBanner={true}
          colors={{
            primary: '#ff6b35',
            secondary: '#2196f3',
            background: '#1a1a1a',
            text: '#ffffff',
          }}
          height={250}
          loading={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '250px',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                color: 'white',
              }}
            >
              Loading Microsoft reviews with custom styling...
            </div>
          }
          onReady={() => console.log('Custom styled widget ready')}
          onError={error => console.error('Custom widget error:', error)}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          }}
        />
      </div>

      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>Multiple Widgets</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          <div>
            <h3 style={{ color: '#555', marginBottom: '15px' }}>
              Apple Reviews
            </h3>
            <TrustpilotIframe
              domain='apple.com'
              theme='light'
              maxReviews={2}
              showRating={true}
              height={200}
              loading={
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  Loading Apple...
                </div>
              }
              onReady={() => console.log('Apple widget ready')}
              style={{ border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>

          <div>
            <h3 style={{ color: '#555', marginBottom: '15px' }}>
              Amazon Reviews
            </h3>
            <TrustpilotIframe
              domain='amazon.com'
              theme='light'
              maxReviews={2}
              showRating={true}
              height={200}
              loading={
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  Loading Amazon...
                </div>
              }
              onReady={() => console.log('Amazon widget ready')}
              style={{ border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666',
        }}
      >
        <p>
          <strong>Note:</strong> This demo shows the React component
          integration. Open browser developer tools to see console logs for
          widget events.
        </p>
        <p>
          <strong>Features demonstrated:</strong>
        </p>
        <ul>
          <li>Dynamic configuration updates</li>
          <li>Custom loading and error states</li>
          <li>Event handling (onReady, onError, onResize)</li>
          <li>Custom styling and theming</li>
          <li>Multiple widgets on the same page</li>
        </ul>
      </div>
    </div>
  );
};

export default ReactDemo;
