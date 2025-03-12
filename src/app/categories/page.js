"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  TrendingUp,
  X,
  Filter,
  Bookmark,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useCategoryStore from "../store/categoryStore";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [filterMode, setFilterMode] = useState("all");
  const [savedCategories, setSavedCategories] = useState(new Set());

  const { categories, isLoading, error, fetchCategories, getOptimizedImageUrl } = useCategoryStore();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    setIsInitialLoad(false);
  }, [fetchCategories]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    router.push(`/categories/${category.id}`);
  };

  const goToHomePage = () => {
    router.push("/");
  };

  const toggleSaveCategory = (e, categoryId) => {
    e.stopPropagation();
    setSavedCategories((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(categoryId)) {
        newSaved.delete(categoryId);
      } else {
        newSaved.add(categoryId);
      }
      return newSaved;
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  let filteredCategories = categories;

  // Apply search filter
  if (searchTerm) {
    filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply trending/all filter
  if (filterMode === "trending") {
    filteredCategories = filteredCategories.filter(
      (category) => category.trending
    );
  }

  // Component for displaying category cards with optimized images
  const CategoryCard = ({ category, isFeatured = false }) => {
    // Reduce image dimensions for faster loading - much smaller dimensions
    const optimizedImageUrl = getOptimizedImageUrl(
      category.image,
      isFeatured ? 600 : 300, 
      isFeatured ? 240 : 160
    );

    return (
      <motion.div
        variants={item}
        onClick={() => handleCategoryClick(category)}
        className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full ${
          isFeatured ? "col-span-1 md:col-span-2 lg:col-span-2" : ""
        }`}
      >
        <div
          className={`relative ${isFeatured ? "h-48" : "h-32"} overflow-hidden`}
        >
          {category.image && !category.image.startsWith("blob:") && (
            <Image
              src={optimizedImageUrl}
              alt={category.name}
              width={isFeatured ? 600 : 300}
              height={isFeatured ? 240 : 160}
              className="w-full h-full object-cover"
              priority={isFeatured}
              quality={75} // Reduce quality slightly for faster loading
              sizes={isFeatured ? "(max-width: 768px) 100vw, 600px" : "(max-width: 768px) 100vw, 300px"}
              loading={isFeatured ? "eager" : "lazy"}
            />
          )}
          
          {/* Dynamic gradient overlay based on category color */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom right, 
                ${category.color ? category.color + 'CC' : 'rgba(0,0,0,0.7)'}, 
                ${category.color ? category.color + '22' : 'rgba(0,0,0,0.1)'})`
            }}
          ></div>

          {/* Category Icon and Badge */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              {/* Fixed Icon with Background */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl backdrop-blur-sm`}
                style={{
                  backgroundColor: category.color ? `${category.color}` : '#6366F1',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                {category.icon}
              </div>
              <div className="flex space-x-2">
                {category.trending && (
                  <span className="bg-white/30 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <TrendingUp size={12} className="mr-1" />
                    Trending
                  </span>
                )}
                <button
                  onClick={(e) => toggleSaveCategory(e, category.id)}
                  className={`p-1.5 rounded-full ${
                    savedCategories.has(category.id)
                      ? "bg-white text-indigo-600"
                      : "bg-white/30 backdrop-blur-sm text-white hover:bg-white/50"
                  } transition-colors`}
                >
                  <Bookmark
                    size={14}
                    className={
                      savedCategories.has(category.id) ? "fill-indigo-600" : ""
                    }
                  />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-xl drop-shadow-sm">
                {category.name}
              </h3>
              <div className="flex items-center mt-1">
                <span className="bg-white/30 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
                  {category.count} lugares
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Details */}
        <div className="p-5">
          {category.description && (
            <p className="text-gray-600 text-sm mb-3">{category.description}</p>
          )}

          {category.subcategories && category.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {category.subcategories
                .slice(0, isFeatured ? 5 : 3)
                .map((sub, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {sub}
                  </span>
                ))}
              {category.subcategories.length > (isFeatured ? 5 : 3) && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  +{category.subcategories.length - (isFeatured ? 5 : 3)} más
                </span>
              )}
            </div>
          )}

          <div className="flex items-center text-indigo-600 group">
            <span className="text-sm font-medium">Explorar</span>
            <ChevronRight
              size={16}
              className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </motion.div>
    );
  };

  // Component for list view items with optimized images
  const CategoryListItem = ({ category }) => {
    // Use smaller image dimensions for list items
    const optimizedImageUrl = getOptimizedImageUrl(category.image, 100, 100);

    return (
      <motion.div
        variants={item}
        onClick={() => handleCategoryClick(category)}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <div className="flex items-center p-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl mr-5`}
            style={{
              backgroundColor: category.color || '#6366F1'
            }}
          >
            {category.icon}
          </div>

          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-semibold text-gray-800">
                {category.name}
              </h3>
              {category.trending && (
                <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <TrendingUp size={10} className="mr-1" />
                  Trending
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {category.count} lugares • {category.description}
            </p>

            {category.subcategories && category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {category.subcategories
                  .slice(0, 3)
                  .map((sub, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full"
                    >
                      {sub}
                    </span>
                  ))}
                {category.subcategories.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{category.subcategories.length - 3} más
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <button
              onClick={(e) => toggleSaveCategory(e, category.id)}
              className={`p-2 rounded-full mr-2 ${
                savedCategories.has(category.id)
                  ? "text-indigo-600"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <Bookmark
                size={18}
                className={
                  savedCategories.has(category.id)
                    ? "fill-indigo-600"
                    : ""
                }
              />
            </button>
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </div>
      </motion.div>
    );
  };

  // Rest of the component (loading states, error handling, and renders) remains unchanged
  // ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 pb-12">
      {/* Header with Background */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        {/* Home Button in Header */}
        <button
          onClick={goToHomePage}
          className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2.5 rounded-full transition-all duration-300"
          aria-label="Go to home page"
        >
          <Home className="w-5 h-5 text-white" />
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-sm">
              Explora por Categorías
            </h1>
            <p className="mt-3 text-xl text-indigo-100 max-w-2xl mx-auto">
              Descubre los mejores lugares de la ciudad organizados por
              categorías
            </p>
          </motion.div>

          {/* Search Bar - Elevated Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mt-8 relative z-10"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar restaurantes, cafés, museos y más..."
                className="w-full pl-12 pr-12 py-4 rounded-xl border-0 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 outline-none bg-white/10 backdrop-blur-md text-white placeholder-white/70 shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/70 hover:text-white"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
            <path
              fill="#f8fafc"
              fillOpacity="1"
              d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,128C840,128,960,96,1080,80C1200,64,1320,64,1380,64L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="font-medium text-gray-700 flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              Filtrar por:
            </div>
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filterMode === "all"
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterMode("trending")}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center ${
                filterMode === "trending"
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <TrendingUp size={14} className="mr-1.5" />
              Tendencia
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Ver en cuadrícula"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Ver en lista"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Categories Display */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={container}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {/* Featured Categories (First 2) */}
              {filteredCategories.length > 0 &&
                filteredCategories
                  .slice(0, 2)
                  .map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      isFeatured={true}
                    />
                  ))}

              {/* Regular Categories */}
              {filteredCategories.length > 0 &&
                filteredCategories
                  .slice(2)
                  .map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
            </motion.div>
          ) : (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={container}
              className="space-y-4"
            >
              {filteredCategories.map((category) => (
                <CategoryListItem key={category.id} category={category} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No se encontraron categorías
            </h3>
            <p className="text-gray-500 mb-6">
              Intenta con otra búsqueda o explora todas las categorías
            </p>
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ver todas las categorías
            </button>
          </motion.div>
        )}

        {/* Stats Counter */}
        {filteredCategories.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Mostrando {filteredCategories.length} de {categories.length}{" "}
            categorías
          </div>
        )}
      </div>
    </div>
  );
}