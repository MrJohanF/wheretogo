// store/categoryStore.js
import { create } from 'zustand';

const useCategoryStore = create((set, get) => ({
  // State
  categories: [],
  isLoading: false,
  error: null,
  
  // Actions
  setCategories: (categories) => set({ categories }),
  
  // Fetch all categories
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.categories) {
        // Transform API data to match component expectations
        const transformedCategories = data.categories.map(category => {
          // Optimizar URLs de Cloudinary si existen
          let imageUrl = category.image || "/images/placeholder.jpg";
          
          // Si la imagen proviene de Cloudinary, podemos aplicar transformaciones
          if (imageUrl && imageUrl.includes('cloudinary.com')) {
            // Extraer el path después de 'upload/'
            const uploadIndex = imageUrl.indexOf('upload/');
            if (uploadIndex !== -1) {
              const basePath = imageUrl.substring(0, uploadIndex + 7);
              const imagePath = imageUrl.substring(uploadIndex + 7);
              
              // Aplicar transformaciones (calidad automática, formato automático)
              imageUrl = `${basePath}c_fill,w_800,h_400,q_auto,f_auto/${imagePath}`;
            }
          }
          
          return {
            id: category.id,
            name: category.name,
            icon: mapIconToEmoji(category.icon) || "📍", // Using a helper function
            count: category._count?.places || 0,
            description: category.description || `Explora lugares en ${category.name}`,
            color: mapColorToGradient(category.color),
            image: imageUrl,
            imagePublicId: category.imagePublicId, // Guardar el publicId por si es necesario
            trending: category.isTrending,
            subcategories: category.subcategories?.map(sub => sub.name) || [],
            filters: ["Valoración", "Precio", "Distancia"], // Default filters
            features: []  // Can be populated if your API returns features
          };
        });
        
        set({ 
          categories: transformedCategories,
          isLoading: false 
        });
        
        return transformedCategories;
      }
      
      throw new Error('Invalid data format received from API');
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      set({ 
        error: err.message || "Failed to load categories",
        isLoading: false 
      });
    }
  },
  
  // Get a specific category by ID
  getCategoryById: (id) => {
    const state = get();
    const foundCategory = state.categories.find(cat => cat.id.toString() === id.toString());
    
    if (foundCategory) return foundCategory;
    
    // Return a default category if not found
    return {
      id,
      name: `Categoría ${id}`,
      icon: "📍",
      description: "Lugares destacados",
      features: [],
      filters: ["Valoración", "Precio", "Distancia"]
    };
  },
  
  // Helper method to optimize Cloudinary images on the fly
  getOptimizedImageUrl: (imageUrl, width = 800, height = 400) => {
    if (!imageUrl || imageUrl.startsWith('blob:') || imageUrl === '/images/placeholder.jpg') {
      return imageUrl;
    }
    
    // Si es una imagen de Cloudinary, optimizarla
    if (imageUrl.includes('cloudinary.com')) {
      const uploadIndex = imageUrl.indexOf('upload/');
      if (uploadIndex !== -1) {
        const basePath = imageUrl.substring(0, uploadIndex + 7);
        const imagePath = imageUrl.substring(uploadIndex + 7);
        
        return `${basePath}c_fill,w_${width},h_${height},q_auto,f_auto/${imagePath}`;
      }
    }
    
    return imageUrl;
  }
}));

// Helper functions
function mapIconToEmoji(iconName) {
  const iconMap = {
    'Utensils': '🍽️',
    'Coffee': '☕',
    'Beer': '🍸',
    'Building': '🏛️',
    'TreeDeciduous': '🌳',
    'Film': '🎬',
    'Hotel': '🏨',
    'Football': '⚽',
    'ShoppingBag': '🛍️',
    'Music': '🎉',
    'Waves': '🏖️',
  };
  
  return iconMap[iconName] || "📍";
}

function mapColorToGradient(hexColor) {
  const colors = {
    "#ef4444": "from-red-500 to-orange-500",
    "#a855f7": "from-purple-500 to-violet-500",
    "#f43f5e": "from-rose-500 to-pink-500",
    "#c2410c": "from-orange-500 to-amber-500",
    "#0369a1": "from-blue-500 to-sky-500", 
    "#d946ef": "from-fuchsia-500 to-pink-500",
    "#2dd4bf": "from-teal-500 to-emerald-500",
    "#059669": "from-green-500 to-emerald-500",
    "#ec4899": "from-pink-500 to-rose-500",
    "#c026d3": "from-purple-500 to-indigo-500",
    "#b45309": "from-amber-500 to-yellow-500",
  };
  
  return colors[hexColor] || "from-gray-500 to-gray-700";
}

export default useCategoryStore;