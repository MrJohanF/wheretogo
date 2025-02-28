'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const categories = [
  { 
    id: 1, 
    name: 'Restaurantes', 
    icon: '🍽️', 
    count: 128,
    description: 'Descubre los mejores restaurantes de la ciudad',
    features: ['Reservas', 'Menús', 'Reseñas', 'Fotos']
  },
  { 
    id: 2, 
    name: 'Cafeterías', 
    icon: '☕', 
    count: 85,
    description: 'Encuentra tu café favorito',
    features: ['Especialidad', 'Ambiente', 'WiFi', 'Para llevar']
  },
  { id: 3, name: 'Bares', icon: '🍸', count: 64 },
  { id: 4, name: 'Museos', icon: '🏛️', count: 42 },
  { id: 5, name: 'Parques', icon: '🌳', count: 37 },
  { id: 6, name: 'Cines', icon: '🎬', count: 23 },
  { id: 7, name: 'Teatros', icon: '🎭', count: 18 },
  { id: 8, name: 'Deportes', icon: '⚽', count: 56 },
  { id: 9, name: 'Compras', icon: '🛍️', count: 94 },
  { id: 10, name: 'Eventos', icon: '🎉', count: 73 },
  { id: 11, name: 'Hoteles', icon: '🏨', count: 45 },
  { id: 12, name: 'Playas', icon: '🏖️', count: 31 }
];

export default function CategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Navigate to the category detail page
    router.push(`/categories/${category.id}`);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Categorías
          </h1>
          <p className="text-gray-600 mt-2">Explora lugares por categoría</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar categorías..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none bg-white shadow-sm"
            />
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(category)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.count} lugares</p>
                    </div>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className="text-gray-400 transform transition-transform duration-200 group-hover:translate-x-1" 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500">No se encontraron categorías</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
