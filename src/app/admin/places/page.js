"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from 'lucide-react';
import { useRouter } from "next/navigation";
import ViewPlaceModal from "@/app/components/ViewPlaceModal";

// Same animation variants

// Dynamic icon component that renders the correct Lucide icon based on name
const DynamicIcon = ({ name, ...props }) => {
  const IconComponent = LucideIcons[name] || LucideIcons.MapPin; // Default to MapPin if icon not found
  return <IconComponent {...props} />;
};

export default function PlacesManagement() {
  // Same state definitions

  useEffect(() => {
    // Fetch places, categories, subcategories, and features
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch data from all APIs in parallel
        const [placesData, categoriesData, subcategoriesData, featuresData] = await Promise.all([
          fetchPlaces(),
          fetchCategories(),
          fetchSubcategories(),
          fetchFeatures()
        ]);

        setPlaces(placesData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setFeatures(featuresData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch places from API
  const fetchPlaces = async () => {
    try {
      const response = await fetch('https://api.mywheretogo.com/api/admin/places');
      
      if (!response.ok) {
        throw new Error(`Error fetching places: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid places response format');
      }
      
      return data.places || [];
    } catch (error) {
      console.error("Failed to fetch places:", error);
      return []; // Return empty array as fallback
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.mywheretogo.com/api/admin/categories');
      
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid categories response format');
      }
      
      return data.categories || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return []; // Return empty array as fallback
    }
  };

  // Fetch subcategories from API
  const fetchSubcategories = async () => {
    try {
      const response = await fetch('https://api.mywheretogo.com/api/admin/subcategories');
      
      if (!response.ok) {
        throw new Error(`Error fetching subcategories: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid subcategories response format');
      }
      
      return data.subcategories || [];
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      return []; // Return empty array as fallback
    }
  };

  // Fetch features from API
  const fetchFeatures = async () => {
    try {
      const response = await fetch('https://api.mywheretogo.com/api/admin/features');
      
      if (!response.ok) {
        throw new Error(`Error fetching features: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid features response format');
      }
      
      return data.features || [];
    } catch (error) {
      console.error("Failed to fetch features:", error);
      return []; // Return empty array as fallback
    }
  };

  // Implement real place deletion
  const handleDeletePlace = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`https://api.mywheretogo.com/api/admin/places/${selectedPlaceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      // Update local state
      setPlaces(places.filter((place) => place.id !== selectedPlaceId));
      setIsConfirmingDelete(false);
      setSelectedPlaceId(null);
      
      // Show success message
      alert("Lugar eliminado exitosamente");
      
    } catch (error) {
      console.error("Error al eliminar lugar:", error);
      alert(`Error al eliminar lugar: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get detailed place information
  const handleViewPlace = async (place) => {
    try {
      setIsLoading(true);
      setSelectedPlaceId(place.id);
      
      // Fetch detailed place data
      const response = await fetch(`https://api.mywheretogo.com/api/admin/places/${place.id}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching place details: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Invalid place detail response');
      }
      
      const placeDetail = data.place;
      
      // Transform data for the form structure
      setFormData({
        name: placeDetail.name,
        description: placeDetail.description || "",
        rating: placeDetail.rating || null,
        priceLevel: placeDetail.priceLevel || "",
        address: placeDetail.address || "",
        phone: placeDetail.phone || "",
        website: placeDetail.website || "",
        cuisine: placeDetail.cuisine || "",
        isOpenNow: placeDetail.isOpenNow || false,
        latitude: placeDetail.latitude || null,
        longitude: placeDetail.longitude || null,
        
        // Handle category relationships
        categoryIds: placeDetail.categories?.map(c => c.categoryId || c.id) || [],
        subcategoryIds: placeDetail.subcategories?.map(s => s.subcategoryId || s.id) || [],
        featureIds: placeDetail.features?.map(f => f.featureId || f.id) || [],
        
        images: placeDetail.images || [],
        operatingHours: placeDetail.operatingHours || [],
        popularItems: placeDetail.popularItems?.map(item => item.name) || []
      });
      
      setIsViewingPlace(true);
    } catch (error) {
      console.error("Error al obtener detalles del lugar:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Rest of the component as before

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* Header and add button */}
      <div className="sm:flex sm:items-center sm:justify-between">
        {/* Same as before */}
      </div>

      {/* Filters and Search - Same as before */}
      
      {/* Category filter chips - updated to use DynamicIcon */}
      <motion.div variants={slideIn} className="mt-4 flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategories((prev) =>
                prev.includes(category.id)
                  ? prev.filter((id) => id !== category.id)
                  : [...prev, category.id]
              );
            }}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              selectedCategories.includes(category.id)
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
            style={category.color ? {
              backgroundColor: selectedCategories.includes(category.id) ? `${category.color}15` : undefined,
              borderColor: selectedCategories.includes(category.id) ? category.color : undefined,
            } : {}}
          >
            <span className="mr-1.5" style={category.color ? { color: category.color } : {}}>
              {category.icon ? <DynamicIcon name={category.icon} size={16} /> : '🏠'}
            </span>
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Places Table */}
      <motion.div variants={slideIn} className="mt-6 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              {/* Table Header - Same as before */}
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {/* Same as before */}
                </tr>
              </thead>
              
              {/* Table Body - Updated for real data */}
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">Cargando lugares...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPlaces.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No se encontraron lugares. Intenta ajustar tu búsqueda o filtros.
                    </td>
                  </tr>
                ) : (
                  filteredPlaces.map((place, index) => {
                    // Find place's primary category for icon display
                    const primaryCategory = place.categories?.[0] ? 
                      categories.find(c => c.id === (place.categories[0].categoryId || place.categories[0].id)) : null;
                    
                    return (
                      <motion.tr
                        key={place.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {primaryCategory ? (
                                <div 
                                  className="h-10 w-10 rounded-md flex items-center justify-center"
                                  style={{ 
                                    backgroundColor: `${primaryCategory.color}20` || '#f3f4f6',
                                    color: primaryCategory.color || '#4b5563'
                                  }}
                                >
                                  {primaryCategory.icon ? 
                                    <DynamicIcon name={primaryCategory.icon} size={20} /> : 
                                    '🏠'}
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <span className="text-lg">🏠</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {place.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {place.description || "Sin descripción disponible"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {place.categories && place.categories.map((categoryRelation) => {
                              // Get the actual category from categories array
                              const categoryId = categoryRelation.categoryId || categoryRelation.id;
                              const category = categories.find(c => c.id === categoryId);
                              
                              return category ? (
                                <span
                                  key={`place-${place.id}-cat-${categoryId}`}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                                  style={{ 
                                    backgroundColor: `${category.color}20` || '#e0e7ff',
                                    color: category.color || '#4338ca'
                                  }}
                                >
                                  {category.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </td>
                        {/* Rating, Price, Address, Actions cells - Same as before */}
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Rest of component (modals, pagination) - Same as before */}
    </motion.div>
  );
}