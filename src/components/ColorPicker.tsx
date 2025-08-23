'use client';

import { HexColorPicker } from 'react-colorful';
import { useState, useRef, useEffect } from 'react';

// ============================================
// COLOR PICKER COMPONENT
// ============================================

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  showPreset?: boolean;
}

export function ColorPicker({ 
  label, 
  value, 
  onChange, 
  disabled = false,
  showPreset = true 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorChange = (color: string) => {
    setLocalValue(color);
    onChange(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Validate hex color format before calling onChange
    if (/^#[0-9A-F]{6}$/i.test(newValue) || newValue === 'transparent') {
      onChange(newValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure valid format on blur
    if (localValue !== 'transparent' && !/^#[0-9A-F]{6}$/i.test(localValue)) {
      const correctedValue = value || '#000000';
      setLocalValue(correctedValue);
      onChange(correctedValue);
    }
  };

  const presetColors = [
    '#00b67a', // Trustpilot Green
    '#ffffff', // White
    '#000000', // Black  
    '#f3f4f6', // Light Gray
    '#1f2937', // Dark Gray
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#f59e0b', // Yellow
    '#10b981', // Green
    '#8b5cf6', // Purple
    'transparent', // Transparent
  ];

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="flex items-center gap-2">
        {/* Color Preview Button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-500 cursor-pointer'}
            ${localValue === 'transparent' ? 'bg-transparent' : ''}
          `}
          style={{ 
            backgroundColor: localValue === 'transparent' ? 'transparent' : localValue,
            backgroundImage: localValue === 'transparent' 
              ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
              : 'none',
            backgroundSize: localValue === 'transparent' ? '8px 8px' : 'auto',
            backgroundPosition: localValue === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
          }}
        >
          {localValue === 'transparent' && (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 font-semibold">
              T
            </div>
          )}
        </button>

        {/* Color Input */}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          placeholder="#000000 or transparent"
          className={`
            flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-purple-500 focus:border-transparent
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
        />

        {/* Clear Button */}
        <button
          type="button"
          onClick={() => handleColorChange('transparent')}
          disabled={disabled}
          className={`
            px-3 py-2 text-xs text-gray-600 hover:text-gray-800 rounded-lg
            hover:bg-gray-100 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          Clear
        </button>
      </div>

      {/* Color Picker Popover */}
      {isOpen && !disabled && (
        <div 
          ref={popoverRef}
          className="absolute top-full left-0 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          {/* Color Picker */}
          {localValue !== 'transparent' && (
            <div className="mb-4">
              <HexColorPicker 
                color={localValue === 'transparent' ? '#000000' : localValue} 
                onChange={handleColorChange}
              />
            </div>
          )}

          {/* Preset Colors */}
          {showPreset && (
            <div>
              <div className="text-xs font-medium text-gray-700 mb-2">Presets</div>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleColorChange(preset)}
                    className={`
                      w-8 h-8 rounded-md border-2 transition-all
                      ${localValue === preset 
                        ? 'border-purple-500 ring-2 ring-purple-200' 
                        : 'border-gray-300 hover:border-purple-400'
                      }
                      ${preset === 'transparent' ? 'bg-transparent' : ''}
                    `}
                    style={{
                      backgroundColor: preset === 'transparent' ? 'transparent' : preset,
                      backgroundImage: preset === 'transparent' 
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : 'none',
                      backgroundSize: preset === 'transparent' ? '4px 4px' : 'auto',
                      backgroundPosition: preset === 'transparent' ? '0 0, 0 2px, 2px -2px, -2px 0px' : 'auto'
                    }}
                  >
                    {preset === 'transparent' && (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 font-bold">
                        T
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transparency Button */}
          <button
            type="button"
            onClick={() => handleColorChange('transparent')}
            className="mt-3 w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Make Transparent
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================
// THEME PRESET PICKER
// ============================================

interface ThemePresetPickerProps {
  value: 'light' | 'dark' | 'custom';
  onChange: (theme: 'light' | 'dark' | 'custom') => void;
}

export function ThemePresetPicker({ value, onChange }: ThemePresetPickerProps) {
  const themes = [
    {
      key: 'light' as const,
      name: '🌞 Light',
      description: 'Clean white background',
      preview: {
        bg: '#ffffff',
        surface: '#f7f8fc',
        text: '#191919',
        primary: '#00b67a'
      }
    },
    {
      key: 'dark' as const,
      name: '🌙 Dark',
      description: 'Dark elegant style',
      preview: {
        bg: '#1a1a1a',
        surface: '#2d2d2d',
        text: '#ffffff',
        primary: '#00b67a'
      }
    },
    {
      key: 'custom' as const,
      name: '🎨 Custom',
      description: 'Transparent & customizable',
      preview: {
        bg: 'transparent',
        surface: 'rgba(255, 255, 255, 0.95)',
        text: '#191919',
        primary: '#00b67a'
      }
    }
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Base Theme
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {themes.map((theme) => (
          <label 
            key={theme.key}
            className={`
              flex items-center p-3 border rounded-lg cursor-pointer transition-all
              ${value === theme.key 
                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                : 'border-gray-300 hover:border-purple-300 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              name="theme"
              value={theme.key}
              checked={value === theme.key}
              onChange={(e) => onChange(e.target.value as 'light' | 'dark' | 'custom')}
              className="sr-only"
            />
            <div className="flex-1">
              <div className="font-medium text-sm mb-1">{theme.name}</div>
              <div className="text-xs text-gray-500 mb-2">{theme.description}</div>
              
              {/* Theme Preview */}
              <div className="flex gap-1">
                <div 
                  className="w-4 h-4 rounded-sm border border-gray-200"
                  style={{ 
                    backgroundColor: theme.preview.bg === 'transparent' ? '#fff' : theme.preview.bg,
                    backgroundImage: theme.preview.bg === 'transparent'
                      ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)'
                      : 'none',
                    backgroundSize: theme.preview.bg === 'transparent' ? '4px 4px' : 'auto',
                    backgroundPosition: theme.preview.bg === 'transparent' ? '0 0, 0 2px, 2px -2px, -2px 0px' : 'auto'
                  }}
                />
                <div 
                  className="w-4 h-4 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.preview.surface }}
                />
                <div 
                  className="w-4 h-4 rounded-sm border border-gray-200"
                  style={{ backgroundColor: theme.preview.primary }}
                />
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
