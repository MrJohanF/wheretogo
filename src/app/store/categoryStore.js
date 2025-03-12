// store/categoryStore.js
import { create } from 'zustand';
import { getOptimizedImageUrl } from '../services/cloudinary';
import { 
  Coffee, Utensils, Beer, Building, TreeDeciduous, 
  Film, Music, Volleyball, ShoppingBag, Calendar, 
  Hotel, Waves, MapPin 
} from 'lucide-react';

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
            icon: mapIconToComponent(category.icon) || "📍",
            count: category._count?.places || 0,
            description: category.description || `Explora en ${category.name}`,
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

// Helper functions Icons

function mapIconToComponent(iconName) {
  if (!iconName) return <MapPin size={20} />; // Default icon
  
  const iconMap = {
    "Coffee": <Coffee size={20} />,
    "Utensils": <Utensils size={20} />,
    "Beer": <Beer size={20} />,
    "Building": <Building size={20} />,
    "TreeDeciduous": <TreeDeciduous size={20} />,
    "Film": <Film size={20} />,
    "Music": <Music size={20} />,
    "Football": <Volleyball size={20} />, // You were using Volleyball for Football
    "ShoppingBag": <ShoppingBag size={20} />,
    "Calendar": <Calendar size={20} />,
    "Hotel": <Hotel size={20} />,
    "Waves": <Waves size={20} />
  };
  
  return iconMap[iconName] || <MapPin size={20} />; // Return mapped icon or default
}

function mapColorToGradient(hexColor) {
  // If no color provided, return default indigo color
  if (!hexColor) return '#6366F1';
  
  // Just return the original hex color for the icon backgrounds
  return hexColor;
  
  // Note: The gradient overlay effect is now handled directly in the component
}

export default useCategoryStore;