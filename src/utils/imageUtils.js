// Utility functions for handling product images

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x280?text=No+Image';

/**
 * Validates if an image URL is valid and accessible
 * @param {string} url - The image URL to validate
 * @returns {boolean} - True if the URL is valid
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  // Check for common invalid patterns
  const invalidPatterns = [
    'https://api.escuelajs.cohttps://api.escuelajs.co',
    '/api/v1/files/',
    'undefined',
    'null',
    '[object Object]'
  ];
  
  if (
    url.trim() === '' ||
    invalidPatterns.some(pattern => url.includes(pattern)) ||
    url.length < 10
  ) {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Cleans up malformed image URLs
 * @param {string} url - The potentially malformed URL
 * @returns {string} - The cleaned URL or fallback
 */
export const cleanImageUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return FALLBACK_IMAGE;
  }

  let cleanedUrl = url;
  
  // Fix duplicate domain issue
  if (url.includes('https://api.escuelajs.cohttps://api.escuelajs.co')) {
    cleanedUrl = url.replace('https://api.escuelajs.cohttps://api.escuelajs.co', 'https://api.escuelajs.co');
  }
  
  // Fix double https:// issue
  if (cleanedUrl.match(/https:\/\/.*https:\/\//)) {
    cleanedUrl = cleanedUrl.replace(/https:\/\/.*https:\/\//, 'https://');
  }
  
  // Ensure URL is well-formed
  try {
    new URL(cleanedUrl);
    return cleanedUrl;
  } catch {
    return FALLBACK_IMAGE;
  }
};

/**
 * Gets the first valid image from an array or string of image URLs
 * @param {string[]|string} images - Array or string of image URLs
 * @returns {string} - The first valid image URL or fallback
 */
export const getFirstValidImage = (images) => {
  if (!images) return FALLBACK_IMAGE;
  
  if (Array.isArray(images)) {
    const validImage = images
      .map(img => cleanImageUrl(img))
      .find(img => isValidImageUrl(img));
    return validImage || FALLBACK_IMAGE;
  }
  
  const cleanedImage = cleanImageUrl(images);
  return isValidImageUrl(cleanedImage) ? cleanedImage : FALLBACK_IMAGE;
};

/**
 * Checks if a product has valid images
 * @param {Object} product - The product object
 * @returns {boolean} - True if product has valid images
 */
export const hasValidImages = (product) => {
  if (!product || !product.images || !Array.isArray(product.images)) {
    return false;
  }
  
  return product.images.some(img => isValidImageUrl(img));
};