"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Search,
  Star,
  Filter,
  Heart,
  ChevronDown,
  X,
  List,
  Grid,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import the Map component to avoid SSR issues
const MapComponent = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-200px)] bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Cargando mapa...</p>
    </div>
  ),
});

export default function ExplorePage() {
  const [viewMode, setViewMode] = useState("grid"); // grid, list, map
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const resultsRef = useRef(null);
  const isResultsInView = useInView(resultsRef, {
    once: true,
    margin: "-100px",
  });

  // Sample places data - in a real app, this would come from an API
  const places = [
    {
      id: 1,
      name: "Café y Bistró Junto al Mar",
      type: "Café",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Venice Beach, CA",
      address: "123 Ocean Ave, Venice, CA 90291",
      rating: 4.8,
      reviews: 354,
      latitude: 33.985,
      longitude: -118.4695,
      categories: ["café", "restaurante", "desayuno"],
      price: "$$",
      description:
        "Un acogedor café con vistas al mar, perfecto para disfrutar de un desayuno tranquilo o una comida ligera mientras contemplas el océano.",
    },
    {
      id: 2,
      name: "Plaza del Mercado Vintage",
      type: "Compras",
      image:
        "https://images.unsplash.com/photo-1516559828984-fb3b99548b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Portland, OR",
      address: "456 Market St, Portland, OR 97204",
      rating: 4.7,
      reviews: 283,
      latitude: 45.5231,
      longitude: -122.6765,
      categories: ["compras", "vintage", "mercado"],
      price: "$",
      description:
        "Un mercado lleno de tesoros vintage, ropa de segunda mano y artículos únicos. El lugar perfecto para encontrar algo especial y diferente.",
    },
    {
      id: 3,
      name: "Mirador Skyline",
      type: "Punto Fotográfico",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Seattle, WA",
      address: "789 Skyline Dr, Seattle, WA 98101",
      rating: 4.9,
      reviews: 467,
      latitude: 47.6062,
      longitude: -122.3321,
      categories: ["mirador", "fotografía", "paisaje"],
      price: "Gratis",
      description:
        "El mejor punto para fotografiar el horizonte de la ciudad. Especialmente impresionante al atardecer cuando los edificios se iluminan.",
    },
    {
      id: 4,
      name: "Sendero del Bosque Oculto",
      type: "Naturaleza",
      image:
        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Asheville, NC",
      address: "101 Forest Path, Asheville, NC 28801",
      rating: 4.8,
      reviews: 215,
      latitude: 35.5951,
      longitude: -82.5515,
      categories: ["naturaleza", "senderismo", "bosque"],
      price: "Gratis",
      description:
        "Un sendero tranquilo a través de un bosque antiguo. Perfecto para caminatas, observación de aves y para escapar del bullicio de la ciudad.",
    },
    {
      id: 5,
      name: "Restaurante La Terraza",
      type: "Restaurante",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Barcelona, España",
      address: "Carrer de Mallorca 123, Barcelona",
      rating: 4.6,
      reviews: 512,
      latitude: 41.3851,
      longitude: 2.1734,
      categories: ["restaurante", "mediterráneo", "terraza"],
      price: "$$$",
      description:
        "Restaurante con terraza panorámica y vistas a la ciudad. Especializado en cocina mediterránea con un toque moderno.",
    },
    {
      id: 6,
      name: "Museo de Arte Contemporáneo",
      type: "Museo",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Madrid, España",
      address: "Calle Gran Vía 45, Madrid",
      rating: 4.5,
      reviews: 378,
      latitude: 40.4168,
      longitude: -3.7038,
      categories: ["museo", "arte", "cultura"],
      price: "$$",
      description:
        "Colección impresionante de arte contemporáneo con exposiciones rotativas de artistas internacionales y locales.",
    },
  ];

  // Filter categories
  const filterCategories = [
    {
      id: "type",
      name: "Tipo de lugar",
      options: [
        "Café",
        "Restaurante",
        "Museo",
        "Naturaleza",
        "Compras",
        "Mirador",
      ],
    },
    {
      id: "price",
      name: "Precio",
      options: ["Gratis", "$", "$$", "$$$", "$$$$"],
    },
    {
      id: "rating",
      name: "Calificación",
      options: ["4.5+", "4.0+", "3.5+", "3.0+"],
    },
  ];

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

  const toggleFilter = (filter) => {
    setActiveFilters((prev) => {
      if (prev.includes(filter)) {
        return prev.filter((f) => f !== filter);
      } else {
        return [...prev, filter];
      }
    });
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  // Filter places based on active filters and search query
  const filteredPlaces = places.filter((place) => {
    // Search query filter
    if (
      searchQuery &&
      !place.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !place.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !place.type.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Active filters
    if (activeFilters.length > 0) {
      const matchesFilter = activeFilters.some((filter) => {
        // Check if place matches any of the active filters
        return (
          place.type.includes(filter) ||
          place.price === filter ||
          (filter === "4.5+" && place.rating >= 4.5) ||
          (filter === "4.0+" && place.rating >= 4.0) ||
          (filter === "3.5+" && place.rating >= 3.5) ||
          (filter === "3.0+" && place.rating >= 3.0)
        );
      });

      if (!matchesFilter) return false;
    }

    return true;
  });

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-sm mb-6">
              Explora Lugares Increíbles
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed mb-8">
              Descubre los mejores restaurantes, cafeterías, atracciones y joyas
              ocultas en cualquier ciudad.
            </p>

            <div className="relative max-w-2xl mx-auto z-20">
              <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="pl-4">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nombre, ubicación o tipo..."
                  className="w-full py-4 px-3 text-gray-700 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="bg-indigo-600 text-white px-6 py-4 hover:bg-indigo-700 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,128C840,128,960,96,1080,80C1200,64,1320,64,1380,64L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border-b border-gray-200 shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                <Filter className="h-5 w-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-900">Filtros</h2>
                {activeFilters.length > 0 && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
                    {activeFilters.length}
                  </span>
                )}
              </div>

              {activeFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Active Filters Pills - Show selected filters at the top */}
            {activeFilters.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Filtros activos:
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className="px-3 py-1.5 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center hover:bg-indigo-200 transition-colors"
                    >
                      {filter}
                      <X className="h-3.5 w-3.5 ml-1.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Categories with improved UI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filterCategories.map((category) => (
                <div key={category.id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    {category.id === "type" && (
                      <List className="h-4 w-4 mr-1.5 text-indigo-600" />
                    )}
                    {category.id === "price" && (
                      <span className="mr-1.5 text-indigo-600 font-bold">
                        $
                      </span>
                    )}
                    {category.id === "rating" && (
                      <Star className="h-4 w-4 mr-1.5 text-indigo-600 fill-indigo-600" />
                    )}
                    {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleFilter(option)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                          activeFilters.includes(option)
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile-optimized filter buttons */}
            <div className="mt-8 border-t border-gray-200 pt-6 flex flex-wrap gap-4 justify-end">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  // Apply filters functionality would go here
                  setShowFilters(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Ver resultados
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* View Toggle and Results Count */}
      <div className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {filteredPlaces.length}{" "}
              {filteredPlaces.length === 1 ? "resultado" : "resultados"}
              {activeFilters.length > 0 && (
                <span className="ml-2">
                  con {activeFilters.length}{" "}
                  {activeFilters.length === 1 ? "filtro" : "filtros"}
                </span>
              )}
            </p>

            <div className="flex space-x-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded ${
                  viewMode === "map"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <MapIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <section className="py-8" ref={resultsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === "map" ? (
            // Map View
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <MapComponent
                places={filteredPlaces}
                onPlaceClick={setSelectedPlace}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          ) : (
            // Grid or List View
            <motion.div
              variants={container}
              initial="hidden"
              animate={isResultsInView ? "show" : "hidden"}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <motion.div
                    key={place.id}
                    variants={item}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div
                      className={`relative ${
                        viewMode === "list" ? "w-1/3" : "w-full"
                      }`}
                    >
                      <div
                        className={
                          viewMode === "list" ? "h-full" : "aspect-video"
                        }
                      >
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md z-10"
                        onClick={() => toggleFavorite(place.id)}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.has(place.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm py-1 px-3 rounded-full text-xs font-medium text-indigo-700">
                        {place.type}
                      </div>
                    </div>

                    <div
                      className={`p-5 ${viewMode === "list" ? "w-2/3" : ""}`}
                    >
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {place.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{place.location}</span>
                      </div>

                      {viewMode === "list" && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {place.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="font-medium text-gray-900">
                            {place.rating}
                          </span>
                          <span className="text-gray-500 ml-1">
                            ({place.reviews})
                          </span>
                        </div>
                        <Link
                          href={`/places/${place.id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Intenta con otros términos de búsqueda o ajusta los filtros
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Selected Place Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="relative aspect-video">
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
                onClick={() => toggleFavorite(selectedPlace.id)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    favorites.has(selectedPlace.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }`}
                />
              </button>
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 left-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPlace.name}
                </h2>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                  {selectedPlace.type}
                </span>
              </div>

              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{selectedPlace.address}</span>
              </div>

              <div className="flex items-center mb-6">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium text-gray-900 mr-2">
                  {selectedPlace.rating}
                </span>
                <span className="text-gray-500">
                  ({selectedPlace.reviews} reseñas)
                </span>
                <span className="mx-3 text-gray-300">|</span>
                <span className="text-gray-700 font-medium">
                  {selectedPlace.price}
                </span>
              </div>

              <p className="text-gray-600 mb-6">{selectedPlace.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPlace.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="flex space-x-4">
                <Link
                  href={`/places/${selectedPlace.id}`}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium text-center hover:bg-indigo-700 transition-colors"
                >
                  Ver detalles completos
                </Link>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
