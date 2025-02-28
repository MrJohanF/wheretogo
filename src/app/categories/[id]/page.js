'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Star, Clock, Phone, Globe, Filter, SortAsc, Map, Grid2X2, Heart } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-200px)] bg-gray-100 animate-pulse rounded-xl"></div>
  ),
});

// Mock data for places (in a real app, this would come from an API)
const mockPlaces = {
  1: [ // Restaurants
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
      longitude: -3.703790
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
      longitude: -3.702690
    }
  ],
  2: [ // Cafes
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
      longitude: -3.704890
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
      longitude: -3.701590
    }
  ],
};

const categories = {
  1: {
    name: 'Restaurantes',
    icon: '🍽️',
    description: 'Descubre los mejores restaurantes de la ciudad',
    features: ['Reservas', 'Menús', 'Reseñas', 'Fotos'],
    filters: ['Cocina', 'Precio', 'Valoración', 'Distancia']
  },
  // Add more category details...
};

export default function CategoryDetail() {
  const router = useRouter();
  const params = useParams();
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [favorites, setFavorites] = useState(new Set());
  const categoryId = params?.id;
  const category = categories[categoryId];
  const places = mockPlaces[categoryId] || [];

  const toggleFavorite = (placeId) => {
    setFavorites(prev => {
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

  if (!category) {
    return null; // Or a proper 404 page
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2 text-3xl">{category.icon}</span>
                {category.name}
              </h1>
              <p className="text-gray-600 mt-1">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid2X2 size={18} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'map'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Map size={18} />
              </button>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow transition-all text-gray-700"
            >
              <Filter size={18} className="mr-2" />
              Filtros
            </button>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2"
              >
                {category.filters.map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <div className="flex items-center">
            <SortAsc size={18} className="text-gray-400 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border-0 text-gray-600 text-sm focus:ring-0"
            >
              <option value="rating">Mejor valorados</option>
              <option value="distance">Más cercanos</option>
              <option value="reviews">Más reseñas</option>
            </select>
          </div>
        </div>

        {viewMode === 'grid' ? (
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
                className="bg-white rounded-xl shadow-sm overflow-hidden group cursor-pointer"
                onClick={() => handlePlaceClick(place)}
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="object-cover w-full h-48"
                  />
                  {place.openNow && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Abierto
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(place.id);
                    }}
                    className="absolute top-4 left-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  >
                    <Heart
                      size={18}
                      className={favorites.has(place.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{place.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-gray-600 text-sm ml-1">{place.rating}</span>
                        <span className="text-gray-400 text-sm ml-1">({place.reviews})</span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-gray-600 text-sm">{place.price}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{place.distance}</span>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    {place.address}
                  </div>
                  {place.cuisine && (
                    <div className="mt-3 text-sm text-gray-600">{place.cuisine}</div>
                  )}
                  {place.popular && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Popular:</div>
                      <div className="flex flex-wrap gap-2">
                        {place.popular.map((item, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-xl overflow-hidden shadow-sm">
            <MapComponent
              places={places}
              onPlaceClick={handlePlaceClick}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}
      </div>
    </div>
  );
} 