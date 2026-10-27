import type { NextConfig } from 'next';

/**
 * Fully static output (ADR 0001): the build must produce plain files in `out/`
 * with no runtime server features. That forces `images.unoptimized` — there is
 * no image optimization server in production.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  /**
   * Two root layouts (ADR 0002) leave no layout to wrap a 404. Next ignores
   * `global-not-found.tsx` unless this is on, and an unknown URL would then
   * ship the framework's unstyled page.
   */
  experimental: { globalNotFound: true },
};

export default nextConfig;
