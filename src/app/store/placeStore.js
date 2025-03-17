"use client";

import { create } from 'zustand';
import { getOptimizedImageUrl } from '../services/cloudinary';

const usePlaceStore = create((set, get) => ({
  // State
  places: [],
  featuredPlaces: [],
  currentPlace: null,
  isLoading: false,
  isFeaturedLoading: false,
  isPlaceLoading: false,
  error: null,
  
  // Fetch all places with optional filters
  fetchPlaces: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/places${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.places)) {
        // Transform places for consistent format
        const transformedPlaces = data.places.map(transformPlaceData);
        set({ places: transformedPlaces, isLoading: false });
        return transformedPlaces;
      }
      
      throw new Error('Invalid data format received from API');
    } catch (err) {
      console.error("Failed to fetch places:", err);
      set({ 
        error: err.message || "Failed to load places",
        isLoading: false 
      });
      return [];
    }
  },
  
  // Fetch featured places
  fetchFeaturedPlaces: async (limit = 4) => {
    set({ isFeaturedLoading: true, error: null });
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/places?featured=true&limit=${limit}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.places)) {
        // Transform featured places for consistent format
        const transformedPlaces = data.places.map(transformPlaceData);
        set({ featuredPlaces: transformedPlaces, isFeaturedLoading: false });
        return transformedPlaces;
      }
      
      throw new Error('Invalid data format received from API');
    } catch (err) {
      console.error("Failed to fetch featured places:", err);
      set({ 
        error: err.message || "Failed to load featured places",
        isFeaturedLoading: false 
      });
      
      // Provide fallback data
      const fallbackPlaces = [
        {
          id: 1,
          name: "Al Agua Patos",
          type: "Restaurantes",
          description: "Best Kid Friendly Restaurant",
          address: "Cl. 72a #5 – 22",
          rating: 4.7,
          reviews: 24,
          priceLevel: "$$",
          primaryCategory: { name: "Restaurantes" },
          images: [{ 
            url: "https://res.cloudinary.com/ds4oxnii2/image/upload/v1742176349/sgz1kag86mbtrawput0k.jpg"
          }]
        },
        {
          id: 2,
          name: "Coffee Shop Central",
          type: "Cafés",
          description: "Great atmosphere and coffee",
          address: "Example Street 123",
          rating: 4.5,
          reviews: 18,
          priceLevel: "$",
          primaryCategory: { name: "Cafés" },
          images: [{ 
            url: "https://res.cloudinary.com/ds4oxnii2/image/upload/v1742176350/rwe9kjcsdalxmxwgle4d.jpg" 
          }]
        },
        {
          id: 3,
          name: "Bistro Milano",
          type: "Restaurantes",
          description: "Authentic Italian cuisine",
          address: "Main Avenue 45",
          rating: 4.8,
          reviews: 32,
          priceLevel: "$$$",
          primaryCategory: { name: "Restaurantes" },
          images: [{ 
            url: "https://res.cloudinary.com/ds4oxnii2/image/upload/v1742176350/wft9dfiubny9x2ikpxlh.jpg" 
          }]
        },
        {
          id: 4,
          name: "Sunset Bar",
          type: "Bares",
          description: "Amazing cocktails and views",
          address: "Beach Road 78",
          rating: 4.6,
          reviews: 15,
          priceLevel: "$$",
          primaryCategory: { name: "Bares" },
          images: [{ 
            url: "https://res.cloudinary.com/ds4oxnii2/image/upload/v1742176351/de6laajplyyj0r9ud9wy.jpg" 
          }]
        }
      ];
      
      set({ featuredPlaces: fallbackPlaces, isFeaturedLoading: false });
      return fallbackPlaces;
    }
  },
  
  // Fetch a single place by ID
  fetchPlaceById: async (id) => {
    if (!id) return null;
    
    set({ isPlaceLoading: true, error: null });
    
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/places/${id}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.place) {
        const transformedPlace = transformPlaceData(data.place);
        set({ currentPlace: transformedPlace, isPlaceLoading: false });
        return transformedPlace;
      }
      
      throw new Error('Invalid data format received from API');
    } catch (err) {
      console.error(`Failed to fetch place with ID ${id}:`, err);
      set({ 
        error: err.message || "Failed to load place details",
        isPlaceLoading: false 
      });
      return null;
    }
  },
  
  // Clear current place
  clearCurrentPlace: () => {
    set({ currentPlace: null });
  },
  
  // Helper method to get optimized images
  getOptimizedImageUrl: (imageUrl, width = 800, height = 400) => {
    if (!imageUrl) return '/images/placeholder.jpg';
    
    return getOptimizedImageUrl(imageUrl, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'avif'
    });
  },
  
  // Get primary image for a place
  getPrimaryImage: (place, width = 800, height = 400) => {
    if (!place || !place.images || !place.images.length) {
      return '/images/placeholder.jpg';
    }
    
    // Get featured image or first image
    const imageUrl = place.images.find(img => img.isFeatured)?.url || place.images[0].url;
    return get().getOptimizedImageUrl(imageUrl, width, height);
  }
}));

// Helper function to transform place data into consistent format
function transformPlaceData(place) {
  if (!place) return null;
  
  return {
    id: place.id,
    name: place.name,
    description: place.description || '',
    rating: place.rating || null,
    priceLevel: place.priceLevel || '',
    address: place.address || '',
    phone: place.phone || '',
    website: place.website || '',
    cuisine: place.cuisine || '',
    isOpenNow: place.isOpenNow || false,
    latitude: place.latitude,
    longitude: place.longitude,
    createdAt: place.createdAt,
    updatedAt: place.updatedAt,
    categories: place.categories || [],
    subcategories: place.subcategories || [],
    images: place.images || [],
    operatingHours: place.operatingHours || [],
    features: place.features || [],
    popularItems: place.popularItems || [],
    reviews: place.reviews || [],
    reviewsCount: place._count?.reviews || 0,
    favoritesCount: place._count?.favorites || 0,
    
    // Add derived properties for easier access
    primaryCategory: place.categories && place.categories.length > 0 
      ? place.categories[0].category 
      : null,
    type: place.categories && place.categories.length > 0
      ? place.categories[0].category.name
      : "Lugar"
  };
}

export default usePlaceStore;