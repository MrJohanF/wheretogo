// src/app/services/cloudinary.js
export async function uploadImageToCloudinary(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al subir la imagen a Cloudinary');
      }
      
      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id
      };
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  }