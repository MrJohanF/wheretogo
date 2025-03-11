// src/app/services/cloudinary.js
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Uploads an image to Cloudinary with AVIF optimization
 */
export async function uploadImageToCloudinary(file, options = {}) {
  try {
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error("Cloudinary cloud name is not defined");
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
    
    // Temporarily remove format restriction for testing
    formData.append('format', 'avif');
    formData.append('quality', 'auto');
    
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    console.log("Uploading to:", uploadUrl);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      // Try to get detailed error information
      let errorDetails = response.statusText;
      try {
        const errorData = await response.json();
        console.error("Cloudinary error response:", errorData);
        errorDetails = JSON.stringify(errorData);
      } catch (e) {
        // Use status text if JSON parsing fails
      }
      
      throw new Error(`Upload error: ${response.status} - ${errorDetails}`);
    }
    
    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Generates an optimized Cloudinary URL with AVIF support
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return '';
  
  if (url.startsWith('/') || url.startsWith('blob:') || !url.includes('cloudinary.com')) {
    return url;
  }
  
  const defaults = {
    width: 800,
    height: 600,
    quality: 'auto',
    format: 'avif', // Prefer AVIF
    fallbackFormat: 'auto', // Fall back to best format if AVIF not supported
    crop: 'fill'
  };
  
  const settings = { ...defaults, ...options };
  
  // Extract the component parts of the URL
  const uploadIndex = url.indexOf('upload/');
  if (uploadIndex === -1) return url;
  
  const basePath = url.substring(0, uploadIndex + 7);
  const imagePath = url.substring(uploadIndex + 7);
  
  // Build the transformation string
  // Format cascade: try AVIF first, then auto-select best format
  return `${basePath}w_${settings.width},h_${settings.height},c_${settings.crop},q_${settings.quality},f_${settings.format}/${imagePath}`;
}


/**
 * Deletes an image from Cloudinary through the API
 */
export async function deleteImageFromCloudinary(publicId) {
  if (!publicId) return false;
  
  try {
    const response = await fetch('/api/admin/cloudinary', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Delete failed:', errorData);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}