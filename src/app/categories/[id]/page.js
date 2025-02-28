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

const mockPlaces = {
  1: [
    // Restaurants
    {
      id: 1,
      name: "La Terraza Restaurant",
      rating: 4.5,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      price: "$$",
      distance: "1.2km",
      openNow: true,
      address: "Calle Principal 123",
      cuisine: "Mediterránea",
      popular: ["Paella", "Sangría", "Tapas"],
      latitude: 40.416775,
      longitude: -3.70379,
    },
    {
      id: 2,
      name: "El Rincón Español",
      rating: 4.3,
      reviews: 95,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      price: "$$",
      distance: "0.8km",
      openNow: true,
      address: "Calle Secundaria 45",
      cuisine: "Española",
      popular: ["Tortilla", "Jamón", "Vino"],
      latitude: 40.417875,
      longitude: -3.70269,
    },
  ],
  2: [
    // Cafes
    {
      id: 3,
      name: "Café del Arte",
      rating: 4.8,
      reviews: 96,
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
      price: "$",
      distance: "0.8km",
      openNow: true,
      address: "Plaza Mayor 45",
      specialties: ["Café de especialidad", "Pasteles artesanales"],
      amenities: ["WiFi gratis", "Enchufes"],
      latitude: 40.415675,
      longitude: -3.70489,
    },
    {
      id: 4,
      name: "La Cafetería",
      rating: 4.6,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
      price: "$",
      distance: "1.5km",
      openNow: true,
      address: "Avenida Central 89",
      specialties: ["Desayunos", "Meriendas"],
      amenities: ["Terraza", "WiFi"],
      latitude: 40.418975,
      longitude: -3.70159,
    },
  ],
};

const categories = {
  1: {
    name: "Restaurantes",
    icon: "🍽️",
    description: "Descubre los mejores restaurantes de la ciudad",
    features: ["Reservas", "Menús", "Reseñas", "Fotos"],
    filters: ["Cocina", "Precio", "Valoración", "Distancia"],
  },
  // Add more category details...
};

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

  const categoryId = params?.id;
  const category = categories[categoryId];
  const places = mockPlaces[categoryId] || [];

  useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [categoryId]);

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

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Categoría no encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            Lo sentimos, la categoría que buscas no existe.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Volver al inicio
          </button>
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
                    {category.icon}
                  </span>
                  {category.name}
                  <span className="ml-2 text-sm font-medium bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full">
                    {places.length} lugares
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
                {category.description}
              </h2>
              <p className="text-indigo-100 text-lg">
                Explora {places.length} lugares destacados en esta categoría
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {category.features?.map((feature, idx) => (
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
                placeholder={`Buscar en ${category.name.toLowerCase()}...`}
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
                    {category.filters.map((filter) => (
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

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {places.map((place) => (
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
                  <img
                    src={place.image}
                    alt={place.name}
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                  />
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
                    {place.openNow && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                        <Clock3 size={12} className="mr-1" />
                        Abierto
                      </span>
                    )}
                    {place.price && (
                      <span className="bg-gray-100/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full font-medium">
                        {place.price}
                      </span>
                    )}
                    <span className="bg-gray-100/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                      <Navigation size={12} className="mr-1" />
                      {place.distance}
                    </span>
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
                      <div className="flex items-center bg-green-50 text-green-700 px-2 py-0.5 rounded mr-2">
                        <Star
                          size={14}
                          className="text-yellow-500 fill-current"
                        />
                        <span className="ml-1 text-sm font-medium">
                          {place.rating}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {place.reviews} reseñas
                      </span>
                    </div>
                  </div>

                  {/* Place Details */}
                  <div className="mt-3">
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                      <span className="truncate">{place.address}</span>
                    </div>

                    {place.cuisine && (
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MenuSquare
                          size={14}
                          className="mr-1.5 flex-shrink-0"
                        />
                        <span>{place.cuisine}</span>
                      </div>
                    )}
                  </div>

                  {/* Popular Items */}
                  {place.popular && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1.5">
                        Popular:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {place.popular.map((item, index) => (
                          <span
                            key={index}
                            className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full"
                          >
                            {item}
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
              places={places}
              onPlaceClick={handlePlaceClick}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && places.length === 0 && (
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
        {!isLoading && places.length > 0 && (
          <div className="mt-5 text-center text-gray-500">
            Mostrando {places.length}{" "}
            {places.length === 1 ? "lugar" : "lugares"}
          </div>
        )}
      </div>
    </div>
  );
}
