import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';
import dts from 'rollup-plugin-dts';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

const banner = `/*!
 * ${packageJson.name} v${packageJson.version}
 * ${packageJson.description}
 * ${packageJson.homepage}
 * 
 * Copyright (c) 2025 ${packageJson.author}
 * Licensed under ${packageJson.license}
 */`;

// Common plugins
const commonPlugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
  }),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: false,
  }),
];

// UMD build for CDN usage (React components)
const umdConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'TrustpilotIframe',
    banner,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  external: ['react', 'react-dom'],
  plugins: [
    ...commonPlugins,
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    }),
  ],
};

// Vanilla JavaScript CDN build (no React dependencies)
const vanillaCdnConfig = {
  input: 'src/cdn.ts',
  output: {
    file: 'dist/vanilla.umd.js',
    format: 'umd',
    name: 'TrustpilotWidget',
    banner,
  },
  plugins: [
    ...commonPlugins,
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { targets: { browsers: ['> 1%', 'last 2 versions'] } }],
      ],
    }),
    terser({
      format: {
        comments: /^!/,
      },
    }),
  ],
};

// ESM build
const esmConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.esm.js',
    format: 'es',
    banner,
  },
  external: ['react', 'react-dom', '@iframe-resizer/parent'],
  plugins: commonPlugins,
};

// CommonJS build
const cjsConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    banner,
  },
  external: ['react', 'react-dom', '@iframe-resizer/parent'],
  plugins: commonPlugins,
};

// Minified Vanilla JavaScript CDN build
const vanillaCdnMinConfig = {
  input: 'src/cdn.ts',
  output: {
    file: 'dist/vanilla.min.js',
    format: 'umd',
    name: 'TrustpilotWidget',
    banner,
  },
  plugins: [
    ...commonPlugins,
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
      ],
    }),
    terser({
      format: {
        comments: /^!/,
      },
    }),
  ],
};

// TypeScript definitions
const dtsConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts',
  },
  plugins: [dts()],
};

const configs = [
  umdConfig, 
  esmConfig, 
  cjsConfig, 
  vanillaCdnConfig, 
  vanillaCdnMinConfig, 
  dtsConfig
];

export default configs;
