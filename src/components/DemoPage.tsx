'use client';

import { CarrouselConfig } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IframeConfigurator } from './IframeConfigurator';
import { IframeResizerDemo } from './IframeResizerDemo';

export function DemoPage() {
  const [origin, setOrigin] = useState('');
  const [isIframe, setIsIframe] = useState(false);
  const [config, setConfig] = useState<CarrouselConfig>({
    domain: 'google.com',
    page: 1,
    autoplay: true,
    interval: 5000,
    theme: 'custom',
    maxReviews: 5,
    minRating: 1,
    language: 'en',
    showRating: true,
    showDate: true,
    showAvatar: true,
    showReply: true,
    hideGlobalReviews: false,
    hideTopBanner: false,
    height: 400,
    width: '100%',
    autoHeight: false,
    // Enhanced color customization (transparent by default)
    backgroundColor: 'transparent',
    textColor: '#191919',
    primaryColor: '#00b67a',
    surfaceColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(229, 231, 235, 0.8)',
    starColor: '#ffc107',
    transparent: true,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
      setIsIframe(window.self !== window.top);
    }
  }, []);

  if (isIframe) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-red-50'>
        <div className='p-8 bg-white rounded-xl shadow-lg border border-red-200 text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-2'>
            Access Denied
          </h1>
          <p className='text-gray-700 mb-2'>
            The demo page cannot be loaded inside an iframe for security
            reasons.
          </p>
          <p className='text-gray-500 text-sm'>
            Please open this page directly in your browser.
          </p>
        </div>
      </div>
    );
  }

  const handleConfigChange = (newConfig: CarrouselConfig) => {
    setConfig(newConfig);
    console.log('Config updated:', newConfig);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-green-50 text-black'>
      {/* Header */}
      {/* Header */}
      <header className='bg-white shadow-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8'>
          <div className='text-center'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
              🎠 Trustpilot Reviews Carousel
            </h1>
            <p className='text-base sm:text-lg text-gray-600 mb-4'>
              Embeddable iframe widget for displaying customer reviews in an
              elegant carousel format
            </p>

            {/* Open Source & NPM Package Information */}
            <div className='bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6'>
              <p className='text-sm text-gray-700 mb-3'>
                🚀 <strong>Open Source NPM Package:</strong>
                <code className='bg-gray-100 px-2 py-1 rounded mx-1 text-sm'>
                  trustpilot-iframe-widget
                </code>
              </p>
              <div className='flex flex-wrap justify-center gap-3 text-sm'>
                <a
                  href='https://www.npmjs.com/package/trustpilot-iframe-widget'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors'
                >
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zM5.13 5.323l13.837.019-.009 5.183H13.82v-1.647h3.596V6.874H5.132l-.002-1.551zm4.257 6.557v3.596H6.791V8.88h2.596v3.001zm2.598 0v3.596h-2.598V8.88h2.598v3.001z' />
                  </svg>
                  NPM Package
                </a>
                <a
                  href='https://unpkg.com/trustpilot-iframe-widget@1.0.0/dist/vanilla.min.js'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1 px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors'
                >
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                  </svg>
                  CDN Link
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className='flex flex-wrap justify-center items-center gap-3 sm:gap-4'>
              <a
                href='https://github.com/eduair94/trustpilot-carrousel'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                </svg>
                ⭐ Star on GitHub
              </a>
              <a
                href='https://trustpilot.checkleaked.com'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
                Commercial Services
              </a>
              <a
                href='https://www.linkedin.com/in/eduardo-airaudo/'
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Iframe Configurator Section */}
        <section className='mb-16'>
          <IframeConfigurator onConfigChange={handleConfigChange} />
        </section>

        {/* Live Demo Section */}
        <section className='mb-12 sm:mb-16'>
          <div className='bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden'>
            <div className='bg-gradient-to-r from-green-500 to-blue-500 px-4 sm:px-6 lg:px-8 py-6'>
              <h2 className='text-xl sm:text-2xl font-bold text-white mb-2'>
                📍 Additional Examples
              </h2>
              <p className='text-green-100 text-sm sm:text-base'>
                More examples with Google.com reviews using different
                configurations:
              </p>
            </div>

            <div className='p-4 sm:p-6 lg:p-8'>
              <div className='border-2 border-dashed border-gray-300 rounded-xl p-2 sm:p-4 bg-gray-50'>
                <IframeResizerDemo
                  src={`${origin}/?domain=${config.domain}&theme=${config.theme}&maxReviews=${config.maxReviews}&autoplay=${config.autoplay}`}
                  width='100%'
                  height='400'
                  className='rounded-lg shadow-lg bg-white'
                  style={{ minHeight: '400px', transition: 'height 0.3s ease' }}
                  title='Trustpilot Reviews Carousel Demo'
                />
              </div>

              <div className='mt-6 p-3 sm:p-4 bg-gray-100 rounded-lg'>
                <p className='text-sm text-gray-600 mb-2'>
                  <strong>Iframe Code:</strong>
                </p>
                <div className='bg-gray-800 text-green-400 p-3 rounded font-mono overflow-x-auto'>
                  <code className='text-xs sm:text-sm whitespace-pre-wrap break-all'>
                    {`<iframe src="${origin}/?domain=${config.domain}&theme=${config.theme}&maxReviews=${config.maxReviews}" width="100%" height="400" frameborder="0"></iframe>`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Theme Examples */}
        <section className='mb-12 sm:mb-16'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12'>
            🎨 Theme Examples
          </h2>

          <div className='grid md:grid-cols-2 gap-6 sm:gap-8'>
            {/* Light Theme */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='bg-yellow-100 px-4 sm:px-6 py-4 border-b'>
                <h3 className='text-lg sm:text-xl font-semibold text-gray-800'>
                  ☀️ Light Theme
                </h3>
              </div>
              <div className='p-4 sm:p-6'>
                <IframeResizerDemo
                  src={`${origin}/?domain=${config.domain}&theme=light&maxReviews=3&autoHeight=true`}
                  width='100%'
                  height='300'
                  className='rounded-lg border'
                  style={{ minHeight: '300px', transition: 'height 0.3s ease' }}
                  title='Light Theme Demo'
                />
              </div>
            </div>

            {/* Dark Theme */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='bg-gray-800 px-4 sm:px-6 py-4 border-b'>
                <h3 className='text-lg sm:text-xl font-semibold text-white'>
                  🌙 Dark Theme
                </h3>
              </div>
              <div className='p-4 sm:p-6'>
                <IframeResizerDemo
                  src={`${origin}/?domain=${config.domain}&theme=dark&maxReviews=3&autoHeight=true`}
                  width='100%'
                  height='300'
                  className='rounded-lg border'
                  style={{ minHeight: '300px', transition: 'height 0.3s ease' }}
                  title='Dark Theme Demo'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Auto Height Demo */}
        <section className='mb-16'>
          <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12'>
            🔧 Auto-Height Feature Demo
          </h2>

          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            <div className='bg-gradient-to-r from-green-500 to-teal-500 px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
              <h2 className='text-xl sm:text-2xl font-bold text-white mb-2'>
                📏 Dynamic Height Adjustment
              </h2>
              <p className='text-green-100 text-sm sm:text-base'>
                Watch how the iframe automatically adjusts its height based on
                content - no scrollbars needed!
              </p>
            </div>

            <div className='p-4 sm:p-6 lg:p-8'>
              <div className='grid gap-6 lg:gap-8 lg:grid-cols-2'>
                {/* Fixed Height Example */}
                <div>
                  <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4'>
                    ❌ Traditional Fixed Height (with scrollbar)
                  </h3>
                  <div className='border-2 border-dashed border-red-300 rounded-xl p-3 sm:p-4 bg-red-50'>
                    <IframeResizerDemo
                      src={`${origin}/?domain=${config.domain}&theme=light&maxReviews=5&height=200`}
                      width='100%'
                      height='200'
                      className='rounded-lg shadow-sm bg-white border w-full'
                      title='Fixed Height Example'
                    />
                  </div>
                  <p className='text-xs sm:text-sm text-gray-600 mt-2'>
                    Fixed 200px height - content may be cut off with scrollbars
                  </p>
                </div>

                {/* Auto Height Example */}
                <div>
                  <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4'>
                    ✅ Auto-Height with iframe-resizer
                  </h3>
                  <div className='border-2 border-dashed border-green-300 rounded-xl p-3 sm:p-4 bg-green-50'>
                    <div
                      id='auto-height-demo'
                      className='rounded-lg shadow-sm bg-white border'
                    >
                      <IframeResizerDemo
                        src={`${origin}/?domain=${config.domain}&theme=light&maxReviews=5&autoHeight=true`}
                        width='100%'
                        className='w-full rounded-lg'
                        title='Auto Height Example'
                        style={{ minHeight: '250px' }}
                      />
                    </div>
                  </div>
                  <p className='text-xs sm:text-sm text-gray-600 mt-2'>
                    Dynamic height - automatically adjusts to content size
                  </p>
                </div>
              </div>

              <div className='mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-xl border border-blue-200'>
                <h4 className='text-base sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-3'>
                  💡 Implementation Tip
                </h4>
                <p className='text-blue-700 mb-2 sm:mb-3 text-sm sm:text-base'>
                  To enable auto-height functionality, you need to:
                </p>
                <ol className='list-decimal list-inside text-blue-700 space-y-1 text-xs sm:text-sm'>
                  <li>
                    Add{' '}
                    <code className='bg-blue-200 px-2 py-1 rounded text-xs'>
                      autoHeight=true
                    </code>{' '}
                    to your iframe URL
                  </li>
                  <li>
                    Install and configure iframe-resizer on your parent page
                  </li>
                  <li>
                    The iframe will automatically communicate its content height
                    to the parent
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Options */}
        <section className='mb-12 sm:mb-16'>
          <div className='bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden'>
            <div className='bg-gradient-to-r from-purple-500 to-pink-500 px-4 sm:px-6 lg:px-8 py-6'>
              <h2 className='text-xl sm:text-2xl font-bold text-white mb-2'>
                ⚙️ Configuration Options
              </h2>
              <p className='text-purple-100 text-sm sm:text-base'>
                Customize the carousel with these URL parameters:
              </p>
            </div>

            <div className='p-4 sm:p-6 lg:p-8'>
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-gray-100'>
                      <th className='border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-sm sm:text-base'>
                        Parameter
                      </th>
                      <th className='border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-sm sm:text-base'>
                        Type
                      </th>
                      <th className='border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-sm sm:text-base'>
                        Default
                      </th>
                      <th className='border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-sm sm:text-base'>
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='border border-gray-300 px-4 py-2'>
                        <span className='text-red-600 font-semibold'>
                          domain*
                        </span>
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        string
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>-</td>
                      <td className='border border-gray-300 px-4 py-2'>
                        Domain to fetch reviews for (required)
                      </td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border border-gray-300 px-4 py-2'>
                        theme
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        light|dark
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        light
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        Visual theme
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-gray-300 px-4 py-2'>
                        maxReviews
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        number
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>10</td>
                      <td className='border border-gray-300 px-4 py-2'>
                        Maximum reviews to display (1-50)
                      </td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border border-gray-300 px-4 py-2'>
                        autoplay
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        boolean
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>true</td>
                      <td className='border border-gray-300 px-4 py-2'>
                        Enable automatic sliding
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-gray-300 px-4 py-2'>
                        interval
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        number
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>5000</td>
                      <td className='border border-gray-300 px-4 py-2'>
                        Autoplay interval (ms)
                      </td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border border-gray-300 px-4 py-2'>
                        minRating
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>1-5</td>
                      <td className='border border-gray-300 px-4 py-2'>1</td>
                      <td className='border border-gray-300 px-4 py-2'>
                        Minimum star rating to show
                      </td>
                    </tr>
                    <tr>
                      <td className='border border-gray-300 px-4 py-2'>
                        height
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        number
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>400</td>
                      <td className='border border-gray-300 px-4 py-2'>
                        Height in pixels
                      </td>
                    </tr>
                    <tr className='bg-gray-50'>
                      <td className='border border-gray-300 px-4 py-2'>
                        <span className='text-green-600 font-semibold'>
                          autoHeight
                        </span>
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        boolean
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        false
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>
                        Enable automatic iframe height adjustment (eliminates
                        scrollbars)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Examples */}
        <section className='mb-16'>
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-6'>
              <h2 className='text-2xl font-bold text-white mb-2'>
                🚀 Quick Integration
              </h2>
              <p className='text-blue-100'>
                Copy and paste these examples to get started:
              </p>
            </div>

            <div className='p-8'>
              <div className='space-y-6'>
                {/* Basic Example */}
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    Basic Example
                  </h3>
                  <div className='bg-gray-900 rounded-lg p-4 overflow-x-auto'>
                    <code className='text-green-400 text-sm font-mono'>
                      {`<iframe 
  src="${origin}/?domain=${config.domain}" 
  width="100%" 
  height="400" 
  frameborder="0"
  scrolling="no">
</iframe>`}
                    </code>
                  </div>
                </div>

                {/* Advanced Example */}
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                    Advanced Example
                  </h3>
                  <div className='bg-gray-900 rounded-lg p-4 overflow-x-auto'>
                    <code className='text-green-400 text-sm font-mono'>
                      {`<iframe 
  src="${origin}/?domain=${config.domain}&theme=dark&maxReviews=8&minRating=4&autoplay=true&interval=4000" 
  width="100%" 
  height="450" 
  frameborder="0"
  scrolling="no">
</iframe>`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Try It Section */}
        <section className='text-center'>
          <div className='bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-xl p-12 text-white'>
            <h2 className='text-3xl font-bold mb-4'>🎯 Try It Now</h2>
            <p className='text-xl mb-8 opacity-90'>
              Currently showing reviews for &quot;{config.domain}&quot; - change
              the domain in the configurator above to see different reviews
            </p>

            <div className='grid md:grid-cols-3 gap-4 max-w-4xl mx-auto'>
              <Link
                href={`/?domain=${config.domain}&theme=light&maxReviews=5`}
                className='bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 hover:scale-105'
              >
                <div className='text-lg font-semibold'>{config.domain}</div>
                <div className='text-sm opacity-80'>Light Theme</div>
              </Link>

              <Link
                href={`/?domain=${config.domain}&theme=dark&maxReviews=5`}
                className='bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 hover:scale-105'
              >
                <div className='text-lg font-semibold'>{config.domain}</div>
                <div className='text-sm opacity-80'>Dark Theme</div>
              </Link>

              <Link
                href={`/?domain=${config.domain}&theme=light&maxReviews=8&minRating=4`}
                className='bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-4 transition-all duration-200 hover:scale-105'
              >
                <div className='text-lg font-semibold'>{config.domain}</div>
                <div className='text-sm opacity-80'>High Quality</div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='bg-gray-800 text-white py-12 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Implementation Instructions */}
          <div className='mb-12'>
            <h2 className='text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center'>
              🔧 How to Implement Auto-Resizing Iframes
            </h2>

            <div className='bg-gray-700 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8'>
              <h3 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4'>
                For Parent Pages (Your Website)
              </h3>
              <p className='text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base'>
                To enable automatic iframe height adjustment, you need to use
                the iframe-resizer library on your website:
              </p>

              <div className='space-y-3 sm:space-y-4'>
                <div>
                  <h4 className='text-sm sm:text-md font-semibold text-green-400 mb-2'>
                    1. Install the Package
                  </h4>
                  <div className='bg-gray-900 rounded-lg p-2 sm:p-3 overflow-x-auto'>
                    <code className='text-green-400 text-xs sm:text-sm font-mono'>
                      npm install @iframe-resizer/parent
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className='text-sm sm:text-md font-semibold text-green-400 mb-2'>
                    2. Use the React Component (Recommended)
                  </h4>
                  <div className='bg-gray-900 rounded-lg p-2 sm:p-3 overflow-x-auto'>
                    <pre className='text-green-400 text-xs sm:text-sm font-mono whitespace-pre-wrap'>
                      {`// First install the React package:
// npm install @iframe-resizer/react

import IframeResizer from '@iframe-resizer/react';

<IframeResizer
  license="GPLv3"
  src="${origin}/?domain=your-domain.com&autoHeight=true"
  style={{ width: '100%', minHeight: '400px' }}
  checkOrigin={false}
  log={false}
  waitForLoad={true}
/>`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className='text-sm sm:text-md font-semibold text-green-400 mb-2'>
                    3. Or Use Standard HTML with JavaScript
                  </h4>
                  <div className='bg-gray-900 rounded-lg p-2 sm:p-3 overflow-x-auto'>
                    <pre className='text-green-400 text-xs sm:text-sm font-mono whitespace-pre-wrap'>
                      {`<!-- Include the parent script -->
<script src="https://cdn.jsdelivr.net/npm/@iframe-resizer/parent"></script>

<!-- Your iframe with autoHeight=true -->
<iframe 
  id="trustpilot-reviews"
  src="${origin}/?domain=your-domain.com&autoHeight=true"
  width="100%" 
  height="400"
  scrolling="no">
</iframe>

<script>
  iframeResize({ license: 'GPLv3' }, '#trustpilot-reviews');
</script>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-blue-900 rounded-2xl p-4 sm:p-6'>
              <h3 className='text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4'>
                ⚠️ Important Notes
              </h3>
              <ul className='text-blue-100 space-y-2 list-disc list-inside text-sm sm:text-base'>
                <li>
                  Always include{' '}
                  <code className='bg-blue-800 px-2 py-1 rounded text-xs'>
                    autoHeight=true
                  </code>{' '}
                  in the iframe URL to enable server-side auto-resizing
                </li>
                <li>
                  The iframe will automatically adjust its height based on the
                  content inside
                </li>
                <li>
                  No more scrollbars or fixed heights - the iframe grows and
                  shrinks as needed
                </li>
                <li>
                  Works across different domains securely using postMessage API
                </li>
                <li className='break-words'>
                  For commercial use, you need to purchase a license from{' '}
                  <a
                    href='https://iframe-resizer.com/pricing'
                    className='text-blue-300 underline hover:text-blue-200 transition-colors'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    iframe-resizer.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Creator Links and Credits */}
          <div className='text-center border-t border-gray-700 pt-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
              <a
                href='https://github.com/eduair94/trustpilot-carrousel'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center space-x-2 text-white hover:text-blue-400 transition-colors bg-gray-800 py-2 px-4 rounded-lg'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                </svg>
                <span>⭐ Star on GitHub</span>
              </a>

              <a
                href='https://www.npmjs.com/package/trustpilot-iframe-widget'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center space-x-2 text-white hover:text-red-400 transition-colors bg-red-700 py-2 px-4 rounded-lg'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zM5.13 5.323l13.837.019-.009 5.183H13.82v-1.647h3.596V6.874H5.132l-.002-1.551zm4.257 6.557v3.596H6.791V8.88h2.596v3.001zm2.598 0v3.596h-2.598V8.88h2.598v3.001z' />
                </svg>
                <span>NPM Package</span>
              </a>

              <a
                href='https://trustpilot.checkleaked.com'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center space-x-2 text-white hover:text-green-400 transition-colors bg-green-700 py-2 px-4 rounded-lg'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
                <span>Commercial Services</span>
              </a>

              <a
                href='https://www.linkedin.com/in/eduardo-airaudo/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center space-x-2 text-white hover:text-blue-400 transition-colors bg-blue-700 py-2 px-4 rounded-lg'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>

            <div className='text-gray-400 text-sm space-y-2'>
              <p>
                🎠 <strong>Trustpilot Reviews Carousel</strong> - Created by
                Eduardo Airaudo
              </p>
              <p>
                📦 Open Source NPM Package:
                <code className='bg-gray-800 px-2 py-1 rounded mx-1'>
                  trustpilot-iframe-widget@1.0.0
                </code>
              </p>
              <p>
                Powered by Next.js 15, Swiper.js, Tailwind CSS & iframe-resizer
              </p>
              <p className='text-xs text-gray-500 mt-4'>
                This project is open source and available under the MIT License.
                <br />
                🌟 If you find this useful, please star our
                <a
                  href='https://github.com/eduair94/trustpilot-carrousel'
                  className='text-blue-400 hover:text-blue-300 mx-1 underline'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  GitHub repository
                </a>
                to support the project!
                <br />
                iframe-resizer is licensed under GPLv3 for open source projects.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
