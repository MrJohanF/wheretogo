"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Phone,
  Globe,
  Filter,
  SortAsc,
  Map,
  Grid2X2,
  Heart,
  ChevronDown,
  X,
  Search,
  Navigation,
  Clock3,
  Bookmark,
  Share2,
  MenuSquare,
  AlertCircle,
  Loader
} from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-200px)] bg-gray-100 flex items-center justify-center rounded-xl">
      <div className="animate-pulse flex flex-col items-center">
        <Map size={40} className="text-gray-300 mb-2" />
        <p className="text-gray-400">Cargando mapa...</p>
      </div>
    </div>
  ),
});

// Default category filters to use when we don't have specific ones
const defaultFilters = ["Valoración", "Precio", "Distancia"];

export default function CategoryDetail() {
  const router = useRouter();
  const params = useParams();
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(true);

  const categoryId = params?.id;

  // Fetch category information
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      
      setLoadingCategory(true);
      try {
        // Try to fetch category details
        const response = await fetch(`https://api.mywheretogo.com/api/categories/${categoryId}`);
        
        if (!response.ok) {
          setCategory({
            id: categoryId,
            name: "Categoría",
            icon: "📍",
            description: "Lugares destacados",
            features: [],
            filters: defaultFilters
          });
          return;
        }
        
        const data = await response.json();
        if (data.success && data.category) {
          setCategory({
            id: data.category.id,
            name: data.category.name,
            icon: getIconForCategory(data.category.icon || 'default'),
            description: data.category.description || "Lugares destacados",
            features: data.category.features || [],
            filters: data.category.filters || defaultFilters
          });
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        // Create fallback category using ID
        setCategory({
          id: categoryId,
          name: `Categoría ${categoryId}`,
          icon: "📍",
          description: "Lugares destacados",
          features: [],
          filters: defaultFilters
        });
      } finally {
        setLoadingCategory(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // Fetch places data from API
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`https://api.mywheretogo.com/api/categories/${categoryId}/places`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los lugares`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.places)) {
          setPlaces(data.places);
          
          // If we don't have category information yet, create it from the first place
          if (!category && data.places.length > 0) {
            const firstPlace = data.places[0];
            setCategory({
              id: categoryId,
              name: firstPlace.cuisine || "Lugares",
              icon: "📍",
              description: `Descubre lugares destacados`,
              features: [],
              filters: defaultFilters
            });
          }
        } else {
          throw new Error('Formato de datos inválido recibido del API');
        }
      } catch (err) {
        console.error('Error fetching places:', err);
        setError(err.message || 'Ha ocurrido un error al cargar los lugares');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [categoryId]);

  // Helper function to map category icon strings to emoji
  const getIconForCategory = (iconName) => {
    const iconMap = {
      'Restaurant': '🍽️',
      'Cafe': '☕',
      'Bar': '🍸',
      'Museum': '🏛️',
      'Park': '🌳',
      'Cinema': '🎬',
      'Hotel': '🏨',
      'Stadium': '⚽',
      'Shopping': '🛍️',
      'Event': '🎉',
      'Beach': '🏖️',
      'default': '📍'
    };
    
    return iconMap[iconName] || iconMap.default;
  };

  const toggleFavorite = (placeId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(placeId)) {
        newFavorites.delete(placeId);
      } else {
        newFavorites.add(placeId);
      }
      return newFavorites;
    });
  };

  const handlePlaceClick = (place) => {
    router.push(`/places/${place.id}`);
  };

  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  // Helper function to get featured image URL or placeholder
  const getFeaturedImageUrl = (place) => {
    if (place.images && place.images.length > 0) {
      const featuredImage = place.images.find(img => img.isFeatured);
      return featuredImage ? featuredImage.url : place.images[0].url;
    }
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'; // Placeholder image
  };

  // Filter places based on search query
  const filteredPlaces = places.filter(place => {
    if (!searchQuery) return true;
    
    return (
      place.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort places based on selected sort option
  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    // Additional sorting options can be implemented here
    return 0;
  });

  // Loading state for the entire page
  if (loadingCategory || (isLoading && !error)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 mx-auto animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  // Error display component
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-center text-gray-900">Error</h3>
          <p className="mt-2 text-center text-gray-500">{error}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1"
            >
              Volver
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-1"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pb-10">
      {/* Enhanced Header with Full-Width Banner */}
      <div className="w-full">
        {/* Navigation Bar */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200"
                aria-label="Volver atrás"
              >
                <ArrowLeft size={22} className="text-gray-700" />
              </button>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center flex-wrap">
                  <span className="mr-2 text-3xl" aria-hidden="true">
                    {category?.icon}
                  </span>
                  {category?.name}
                  <span className="ml-2 text-sm font-medium bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">
                    {filteredPlaces.length} lugares
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Gradient Banner */}
        <div className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-lg"
            >
              <h2 className="text-white text-3xl font-bold mb-3">
                {category?.description}
              </h2>
              <p className="text-indigo-100 text-lg">
                Explora {filteredPlaces.length} lugares destacados en esta categoría
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {category?.features?.map((feature, idx) => (
                  <span
                    key={idx}
                    className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Search and Filters Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Box */}
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder={`Buscar en ${category?.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-4 py-2.5 rounded-lg transition-all font-medium ${
                showFilters || activeFilters.length > 0 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={18} className="mr-2" />
              Filtros
              {activeFilters.length > 0 && (
                <span className="ml-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilters.length}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button className="flex items-center justify-between w-48 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                <div className="flex items-center">
                  <SortAsc size={18} className="mr-2 text-gray-500" />
                  <span className="text-sm font-medium">
                    {sortBy === "rating"
                      ? "Mejor valorados"
                      : sortBy === "distance"
                      ? "Más cercanos"
                      : "Más reseñas"}
                  </span>
                </div>
                <ChevronDown size={16} />
              </button>

              {/* Dropdown Menu - Would need JS toggle logic */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 hidden">
                <button
                  onClick={() => setSortBy("rating")}
                  className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'rating' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                >
                  Mejor valorados
                </button>
                <button
                  onClick={() => setSortBy("distance")}
                  className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'distance' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                >
                  Más cercanos
                </button>
                <button
                  onClick={() => setSortBy("reviews")}
                  className={`w-full text-left px-4 py-2 text-sm ${sortBy === 'reviews' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
                >
                  Más reseñas
                </button>
              </div>
            </div>

            {/* View Toggle */}
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center justify-center rounded-md w-10 h-8 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Ver en cuadrícula"
              >
                <Grid2X2 size={18} />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center justify-center rounded-md w-10 h-8 transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Ver en mapa"
              >
                <Map size={18} />
              </button>
            </div>
          </div>

          {/* Filter Options Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-700">Filtrar por:</h3>
                    {activeFilters.length > 0 && (
                      <button
                        onClick={() => setActiveFilters([])}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {category?.filters?.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => toggleFilter(filter)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          activeFilters.includes(filter)
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Places Grid/Map View */}
        {viewMode === "grid" ? (
          /* Grid View */
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedPlaces.map((place) => (
              <motion.div
                key={place.id}
                variants={item}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Card Header with Image */}
                <div
                  className="aspect-video relative cursor-pointer"
                  onClick={() => handlePlaceClick(place)}
                >
                  {place.images && place.images.length > 0 ? (
                    <img
                      src={getFeaturedImageUrl(place)}
                      alt={place.name}
                      className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MenuSquare size={40} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                  {/* Quick Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(place.id);
                      }}
                      className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      aria-label={
                        favorites.has(place.id)
                          ? "Quitar de favoritos"
                          : "Añadir a favoritos"
                      }
                    >
                      <Heart
                        size={16}
                        className={
                          favorites.has(place.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-700"
                        }
                      />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      aria-label="Compartir"
                    >
                      <Share2 size={16} className="text-gray-700" />
                    </button>
                  </div>

                  {/* Status Pills */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                    {place.isOpenNow && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                        <Clock3 size={12} className="mr-1" />
                        Abierto
                      </span>
                    )}
                    {place.priceLevel && (
                      <span className="bg-gray-100/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                        {place.priceLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div
                    onClick={() => handlePlaceClick(place)}
                    className="cursor-pointer"
                  >
                    <h3 className="font-bold text-gray-800 text-lg">
                      {place.name}
                    </h3>
                    <div className="flex items-center mt-1.5">
                      {place.rating ? (
                        <div className="flex items-center bg-green-50 text-green-700 px-2 py-0.5 rounded mr-2">
                          <Star
                            size={14}
                            className="text-yellow-500 fill-current"
                          />
                          <span className="ml-1 text-sm font-medium">
                            {place.rating}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center bg-gray-50 text-gray-500 px-2 py-0.5 rounded mr-2">
                          <Star size={14} />
                          <span className="ml-1 text-sm font-medium">
                            N/D
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Place Description */}
                  {place.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {place.description}
                    </p>
                  )}

                  {/* Place Details */}
                  <div className="mt-3">
                    {place.address && (
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                        <span className="truncate">{place.address}</span>
                      </div>
                    )}

                    {place.cuisine && (
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MenuSquare
                          size={14}
                          className="mr-1.5 flex-shrink-0"
                        />
                        <span>{place.cuisine}</span>
                      </div>
                    )}

                    {place.phone && (
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Phone size={14} className="mr-1.5 flex-shrink-0" />
                        <span>{place.phone}</span>
                      </div>
                    )}

                    {place.website && (
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Globe size={14} className="mr-1.5 flex-shrink-0" />
                        <a href={place.website} target="_blank" rel="noopener noreferrer" 
                           className="text-indigo-600 hover:underline truncate"
                           onClick={(e) => e.stopPropagation()}>
                          {new URL(place.website).hostname}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {place.features && place.features.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1.5">
                        Características:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {place.features.map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full"
                          >
                            {feature.feature.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Call To Action */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handlePlaceClick(place)}
                      className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-medium"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Map View */
          <div className="rounded-xl overflow-hidden shadow-lg h-[calc(100vh-300px)] min-h-[500px]">
            <MapComponent
              places={sortedPlaces}
              onPlaceClick={handlePlaceClick}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sortedPlaces.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="mx-auto h-24 w-24 text-gray-300">
              <Filter size={64} strokeWidth={1} className="mx-auto" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No hay resultados
            </h3>
            <p className="mt-1 text-gray-500">
              Prueba a cambiar tus filtros de búsqueda
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setActiveFilters([]);
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {/* Results Counter */}
        {!isLoading && sortedPlaces.length > 0 && (
          <div className="mt-5 text-center text-gray-500">
            Mostrando {sortedPlaces.length}{" "}
            {sortedPlaces.length === 1 ? "lugar" : "lugares"}
          </div>
        )}
      </div>
    </div>
  );
}