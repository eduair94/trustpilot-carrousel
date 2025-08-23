'use client';

import { CarrouselConfig, CarrouselConfigSchema } from '@/lib/types';
import { useEffect, useState } from 'react';
import { ColorPicker, ThemePresetPicker } from './ColorPicker';
import { IframeResizerDemo } from './IframeResizerDemo';

interface IframeConfiguratorProps {
  onConfigChange?: (config: CarrouselConfig) => void;
}

export function IframeConfigurator({
  onConfigChange,
}: IframeConfiguratorProps) {
  const [origin, setOrigin] = useState('');
  const [config, setConfig] = useState<CarrouselConfig>({
    domain: 'www.google.com',
    page: 1,
    autoplay: true,
    interval: 5000,
    theme: 'custom',
    maxReviews: 5,
    minRating: 1,
    language: 'en',
    hideRating: false,
    hideDate: false,
    hideAvatar: false,
    hideReply: false,
    hideGlobalReviews: false,
    hideTopBanner: false,
    height: 400,
    width: '100%',
    autoHeight: true,
    // Enhanced color customization (transparent by default)
    backgroundColor: 'transparent',
    textColor: '#191919',
    primaryColor: '#00b67a',
    surfaceColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: 'rgba(229, 231, 235, 0.8)',
    starColor: '#ffc107',
    transparent: true,
  });
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Set the origin when component mounts (client-side only)
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    // Notify parent component of config changes
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  const handleInputChange = (
    field: keyof CarrouselConfig,
    value: string | number | boolean
  ) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateIframeUrl = () => {
    const params = new URLSearchParams();

    // Add all non-default parameters
    params.append('domain', config.domain);
    if (config.page && config.page !== 1)
      params.append('page', config.page.toString());
    if (config.autoplay !== undefined && config.autoplay !== true)
      params.append('autoplay', config.autoplay.toString());
    if (config.interval && config.interval !== 5000)
      params.append('interval', config.interval.toString());
    if (config.theme && config.theme !== 'light')
      params.append('theme', config.theme);
    if (config.maxReviews && config.maxReviews !== 5)
      params.append('maxReviews', config.maxReviews.toString());
    if (config.minRating && config.minRating !== 1)
      params.append('minRating', config.minRating.toString());
    if (config.language && config.language !== 'en')
      params.append('language', config.language);
    if (config.hideRating !== undefined && config.hideRating !== false)
      params.append('hideRating', config.hideRating.toString());
    if (config.hideDate !== undefined && config.hideDate !== false)
      params.append('hideDate', config.hideDate.toString());
    if (config.hideAvatar !== undefined && config.hideAvatar !== false)
      params.append('hideAvatar', config.hideAvatar.toString());
    if (config.hideReply !== undefined && config.hideReply !== false)
      params.append('hideReply', config.hideReply.toString());
    if (
      config.hideGlobalReviews !== undefined &&
      config.hideGlobalReviews !== false
    )
      params.append('hideGlobalReviews', config.hideGlobalReviews.toString());
    if (config.hideTopBanner !== undefined && config.hideTopBanner !== false)
      params.append('hideTopBanner', config.hideTopBanner.toString());
    if (config.height && config.height !== 400)
      params.append('height', config.height.toString());
    if (config.autoHeight !== undefined && config.autoHeight !== false)
      params.append('autoHeight', config.autoHeight.toString());
    // Enhanced color customization
    if (config.backgroundColor && config.backgroundColor !== 'transparent')
      params.append('backgroundColor', config.backgroundColor);
    if (config.textColor && config.textColor !== '#191919')
      params.append('textColor', config.textColor);
    if (config.primaryColor && config.primaryColor !== '#00b67a')
      params.append('primaryColor', config.primaryColor);
    if (
      config.surfaceColor &&
      config.surfaceColor !== 'rgba(255, 255, 255, 0.95)'
    )
      params.append('surfaceColor', config.surfaceColor);
    if (config.borderColor && config.borderColor !== 'rgba(229, 231, 235, 0.8)')
      params.append('borderColor', config.borderColor);
    if (config.starColor && config.starColor !== '#ffc107')
      params.append('starColor', config.starColor);
    if (config.transparent !== undefined && config.transparent !== true)
      params.append('transparent', config.transparent.toString());

    return `${origin}/?${params.toString()}`;
  };

  const generateIframeCode = () => {
    const url = generateIframeUrl();
    const width =
      typeof config.width === 'string'
        ? config.width
        : `${config.width || 100}px`;
    const height = config.height || 400;

    return `<iframe
  src="${url}"
  width="${width}"
  height="${height}"
  frameborder="0"
  scrolling="no"
  title="Trustpilot Reviews Carousel"
></iframe>`;
  };

  const copyToClipboard = async () => {
    const code = generateIframeCode();

    try {
      if ('clipboard' in navigator) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate the configuration
      CarrouselConfigSchema.parse(config);
      // Form is valid, the preview should already be updated via useEffect
    } catch (error) {
      console.error('Configuration validation failed:', error);
    }
  };

  return (
    <div className='bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden'>
      <div className='bg-gradient-to-r from-purple-500 to-indigo-500 px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
        <h2 className='text-xl sm:text-2xl font-bold text-white mb-2'>
          🛠️ Iframe Configurator
        </h2>
        <p className='text-purple-100 text-sm sm:text-base'>
          Customize your reviews carousel and get the embed code
        </p>
      </div>

      <div className='md:grid xl:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8'>
        {/* Configuration Form */}
        <div className='order-2 xl:order-1'>
          <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
            {/* Domain Input */}
            <div>
              <label
                htmlFor='domain'
                className='block text-sm font-semibold text-gray-700 mb-2'
              >
                Domain *
              </label>
              <input
                type='text'
                id='domain'
                value={config.domain}
                onChange={e => handleInputChange('domain', e.target.value)}
                placeholder='google.com'
                className='w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base'
                required
              />
              <p className='text-xs text-gray-500 mt-1'>
                The domain to fetch reviews from (without https://)
              </p>
            </div>

            {/* Theme Selection */}
            <div>
              <ThemePresetPicker
                value={config.theme || 'custom'}
                onChange={theme => handleInputChange('theme', theme)}
              />
            </div>

            {/* Color Customization */}
            {config.theme === 'custom' && (
              <div className='space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200'>
                <h4 className='text-sm font-semibold text-purple-800 mb-3'>
                  🎨 Color Customization
                </h4>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <ColorPicker
                    label='Background Color'
                    value={config.backgroundColor || 'transparent'}
                    onChange={color =>
                      handleInputChange('backgroundColor', color)
                    }
                  />

                  <ColorPicker
                    label='Text Color'
                    value={config.textColor || '#191919'}
                    onChange={color => handleInputChange('textColor', color)}
                  />

                  <ColorPicker
                    label='Primary Color'
                    value={config.primaryColor || '#00b67a'}
                    onChange={color => handleInputChange('primaryColor', color)}
                  />

                  <ColorPicker
                    label='Surface Color'
                    value={config.surfaceColor || 'rgba(255, 255, 255, 0.95)'}
                    onChange={color => handleInputChange('surfaceColor', color)}
                  />

                  <ColorPicker
                    label='Border Color'
                    value={config.borderColor || 'rgba(229, 231, 235, 0.8)'}
                    onChange={color => handleInputChange('borderColor', color)}
                  />

                  <ColorPicker
                    label='Star Color'
                    value={config.starColor || '#ffc107'}
                    onChange={color => handleInputChange('starColor', color)}
                  />
                </div>

                {/* Transparency Toggle */}
                <div className='flex items-center space-x-3 p-3 bg-white rounded-lg border'>
                  <input
                    type='checkbox'
                    id='transparent'
                    checked={config.transparent !== false}
                    onChange={e =>
                      handleInputChange('transparent', e.target.checked)
                    }
                    className='w-4 h-4 text-purple-500 rounded focus:ring-2 focus:ring-purple-500'
                  />
                  <label
                    htmlFor='transparent'
                    className='text-sm text-gray-700 cursor-pointer flex-1'
                  >
                    <span className='font-semibold'>
                      Transparent Background
                    </span>
                    <span className='block text-xs text-gray-600 mt-1'>
                      Make the carousel background transparent for better
                      embedding
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Reviews Settings */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div>
                <label
                  htmlFor='maxReviews'
                  className='block text-sm font-semibold text-gray-700 mb-2'
                >
                  Max Reviews
                </label>
                <select
                  id='maxReviews'
                  value={config.maxReviews}
                  onChange={e =>
                    handleInputChange('maxReviews', parseInt(e.target.value))
                  }
                  className='w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base'
                >
                  {[3, 5, 10, 15, 20, 25, 30].map(num => (
                    <option key={num} value={num}>
                      {num} reviews
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor='minRating'
                  className='block text-sm font-semibold text-gray-700 mb-2'
                >
                  Min Rating
                </label>
                <select
                  id='minRating'
                  value={config.minRating}
                  onChange={e =>
                    handleInputChange('minRating', parseInt(e.target.value))
                  }
                  className='w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base'
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} star{rating > 1 ? 's' : ''} and above
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Autoplay Settings */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div className='sm:col-span-1'>
                <label className='flex items-center space-x-3'>
                  <input
                    type='checkbox'
                    checked={config.autoplay}
                    onChange={e =>
                      handleInputChange('autoplay', e.target.checked)
                    }
                    className='w-4 sm:w-5 h-4 sm:h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-500'
                  />
                  <div>
                    <div className='font-semibold text-gray-700 text-sm sm:text-base'>
                      Autoplay
                    </div>
                    <div className='text-xs sm:text-sm text-gray-500'>
                      Auto-advance slides
                    </div>
                  </div>
                </label>
              </div>

              {config.autoplay && (
                <div className='sm:col-span-1'>
                  <label
                    htmlFor='interval'
                    className='block text-sm font-semibold text-gray-700 mb-2'
                  >
                    Interval (ms)
                  </label>
                  <select
                    id='interval'
                    value={config.interval}
                    onChange={e =>
                      handleInputChange('interval', parseInt(e.target.value))
                    }
                    className='w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base'
                  >
                    <option value={3000}>3 seconds</option>
                    <option value={5000}>5 seconds</option>
                    <option value={8000}>8 seconds</option>
                    <option value={10000}>10 seconds</option>
                  </select>
                </div>
              )}
            </div>

            {/* Display Options */}
            <div>
              <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                Display Options
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
                {[
                  { key: 'hideRating', label: 'Hide Rating' },
                  { key: 'hideDate', label: 'Hide Date' },
                  { key: 'hideAvatar', label: 'Hide Avatar' },
                  { key: 'hideReply', label: 'Hide Replies' },
                  { key: 'hideGlobalReviews', label: 'Hide Global Reviews' },
                  { key: 'hideTopBanner', label: 'Hide Top Banner' },
                ].map(({ key, label }) => (
                  <label key={key} className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      checked={config[key as keyof CarrouselConfig] as boolean}
                      onChange={e =>
                        handleInputChange(
                          key as keyof CarrouselConfig,
                          e.target.checked
                        )
                      }
                      className='w-4 h-4 text-purple-500 rounded focus:ring-2 focus:ring-purple-500'
                    />
                    <span className='text-xs sm:text-sm text-gray-700'>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
              <div>
                <label
                  htmlFor='width'
                  className='block text-sm font-semibold text-gray-700 mb-2'
                >
                  Width
                </label>
                <input
                  type='text'
                  id='width'
                  value={config.width}
                  onChange={e => handleInputChange('width', e.target.value)}
                  placeholder='100%'
                  className='w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base'
                />
              </div>

              <div>
                <label
                  htmlFor='height'
                  className='block text-sm font-semibold text-gray-700 mb-2'
                >
                  Height (px)
                </label>
                <input
                  type='number'
                  id='height'
                  value={config.height}
                  onChange={e =>
                    handleInputChange('height', parseInt(e.target.value))
                  }
                  min={200}
                  max={800}
                  disabled={config.autoHeight}
                  className={`w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${
                    config.autoHeight ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            {/* Auto Height Option */}
            <div className='flex items-start space-x-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <input
                type='checkbox'
                id='autoHeight'
                checked={config.autoHeight || false}
                onChange={e =>
                  handleInputChange('autoHeight', e.target.checked)
                }
                className='w-4 h-4 text-purple-500 rounded focus:ring-2 focus:ring-purple-500 mt-1'
              />
              <label
                htmlFor='autoHeight'
                className='text-sm text-gray-700 cursor-pointer flex-1'
              >
                <span className='font-semibold block sm:inline'>
                  Auto Height
                </span>
                <span className='text-gray-600 block text-xs sm:text-sm mt-1 sm:mt-0 sm:ml-2'>
                  Automatically adjust iframe height to fit content (removes
                  scrollbars)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition duration-200 shadow-lg text-sm sm:text-base'
            >
              🎨 Update Preview
            </button>
          </form>
        </div>

        {/* Preview and Code */}
        <div className='space-y-4 sm:space-y-6 order-1 xl:order-2'>
          {/* Live Preview */}
          <div>
            <h3 className='text-lg font-semibold text-gray-800 mb-3 sm:mb-4'>
              📺 Live Preview
            </h3>
            <div className='border-2 border-dashed border-gray-300 rounded-xl p-2 sm:p-4 bg-gray-50'>
              <IframeResizerDemo
                src={generateIframeUrl()}
                width='100%'
                height={config.height || 400}
                className='rounded-lg w-full'
                style={{
                  minHeight: `${Math.min(config.height || 400, 300)}px`,
                  maxHeight: `${config.height || 400}px`,
                  transition: 'height 0.3s ease',
                }}
                title='Trustpilot Reviews Carousel Preview'
              />
            </div>
          </div>

          {/* Generated Code */}
          <div>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4'>
              <h3 className='text-lg font-semibold text-gray-800'>
                📝 Embed Code
              </h3>
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 text-sm sm:text-base whitespace-nowrap ${
                  copySuccess
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200'
                }`}
              >
                {copySuccess ? <>✅ Copied!</> : <>📋 Copy Code</>}
              </button>
            </div>
            <div className='bg-gray-900 rounded-lg p-3 sm:p-4 overflow-x-auto'>
              <pre className='text-green-400 text-xs sm:text-sm font-mono leading-relaxed'>
                <code>{generateIframeCode()}</code>
              </pre>
            </div>
            <p className='text-xs sm:text-sm text-gray-500 mt-2'>
              Copy this code and paste it into your website where you want the
              carousel to appear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
