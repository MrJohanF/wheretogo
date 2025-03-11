// store/categoryStore.js
import { create } from 'zustand';
import { getOptimizedImageUrl } from '../services/cloudinary';

const useCategoryStore = create((set, get) => ({
  // State remains the same
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
        // Transform API data with optimized images
        const transformedCategories = data.categories.map(category => {
          let imageUrl = category.image || "/images/placeholder.jpg";
          
          // Apply AVIF optimization for Cloudinary images
          if (imageUrl && imageUrl.includes('cloudinary.com')) {
            imageUrl = getOptimizedImageUrl(imageUrl, {
              width: 800,
              height: 400,
              crop: 'fill',
              format: 'avif'
            });
          }
          
          return {
            id: category.id,
            name: category.name,
            icon: mapIconToEmoji(category.icon) || "📍",
            count: category._count?.places || 0,
            description: category.description || `Explora lugares en ${category.name}`,
            color: mapColorToGradient(category.color),
            image: imageUrl,
            imagePublicId: category.imagePublicId,
            trending: category.isTrending,
            subcategories: category.subcategories?.map(sub => sub.name) || [],
            filters: ["Valoración", "Precio", "Distancia"], 
            features: []
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
  
  // Get a specific category by ID - unchanged
  getCategoryById: (id) => {
    const state = get();
    const foundCategory = state.categories.find(cat => cat.id.toString() === id.toString());
    
    if (foundCategory) return foundCategory;
    
    return {
      id,
      name: `Categoría ${id}`,
      icon: "📍",
      description: "Lugares destacados",
      features: [],
      filters: ["Valoración", "Precio", "Distancia"]
    };
  },
  
  // Helper method to get optimized images with AVIF
  getOptimizedImageUrl: (imageUrl, width = 800, height = 400) => {
    return getOptimizedImageUrl(imageUrl, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'avif'
    });
  }
}));

// Helper functions remain the same
function mapIconToEmoji(iconName) {
  // Your existing code
}

function mapColorToGradient(hexColor) {
  // Your existing code
}

export default useCategoryStore;