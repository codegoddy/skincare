/**
 * Image optimization utilities for faster loading
 */

/**
 * Generate a tiny blur data URL for placeholder
 * This creates a very small base64 encoded image for blur-up effect
 */
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="20%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

/**
 * Generate blur placeholder for Image component
 */
export const getBlurDataURL = (width = 700, height = 475) => {
  return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;
};

/**
 * Check if image is from Cloudinary and can be optimized
 */
export const isCloudinaryImage = (src: string): boolean => {
  return src.includes('res.cloudinary.com');
};

/**
 * Optimize Cloudinary image URL with transformations
 * Adds automatic format (webp/avif), quality optimization, and responsive sizing
 */
export const optimizeCloudinaryUrl = (
  src: string,
  options?: {
    width?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif';
  }
): string => {
  if (!isCloudinaryImage(src)) return src;

  const { width, quality = 'auto', format = 'auto' } = options || {};

  // Parse Cloudinary URL
  const urlParts = src.split('/upload/');
  if (urlParts.length !== 2) return src;

  const [baseUrl, imagePath] = urlParts;

  // Build transformation string
  const transformations: string[] = [];

  // Automatic format selection (serves webp/avif when supported)
  transformations.push(`f_${format}`);

  // Quality optimization
  transformations.push(`q_${quality}`);

  // Width if specified
  if (width) {
    transformations.push(`w_${width}`);
    transformations.push('c_limit'); // Don't upscale
  }

  // Add transformations to URL
  return `${baseUrl}/upload/${transformations.join(',')}/${imagePath}`;
};

/**
 * Get responsive srcSet for Cloudinary images
 */
export const getCloudinarySrcSet = (src: string): string | undefined => {
  if (!isCloudinaryImage(src)) return undefined;

  const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  
  return widths
    .map(width => {
      const optimizedUrl = optimizeCloudinaryUrl(src, { width });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string, options?: { as?: 'image'; fetchpriority?: 'high' | 'low' | 'auto' }) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = options?.as || 'image';
  link.href = src;
  if (options?.fetchpriority) {
    link.setAttribute('fetchpriority', options.fetchpriority);
  }
  document.head.appendChild(link);
};

/**
 * Check if image should be loaded with priority (above the fold)
 */
export const shouldPrioritize = (index: number, maxPriority = 6): boolean => {
  return index < maxPriority;
};
