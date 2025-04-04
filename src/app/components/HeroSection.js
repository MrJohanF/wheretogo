"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MapPin, Search, ChevronRight, ChevronLeft, Compass, Map, Globe, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { getOptimizedImageUrl } from "../services/cloudinary"; // Adjust path as needed

// Constants moved outside component to avoid recreation on every render
const POPULAR_SEARCHES = ["Barcelona", "Tokyo", "New York", "Paris"];
const CATEGORY_ITEMS = ["Todo", "Restaurantes", "Museos", "Eventos", "Compras"];
const DESTINATIONS = [
  {
    name: "Jardín Botánico",
    tagline: "Naturaleza, biodiversidad, senderos, belleza",
    image: "https://res.cloudinary.com/ds4oxnii2/image/upload/v1741841144/chwhr6ukxdgloweukwnd.avif",
    places: " Av. Calle 63 # 68-95",
    country: "Bogotá",
    rating: 4.8
  },
  {
    name: "Piedra del Peñol",
    tagline: "Gigantesca roca, vistas impresionantes",
    image: "https://res.cloudinary.com/ds4oxnii2/image/upload/v1741841144/ftaimzfrhvspcuizlh3y.avif",
    places: "Guatapé",
    country: "Antioquia",
    rating: 4.4
  },
  {
    name: "Caño Cristales",
    tagline: "Río, naturaleza, color, belleza",
    image: "https://res.cloudinary.com/ds4oxnii2/image/upload/v1741841144/vskxk7oofb9yagjxca0z.jpg",
    places: "Serranía de la Macarena",
    country: "Meta",
    rating: 4.7
  },
  {
    name: "Monserrate",
    tagline: "Montaña, vistas, santuario, naturaleza",
    image: "https://res.cloudinary.com/ds4oxnii2/image/upload/v1741841144/xwjkzn9ql6kfkq9jvytv.avif",
    places: "Carrera 2 Este #21-48",
    country: "Bogotá",
    rating: 4.6
  },
  {
    name: "Barú",
    tagline: "Playas paradisíacas, mar cristalino",
    image: "https://res.cloudinary.com/ds4oxnii2/image/upload/v1741841144/wvtmzqhuo9d9cm45xqxp.avif",
    places: "Península, Sur de Colombia",
    country: "Cartagena",
    rating: 4.8
  },
];

export default function HeroSection() {
  // States
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [prevImage, setPrevImage] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("right");
  const [isHovering, setIsHovering] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Refs
  const searchInputRef = useRef(null);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  
  // Responsive hooks with lazy initialization to improve performance
  const isMobile = useMediaQuery({ maxWidth: 767 }, undefined, false);
  const isSmallScreen = useMediaQuery({ maxWidth: 639 }, undefined, false);
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }, undefined, false);
  
  // Create a responsive image URL generator based on device size
  const getResponsiveImageUrl = useCallback((url) => {
    if (isMobile) {
      // Mobile optimization: smaller size, maintain aspect ratio
      return getOptimizedImageUrl(url, {
        width: 640,
        height: 960,
        quality: "auto",
        crop: "fill"
      });
    } else if (isTablet) {
      // Tablet optimization: medium size
      return getOptimizedImageUrl(url, {
        width: 1024,
        height: 1200,
        quality: "auto",
        crop: "fill"
      });
    } else {
      // Desktop: higher resolution
      return getOptimizedImageUrl(url, {
        width: 1920,
        height: 1080,
        quality: "auto",
        crop: "fill"
      });
    }
  }, [isMobile, isTablet]);
  
  // Memoize current destination to prevent unnecessary re-renders
  const currentDestination = useMemo(() => DESTINATIONS[activeImage], [activeImage]);
  
  // Handle image transition with direction - memoized
  const handleImageChange = useCallback((newIndex, direction = "right") => {
    if (newIndex === activeImage) return;
    
    setPrevImage(activeImage);
    setActiveImage(newIndex);
    setTransitionDirection(direction);
  }, [activeImage]);
  
  // Search functionality - memoized
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search API call
    setTimeout(() => {
      // Save to recent searches (no duplicates)
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev].slice(0, 3));
      }
      
      setIsSearching(false);
      setSearchQuery("");
      // In a real app, you would navigate to search results page here
    }, 800);
  }, [searchQuery, recentSearches]);
  
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }, []);
  
  // Mouse events - memoized
  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);
  
  // Preload next image for smoother transitions with responsive URLs
  useEffect(() => {
    const nextIndex = (activeImage + 1) % DESTINATIONS.length;
    const img = new Image();
    img.src = getResponsiveImageUrl(DESTINATIONS[nextIndex].image);
  }, [activeImage, getResponsiveImageUrl]);
  
  // Auto-rotate images when not hovering
  useEffect(() => {
    if (!isHovering && !searchFocused) {
      const timer = setTimeout(() => {
        const nextImage = (activeImage + 1) % DESTINATIONS.length;
        handleImageChange(nextImage, "right");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeImage, isHovering, searchFocused, handleImageChange]);
  
  // Image transition variants - simplified for mobile
  const slideVariants = {
    enter: (direction) => ({
      x: isMobile ? 0 : direction === "right" ? "5%" : "-5%",
      opacity: 0,
      scale: isMobile ? 1 : 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: isMobile ? "tween" : "spring", stiffness: 200, damping: 30, duration: isMobile ? 0.3 : 0.6 },
        opacity: { duration: isMobile ? 0.3 : 0.6 },
        scale: { duration: isMobile ? 0.3 : 0.6 }
      }
    },
    exit: (direction) => ({
      x: isMobile ? 0 : direction === "right" ? "-5%" : "5%",
      opacity: 0,
      scale: isMobile ? 1 : 1.05,
      transition: {
        x: { type: isMobile ? "tween" : "spring", stiffness: 200, damping: 30, duration: isMobile ? 0.3 : 0.6 },
        opacity: { duration: isMobile ? 0.3 : 0.6 },
        scale: { duration: isMobile ? 0.3 : 0.6 }
      }
    })
  };

  // Background animation - simplified for mobile
  const backgroundVariants = {
    animate: {
      backgroundPosition: isMobile ? ["0% 0%", "100% 100%"] : ["0% 0%", "100% 100%"],
      transition: {
        duration: isMobile ? 60 : 30, // Slower on mobile to reduce CPU load
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // Navigation handlers - memoized
  const handleNextImage = useCallback(() => {
    const nextIndex = (activeImage + 1) % DESTINATIONS.length;
    handleImageChange(nextIndex, "right");
  }, [activeImage, handleImageChange]);
  
  const handlePrevImage = useCallback(() => {
    const prevIndex = (activeImage - 1 + DESTINATIONS.length) % DESTINATIONS.length;
    handleImageChange(prevIndex, "left");
  }, [activeImage, handleImageChange]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[100svh] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Discover travel destinations"
    >
      {/* Background gradient with simplified animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900"
        variants={backgroundVariants}
        animate="animate"
        style={{
          backgroundSize: "200% 200%",
        }}
      />
      
      {/* Abstract shapes - fewer on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-400 blur-[120px]" />
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-purple-400 blur-[100px]" />
          <div className="absolute top-2/3 right-1/3 w-64 h-64 rounded-full bg-indigo-300 blur-[80px]" />
        </div>
      )}
      
      {/* Full-width carousel */}
      <div ref={carouselRef} className="absolute inset-0 w-full h-full">
        {/* Animated fluid carousel */}
        <AnimatePresence initial={false} custom={transitionDirection}>
          <motion.div
            key={activeImage}
            className="absolute inset-0 w-full h-full"
            custom={transitionDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Image with overlay - enhanced with responsive images */}
            <div className="relative w-full h-full">
              <img
                src={getOptimizedImageUrl(currentDestination.image, {
                  width: 1920,
                  height: 1080,
                  quality: "auto",
                  crop: "fill"
                })}
                srcSet={`
                  ${getOptimizedImageUrl(currentDestination.image, { width: 640, height: 960, quality: "auto", crop: "fill" })} 640w,
                  ${getOptimizedImageUrl(currentDestination.image, { width: 1024, height: 1200, quality: "auto", crop: "fill" })} 1024w,
                  ${getOptimizedImageUrl(currentDestination.image, { width: 1920, height: 1080, quality: "auto", crop: "fill" })} 1920w
                `}
                sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
                alt={`Travel destination: ${currentDestination.name}`}
                className="w-full h-full object-cover"
                style={{ 
                  WebkitBackfaceVisibility: "hidden",
                  transformStyle: "preserve-3d"
                }}
                loading={activeImage === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              
              {/* Optimized gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 via-transparent to-indigo-950/30"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Content overlay with improved responsive layout and enough padding for the info card */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between pt-16 md:pt-20 pb-24 md:pb-6">
        {/* Main content - top section */}
        <div className="container mx-auto px-4 md:px-5">
          <div className="w-full max-w-3xl mx-auto lg:mx-0 lg:ml-10 xl:ml-20 text-center lg:text-left">
            {/* Badge - simplified animation for mobile */}
            <motion.span 
              className="inline-block bg-white/15 backdrop-blur-md text-white/90 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-6 border border-white/10"
              initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.2 : 0.4, duration: isMobile ? 0.4 : 0.6 }}
              whileHover={isMobile ? {} : { scale: 1.03, backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 inline mr-1 sm:mr-2" />
              +10.000 experiencias por descubrir
            </motion.span>
            
            {/* Main heading - simplified animation for mobile */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-5 leading-[1.15] sm:leading-[1.1] text-white tracking-tight"
              initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.1 : 0.2, duration: isMobile ? 0.5 : 0.8 }}
            >
              Descubre las <span className="bg-gradient-to-r from-sky-200 via-blue-100 to-indigo-100 bg-clip-text text-transparent">Mejores</span> Experiencias Locales
            </motion.h1>
            
            {/* Description - simplified animation for mobile */}
            <motion.p
              className="text-base sm:text-lg mb-5 sm:mb-6 md:mb-8 text-white/80 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.2 : 0.4, duration: isMobile ? 0.5 : 0.8 }}
            >
              Recomendaciones personalizadas de lugares para visitar, comer y comprar,
              seleccionados por locales que conocen mejor su ciudad.
            </motion.p>

            {/* Enhanced Search Box - simplified animation for mobile */}
            <motion.div
              className="relative w-full max-w-xl mx-auto lg:mx-0 z-20"
              initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.3 : 0.6, duration: isMobile ? 0.5 : 0.8 }}
            >
              <form onSubmit={handleSearch}>
                <div 
                  className={`bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl transition-all duration-300 ${
                    searchFocused ? 'ring-2 sm:ring-4 ring-white/30 shadow-lg shadow-indigo-500/20' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="pl-3 sm:pl-4 md:pl-5">
                      <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-indigo-500" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="¿A dónde vas?"
                      className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-5 w-full text-gray-700 focus:outline-none bg-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      aria-label="Search destinations"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600 p-1 sm:p-2"
                        aria-label="Clear search"
                      >
                        <X className="h-4 sm:h-5 w-4 sm:w-5" />
                      </button>
                    )}
                    <motion.button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 font-medium flex items-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[100px] md:min-w-[135px] justify-center"
                      whileHover={isMobile ? {} : { scale: 1.02 }}
                      whileTap={isMobile ? { scale: 0.98 } : { scale: 0.98 }}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                          <span className="hidden sm:inline">Buscando...</span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <Search className="h-4 sm:h-5 w-4 sm:w-5" />
                          <span className="hidden sm:inline">Explorar</span>
                          <span className="sm:hidden">Buscar</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Enhanced Search Suggestions - simplified animation for mobile */}
                  <AnimatePresence>
                    {searchFocused && (
                      <motion.div 
                        className="bg-white/95 backdrop-blur-sm border-t border-gray-100"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: isMobile ? 0.15 : 0.2 }}
                      >
                        <div className="p-3 sm:p-4">
                          {recentSearches.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <p className="text-xs text-gray-500 mb-1.5 sm:mb-2 font-medium">Búsquedas recientes</p>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {recentSearches.map((search, idx) => (
                                  <button
                                    key={`recent-${idx}`}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center"
                                    onClick={() => setSearchQuery(search)}
                                    type="button"
                                  >
                                    <MapPin className="h-2.5 sm:h-3 w-2.5 sm:w-3 mr-1 text-indigo-500" />
                                    {search}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <p className="text-xs text-gray-500 mb-1.5 sm:mb-2 font-medium">Destinos populares</p>
                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                              {POPULAR_SEARCHES.map((search, idx) => (
                                <button
                                  key={`popular-${idx}`}
                                  className="text-left bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs sm:text-sm p-2 sm:p-2.5 rounded-lg flex items-center"
                                  onClick={() => setSearchQuery(search)}
                                  type="button"
                                >
                                  <Compass className="h-3 sm:h-4 w-3 sm:w-4 mr-1.5 sm:mr-2 text-indigo-500" />
                                  {search}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>
              
              {/* Category chips - simplified animations for mobile */}
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORY_ITEMS.map((item, idx) => (
                  <motion.button
                    key={item} 
                    className={`${idx === 0 ? 'bg-white/80 text-indigo-700' : 'bg-white/20 text-white hover:bg-white/30'} text-xs sm:text-sm py-1 sm:py-1.5 px-3 sm:px-4 rounded-full whitespace-nowrap backdrop-blur-sm`}
                    whileHover={isMobile ? {} : { scale: 1.05 }}
                    whileTap={{ scale: isMobile ? 0.97 : 0.95 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom container for destination info panel and navigation - increased bottom padding on mobile */}
        <div className="container mx-auto px-4 md:px-5 mt-auto">
          <div className="flex flex-col-reverse md:flex-row md:items-end justify-between gap-3 md:gap-4">
            {/* Enhanced destination info panel - fixed positioning for mobile view */}
            <motion.div
              className={`backdrop-blur-lg bg-black/40 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-white/10 z-10
                w-full ${isMobile ? 'mb-2' : 'mb-0'} md:max-w-sm`}
              initial={{ opacity: 0, y: isMobile ? 15 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isMobile ? 0.4 : 0.8, duration: isMobile ? 0.5 : 0.8 }}
              style={{ 
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <div className="flex justify-between items-start mb-2 sm:mb-3">
                <div className="flex items-center">
                  <Map className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 mr-1.5 sm:mr-2 text-purple-300" />
                  <span className="text-purple-200 text-xs sm:text-sm font-medium">Destino destacado</span>
                </div>
                <div className="flex items-center bg-white/20 rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1">
                  <span className="text-yellow-300 mr-0.5 sm:mr-1 text-xs">★</span>
                  <span className="text-white text-xs font-medium">{currentDestination.rating}</span>
                </div>
              </div>
              
              <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{currentDestination.name}</h2>
                <p className="text-white/80 text-xs sm:text-sm">{currentDestination.tagline}</p>
                
                <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <Globe className="h-3 sm:h-3.5 md:h-4 w-3 sm:w-3.5 md:w-4 mr-1 sm:mr-1.5 text-indigo-200" />
                    <span className="text-indigo-100">{currentDestination.country}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 sm:h-3.5 md:h-4 w-3 sm:w-3.5 md:w-4 mr-1 sm:mr-1.5 text-indigo-200" />
                    <span className="text-indigo-100">{currentDestination.places}</span>
                  </div>
                </div>
                
                <motion.button
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg w-full px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3.5 flex items-center justify-center font-medium mt-1 sm:mt-2"
                  whileHover={isMobile ? {} : { scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                  whileTap={{ scale: isMobile ? 0.97 : 0.98 }}
                >
                  <Compass className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 mr-1.5 sm:mr-2" />
                  Explorar destino
                </motion.button>
              </div>
            </motion.div>
            
            {/* Carousel navigation - simplified for mobile */}
            <div className={`flex justify-center mb-1 sm:mb-2 md:mb-0 md:justify-end items-center gap-1.5 sm:gap-2 md:gap-4`}>
              {/* Progress bar on desktop, dots on mobile */}
              <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md rounded-full h-2 w-48 overflow-hidden">
                {DESTINATIONS.map((_, index) => (
                  <motion.button
                    key={index}
                    className="h-full"
                    style={{
                      width: `${100 / DESTINATIONS.length}%`,
                      backgroundColor: index === activeImage ? 'white' : 'transparent',
                      position: 'relative',
                    }}
                    onClick={() => handleImageChange(
                      index, 
                      index > activeImage ? "right" : "left"
                    )}
                    whileHover={{ backgroundColor: index === activeImage ? 'white' : 'rgba(255,255,255,0.3)' }}
                  >
                    {index === activeImage && (
                      <motion.div 
                        className="absolute inset-0 bg-white"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 6, ease: "linear" }}
                        style={{ originX: 0 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Mobile dots */}
              <div className="flex md:hidden space-x-1.5 sm:space-x-2">
                {DESTINATIONS.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`rounded-full ${index === activeImage ? 'bg-white w-5 sm:w-6 h-1.5 sm:h-2' : 'bg-white/30 w-1.5 sm:w-2 h-1.5 sm:h-2'}`}
                    onClick={() => handleImageChange(index, index > activeImage ? "right" : "left")}
                    whileHover={isMobile ? {} : { scale: 1.2 }}
                    transition={{ duration: isMobile ? 0.2 : 0.3 }}
                    layout
                  />
                ))}
              </div>
              
              {/* Arrow navigation - simplified for mobile */}
              <div className="flex space-x-1.5 sm:space-x-2 md:space-x-3">
                <motion.button
                  className="bg-white/10 backdrop-blur-md rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer border border-white/20"
                  whileHover={isMobile ? {} : { scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: isMobile ? 0.92 : 0.95 }}
                  onClick={handlePrevImage}
                  aria-label="Previous destination"
                >
                  <ChevronLeft className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 text-white" />
                </motion.button>
                
                <motion.button
                  className="bg-white/10 backdrop-blur-md rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer border border-white/20"
                  whileHover={isMobile ? {} : { scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: isMobile ? 0.92 : 0.95 }}
                  onClick={handleNextImage}
                  aria-label="Next destination"
                >
                  <ChevronRight className="h-3.5 sm:h-4 md:h-5 w-3.5 sm:w-4 md:w-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom styles */}
      <style jsx global>{`
        /* Hide scrollbar but allow scrolling */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari, Opera */
        }
        
        /* Optimize for fluid animations */
        img {
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        /* Use system viewport height for mobile */
        @supports (height: 100svh) {
          .h-$$100svh$$ {
            height: 100svh;
          }
        }
      `}</style>
    </section>
  );
}