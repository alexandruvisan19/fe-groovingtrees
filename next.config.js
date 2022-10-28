const indexSearch = require('./plugins/search-index');
const feed = require('./plugins/feed');
const sitemap = require('./plugins/sitemap');

// const withImages = require('next-images');
// const withPlugins = require('next-compose-plugins');
// const shouldAnalyzeBundles = process.env.ANALYZE === 'true';
// const withBundleAnalyzer = shouldAnalyzeBundles
//   ? require('@next/bundle-analyzer')({ enabled: true })
//   : (config) => config;

// module.exports = withPlugins([withBundleAnalyzer, withImages]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ['i0.wp.com', 'i1.wp.com', 'i2.wp.com'] },
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,

  env: {
    OG_IMAGE_DIRECTORY: '/images/og',
    POSTS_PRERENDER_COUNT: 5,
    WORDPRESS_GRAPHQL_ENDPOINT: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    WORDPRESS_MENU_LOCATION_NAVIGATION: process.env.WORDPRESS_MENU_LOCATION_NAVIGATION || 'PRIMARY',
    WORDPRESS_PLUGIN_SEO: parseEnvValue(process.env.WORDPRESS_PLUGIN_SEO, false),
  },
};

module.exports = () => {
  const plugins = [indexSearch, feed, sitemap];
  return plugins.reduce((acc, plugin) => plugin(acc), nextConfig);
};

/**
 * parseEnv
 * @description Helper function to check if a variable is defined and parse booelans
 */

function parseEnvValue(value, defaultValue) {
  if (typeof value === 'undefined') return defaultValue;
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return value;
}
