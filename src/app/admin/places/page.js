"use client";

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Search,
  MapPin,
  Star,
  ChevronDown,
  Edit,
  Trash2,
  ArrowUpDown,
  Filter,
  Eye,
  Loader
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import useAdminStore from "@/app/admin/store/adminStore";
import debounce from 'lodash.debounce';

// Lazy load the modals
const ViewPlaceModal = lazy(() => import("@/app/components/ViewPlaceModal"));

// Optimized icon mapping to reduce bundle size
const categoryIconMap = {
  MapPin, // Default
  // Add specific icons you need here instead of importing all lucide icons
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

// More efficient dynamic icon component
const DynamicIcon = ({ name, ...props }) => {
  // Use specific imported icons instead of full library
  const IconComponent = categoryIconMap[name] || MapPin;
  return <IconComponent {...props} />;
};

export default function PlacesManagement() {
  const router = useRouter();
  const { 
    places: { data: places, isLoading, error }, 
    categories: { data: categories },
    features: { data: features },
    fetchPlaces, 
    fetchCategories, 
    fetchFeatures,
    deletePlace,
    fetchPlaceById
  } = useAdminStore();

  // State with single initialization
  const [filters, setFilters] = useState({
    searchInput: "",
    searchQuery: "",
    selectedCategories: [],
    selectedPriceLevel: "",
    sortBy: "name",
    sortDirection: "asc"
  });

  const [uiState, setUiState] = useState({
    isViewingPlace: false,
    isConfirmingDelete: false,
    selectedPlaceId: null,
    apiError: null
  });
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rating: null,
    priceLevel: "",
    address: "",
    phone: "",
    website: "",
    cuisine: "",
    isOpenNow: false,
    latitude: null,
    longitude: null,
    categoryIds: [],
    subcategoryIds: [],
    featureIds: [],
    images: [],
    operatingHours: [],
    popularItems: []
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters(prev => ({ ...prev, searchQuery: value }));
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(filters.searchInput);
    return () => {
      debouncedSearch.cancel();
    };
  }, [filters.searchInput, debouncedSearch]);

  // Fetch data only once on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setUiState(prev => ({ ...prev, apiError: null }));
        await Promise.all([
          fetchPlaces(),
          fetchCategories(),
          fetchFeatures()
        ]);
      } catch (err) {
        console.error("Error loading data:", err);
        setUiState(prev => ({ ...prev, apiError: err.message || "Error fetching data" }));
      }
    };

    loadData();
  }, [fetchPlaces, fetchCategories, fetchFeatures]);

  // Memoize category mapping for better performance
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {});
  }, [categories]);

  // Memoized filtered and sorted places list
  const filteredPlaces = useMemo(() => {
    const { searchQuery, selectedCategories, selectedPriceLevel, sortBy, sortDirection } = filters;
    
    return places
      .filter((place) => {
        // Search query filter
        const matchesSearch = !searchQuery || 
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (place.description &&
            place.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        let matchesCategory = true;
        if (selectedCategories.length > 0) {
          matchesCategory = place.categories?.some(cat => {
            const categoryId = cat.categoryId || cat.id;
            return selectedCategories.includes(categoryId);
          }) || false;
        }

        // Price level filter
        const matchesPrice =
          !selectedPriceLevel || place.priceLevel === selectedPriceLevel;

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        // Sort by selected field
        let comparison = 0;
        if (sortBy === "name") {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "rating") {
          comparison = (a.rating || 0) - (b.rating || 0);
        } else if (sortBy === "createdAt") {
          const dateA = a.createdAt ? new Date(a.createdAt) : a.id;
          const dateB = b.createdAt ? new Date(b.createdAt) : b.id;
          comparison = dateA - dateB;
        }

        // Apply sort direction
        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [places, filters]);

  // Animation config based on list size
  const animationConfig = useMemo(() => ({
    shouldAnimate: filteredPlaces.length < 50,
    getDelay: (index) => filteredPlaces.length > 20 ? 0 : Math.min(0.03, index * 0.01)
  }), [filteredPlaces.length]);

  // Handlers with useCallback to prevent unnecessary re-renders
  const handleAddPlace = useCallback(() => {
    router.push(`/admin/places/edit/add`);
  }, [router]);

  const handleEditPlace = useCallback((place) => {
    router.push(`/admin/places/edit/${place.id}`);
  }, [router]);

  const handleViewPlace = useCallback(async (place) => {
    try {
      setUiState(prev => ({ ...prev, selectedPlaceId: place.id, apiError: null }));
      
      // Get place details from store or fetch them if needed
      const placeDetail = await fetchPlaceById(place.id);
      
      if (placeDetail) {
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
        
        setUiState(prev => ({ ...prev, isViewingPlace: true }));
      }
    } catch (error) {
      console.error("Error al obtener detalles del lugar:", error);
      setUiState(prev => ({ ...prev, apiError: `Error al obtener detalles: ${error.message}` }));
    }
  }, [fetchPlaceById]);

  const handleDeletePrompt = useCallback((placeId) => {
    setUiState(prev => ({ 
      ...prev, 
      selectedPlaceId: placeId, 
      isConfirmingDelete: true 
    }));
  }, []);

  const handleDeletePlace = useCallback(async () => {
    try {
      setUiState(prev => ({ ...prev, apiError: null }));
      
      const result = await deletePlace(uiState.selectedPlaceId);
      
      if (result.success) {
        setUiState(prev => ({ 
          ...prev, 
          isConfirmingDelete: false, 
          selectedPlaceId: null 
        }));
        toast.success("Lugar eliminado exitosamente");
      } else {
        throw new Error(result.error || "Error deleting place");
      }
    } catch (error) {
      console.error("Error al eliminar lugar:", error);
      setUiState(prev => ({ ...prev, apiError: `Error al eliminar lugar: ${error.message}` }));
    }
  }, [deletePlace, uiState.selectedPlaceId]);

  const handleCategoryToggle = useCallback((categoryId) => {
    setFilters(prev => {
      const newSelectedCategories = prev.selectedCategories.includes(categoryId)
        ? prev.selectedCategories.filter(id => id !== categoryId)
        : [...prev.selectedCategories, categoryId];
      
      return {
        ...prev,
        selectedCategories: newSelectedCategories
      };
    });
  }, []);

  // Render category pill - extracted as a memoized component
  const CategoryPill = useCallback(({ category, isSelected, onClick }) => (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
        isSelected
          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      }`}
      style={category.color ? {
        backgroundColor: isSelected ? `${category.color}15` : undefined,
        borderColor: isSelected ? category.color : undefined,
      } : {}}
    >
      <span className="mr-1.5" style={category.color ? { color: category.color } : {}}>
        {category.icon ? <DynamicIcon name={category.icon} size={16} /> : '🏠'}
      </span>
      {category.name}
    </motion.button>
  ), []);

  // Render table row - extracted as a memoized component
  const PlaceTableRow = useCallback(({ place, index, onView, onEdit, onDelete }) => {
    // Find place's primary category for icon display
    const primaryCategory = place.categories?.[0] ? 
      categoryMap[place.categories[0].categoryId || place.categories[0].id] : null;
    
    return (
      <motion.tr
        key={place.id}
        initial={animationConfig.shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: animationConfig.getDelay(index) }}
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
                    <MapPin size={20} />}
                </div>
              ) : (
                <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <MapPin size={20} className="text-gray-500 dark:text-gray-400" />
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
            {place.categories && place.categories.slice(0, 3).map((categoryRelation) => {
              // Get the actual category from categories array
              const categoryId = categoryRelation.categoryId || categoryRelation.id;
              const category = categoryMap[categoryId];
              
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
            {place.categories && place.categories.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                +{place.categories.length - 3}
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
            <span className="text-sm text-gray-900 dark:text-white">
              {place.rating?.toFixed(1) || "N/A"}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-900 dark:text-white">
            {place.priceLevel || "N/A"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-gray-900 dark:text-white">
            <MapPin className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
            <span className="truncate max-w-[200px]">
              {place.address || "Sin dirección"}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onView(place)}
              className="p-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-md"
              aria-label="Ver lugar"
            >
              <Eye size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(place)}
              className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-md"
              aria-label="Editar lugar"
            >
              <Edit size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(place.id)}
              className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-md"
              aria-label="Eliminar lugar"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </td>
      </motion.tr>
    );
  }, [categoryMap, animationConfig]);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Lugares
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Agregar, editar y gestionar todos los lugares en tu plataforma
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddPlace}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Agregar Nuevo Lugar
          </motion.button>
        </div>
      </div>

      {/* Display API errors if any */}
      {(uiState.apiError || error) && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-900/20 dark:border-red-500"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">
                {uiState.apiError || error}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div 
        variants={slideIn}
        className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar lugares..."
            value={filters.searchInput}
            onChange={(e) => setFilters(prev => ({ ...prev, searchInput: e.target.value }))}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>

        <div className="relative">
          <select
            value={filters.selectedPriceLevel}
            onChange={(e) => setFilters(prev => ({ ...prev, selectedPriceLevel: e.target.value }))}
            className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm appearance-none"
          >
            <option value="">Nivel de Precio (Todos)</option>
            <option value="$">$ (Económico)</option>
            <option value="$$">$$ (Moderado)</option>
            <option value="$$$">$$$ (Costoso)</option>
            <option value="$$$$">$$$$ (Muy Costoso)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm appearance-none"
          >
            <option value="name">Ordenar por Nombre</option>
            <option value="rating">Ordenar por Calificación</option>
            <option value="createdAt">Ordenar por Fecha de Agregado</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilters(prev => ({
              ...prev,
              sortDirection: prev.sortDirection === "asc" ? "desc" : "asc"
            }))}
            className="flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label={filters.sortDirection === "asc" ? "Ordenar descendente" : "Ordenar ascendente"}
          >
            <ArrowUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex-grow"
          >
            <Filter className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Filtros {filters.selectedCategories.length > 0 ? `(${filters.selectedCategories.length})` : ''}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Category filter chips - only render if we have categories */}
      {categories.length > 0 && (
        <motion.div 
          variants={slideIn}
          className="mt-4 flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <CategoryPill 
              key={category.id}
              category={category}
              isSelected={filters.selectedCategories.includes(category.id)}
              onClick={() => handleCategoryToggle(category.id)}
            />
          ))}
        </motion.div>
      )}

      {/* Places Table */}
      <motion.div 
        variants={slideIn}
        className="mt-6 overflow-x-auto"
      >
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Lugar
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Categorías
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Calificación
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Precio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell"
                  >
                    Dirección
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex justify-center items-center">
                        <Loader className="h-5 w-5 animate-spin text-indigo-600 mr-2" />
                        <span>Cargando lugares...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPlaces.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No se encontraron lugares. Intenta ajustar tu búsqueda o filtros.
                    </td>
                  </tr>
                ) : (
                  filteredPlaces.map((place, index) => (
                    <PlaceTableRow 
                      key={place.id}
                      place={place}
                      index={index}
                      onView={handleViewPlace}
                      onEdit={handleEditPlace}
                      onDelete={handleDeletePrompt}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Lazy load modals only when needed */}
      {uiState.isViewingPlace && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <Loader className="h-8 w-8 animate-spin text-white" />
          </div>
        }>
          <ViewPlaceModal
            isOpen={uiState.isViewingPlace}
            onClose={() => setUiState(prev => ({ ...prev, isViewingPlace: false }))}
            onEdit={() => {
              setUiState(prev => ({ ...prev, isViewingPlace: false }));
              const place = places.find((p) => p.id === uiState.selectedPlaceId);
              if (place) handleEditPlace(place);
            }}
            place={formData}
            categories={categories}
            features={features}
          />
        </Suspense>
      )}

      {/* Delete Confirmation Modal */}
      {uiState.isConfirmingDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 dark:bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 max-w-md w-full shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-100/80 text-red-600 ring-4 ring-red-600/20">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-1">
                  Eliminar Lugar
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ¿Estás seguro de que quieres eliminar este lugar? Esta acción
                  no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setUiState(prev => ({ ...prev, isConfirmingDelete: false }))}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDeletePlace}
                disabled={isLoading}
                className={`rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                  isLoading 
                    ? "bg-red-400 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Eliminando...
                  </div>
                ) : "Eliminar"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Pagination - only if we have places */}
      {!isLoading && places.length > 0 && (
        <motion.div 
          variants={slideIn}
          className="mt-6 flex items-center justify-between"
        >
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Mostrando <span className="font-medium">1</span> a{" "}
            <span className="font-medium">{filteredPlaces.length}</span> de{" "}
            <span className="font-medium">{places.length}</span> lugares
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled
              className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-800 opacity-50 cursor-not-allowed"
            >
              Anterior
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 border border-indigo-300 dark:border-indigo-700 rounded-md text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20"
            >
              1
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled
              className="px-3 py-1 border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-800 opacity-50 cursor-not-allowed"
            >
              Siguiente
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}