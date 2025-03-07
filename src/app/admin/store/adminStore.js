// store/adminStore.js
import { create } from 'zustand';

const useAdminStore = create((set, get) => ({
  // Places State
  places: {
    data: [],
    isLoading: false,
    error: null,
    selectedPlace: null,
  },

  // Categories State
  categories: {
    data: [],
    isLoading: false,
    error: null,
  },

  // Subcategories State
  subcategories: {
    data: [],
    isLoading: false,
    error: null,
  },

  // Features State
  features: {
    data: [],
    isLoading: false,
    error: null,
  },

  // Places Actions
  fetchPlaces: async () => {
    set(state => ({
      places: {
        ...state.places,
        isLoading: true,
        error: null
      }
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/places`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching places: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid places response format');
      }
      
      set(state => ({
        places: {
          ...state.places,
          data: data.places || [],
          isLoading: false
        }
      }));
      
      return data.places || [];
    } catch (error) {
      console.error("Failed to fetch places:", error);
      set(state => ({
        places: {
          ...state.places,
          error: error.message,
          isLoading: false
        }
      }));
      return [];
    }
  },

  fetchPlaceById: async (id) => {
    set(state => ({
      places: {
        ...state.places,
        isLoading: true,
        error: null
      }
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/places/${id}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching place: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid place response format');
      }
      
      set(state => ({
        places: {
          ...state.places,
          selectedPlace: data.place,
          isLoading: false
        }
      }));
      
      return data.place;
    } catch (error) {
      console.error("Failed to fetch place:", error);
      set(state => ({
        places: {
          ...state.places,
          error: error.message,
          isLoading: false
        }
      }));
      return null;
    }
  },

  savePlace: async (placeData, isEditing = false) => {
    set(state => ({
      places: {
        ...state.places,
        isLoading: true,
        error: null
      }
    }));

    try {
      const url = isEditing 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/places/${placeData.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/places/add`;

      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(placeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Update local state if successful
      if (isEditing) {
        set(state => ({
          places: {
            ...state.places,
            data: state.places.data.map(place => 
              place.id === placeData.id ? result.place : place
            ),
            isLoading: false
          }
        }));
      } else {
        set(state => ({
          places: {
            ...state.places,
            data: [...state.places.data, result.place],
            isLoading: false
          }
        }));
      }
      
      return { success: true, place: result.place };
    } catch (error) {
      console.error("Failed to save place:", error);
      set(state => ({
        places: {
          ...state.places,
          error: error.message,
          isLoading: false
        }
      }));
      return { success: false, error: error.message };
    }
  },

  deletePlace: async (placeId) => {
    set(state => ({
      places: {
        ...state.places,
        isLoading: true,
        error: null
      }
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/places/${placeId}`, {
        method: 'DELETE',
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      // Update local state by removing the deleted place
      set(state => ({
        places: {
          ...state.places,
          data: state.places.data.filter(place => place.id !== placeId),
          isLoading: false
        }
      }));
      
      return { success: true };
    } catch (error) {
      console.error("Failed to delete place:", error);
      set(state => ({
        places: {
          ...state.places,
          error: error.message,
          isLoading: false
        }
      }));
      return { success: false, error: error.message };
    }
  },

  // Categories Actions
  fetchCategories: async () => {
    const state = get();
    // Return cached data if available
    if (state.categories.data.length > 0) {
      return state.categories.data;
    }

    set(state => ({
      categories: {
        ...state.categories,
        isLoading: true,
        error: null
      }
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid categories response format');
      }
      
      set(state => ({
        categories: {
          ...state.categories,
          data: data.categories || [],
          isLoading: false
        }
      }));
      
      return data.categories || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      set(state => ({
        categories: {
          ...state.categories,
          error: error.message,
          isLoading: false
        }
      }));
      return [];
    }
  },

  // Subcategories Actions
  fetchSubcategories: async () => {
    const state = get();
    // Return cached data if available
    if (state.subcategories.data.length > 0) {
      return state.subcategories.data;
    }

    set(state => ({
      subcategories: {
        ...state.subcategories,
        isLoading: true,
        error: null
      }
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/subcategories`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching subcategories: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid subcategories response format');
      }
      
      set(state => ({
        subcategories: {
          ...state.subcategories,
          data: data.subcategories || [],
          isLoading: false
        }
      }));
      
      return data.subcategories || [];
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      set(state => ({
        subcategories: {
          ...state.subcategories,
          error: error.message,
          isLoading: false
        }
      }));
      return [];
    }
  },

  // Features Actions
  fetchFeatures: async () => {
    const state = get();
    // Return cached data if available
    if (state.features.data.length > 0) {
      return state.features.data;
    }

    set(state => ({
      features: {
        ...state.features,
        isLoading: true,
        error: null
      }
    }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/features`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching features: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid features response format');
      }
      
      set(state => ({
        features: {
          ...state.features,
          data: data.features || [],
          isLoading: false
        }
      }));
      
      return data.features || [];
    } catch (error) {
      console.error("Failed to fetch features:", error);
      set(state => ({
        features: {
          ...state.features,
          error: error.message,
          isLoading: false
        }
      }));
      return [];
    }
  },

  // Helper method to reset all error states
  resetErrors: () => {
    set(state => ({
      places: {
        ...state.places,
        error: null
      },
      categories: {
        ...state.categories,
        error: null
      },
      subcategories: {
        ...state.subcategories,
        error: null
      },
      features: {
        ...state.features,
        error: null
      }
    }));
  },

  // Clear selected place
  clearSelectedPlace: () => {
    set(state => ({
      places: {
        ...state.places,
        selectedPlace: null
      }
    }));
  }
}));

export default useAdminStore;