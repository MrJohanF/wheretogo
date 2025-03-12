"use client";
import { useState, useEffect, useRef } from "react";
import { MapPin, Search, ChevronRight, ChevronLeft, Compass, Map, Globe, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useMediaQuery } from "react-responsive";

export default function HeroSection() {
  // States
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [prevImage, setPrevImage] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("right");
  const [isHovering, setIsHovering] = useState(false);
  const [popularSearches] = useState(["Barcelona", "Tokyo", "New York", "Paris"]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Refs
  const searchInputRef = useRef(null);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  
  // Responsive hooks
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isSmallScreen = useMediaQuery({ maxWidth: 639 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  
  // Featured destinations with images and additional metadata
  const destinations = [
    {
      name: "Jardín Botánico",
      tagline: "Naturaleza, biodiversidad, senderos, belleza",
      image: "/images/jardin-botanico.jpg",
      places: " Av. Calle 63 # 68-95",
      country: "Bogotá",
      rating: 4.8
    },
    {
      name: "Piedra del Peñol",
      tagline: "Gigantesca roca, vistas impresionantes",
      image: "/images/piedra-del-penol.avif",
      places: "Guatapé",
      country: "Antioquia",
      rating: 4.4
    },
    {
      name: "Caño Cristales",
      tagline: "Río, naturaleza, color, belleza",
      image: "/images/cano-cristales.avif",
      places: "Serranía de la Macarena",
      country: "Meta",
      rating: 4.7
    },
    {
      name: "Monserrate",
      tagline: "Montaña, vistas, santuario, naturaleza",
      image: "/images/monserrate.jpg",
      places: "Carrera 2 Este #21-48",
      country: "Bogotá",
      rating: 4.6
    },
    {
      name: "Barú",
      tagline: "Playas paradisíacas, mar cristalino",
      image: "/images/baru.jpg",
      places: "Península, Sur de Colombia",
      country: "Cartagena",
      rating: 4.8
    },
  ];
  
  // Handle image transition with direction
  const handleImageChange = (newIndex, direction = "right") => {
    if (newIndex === activeImage) return;
    
    setPrevImage(activeImage);
    setActiveImage(newIndex);
    setTransitionDirection(direction);
  };
  
  // Search functionality
  const handleSearch = (e) => {
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
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };
  
  // Auto-rotate images when not hovering
  useEffect(() => {
    if (!isHovering && !searchFocused) {
      const timer = setTimeout(() => {
        const nextImage = (activeImage + 1) % destinations.length;
        handleImageChange(nextImage, "right");
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeImage, isHovering, destinations.length, searchFocused]);
  
  // Image transition variants - more natural easing
  const slideVariants = {
    enter: (direction) => ({
      x: direction === "right" ? "5%" : "-5%",
      scale: 1.05,
      opacity: 0,
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.6 }
      }
    },
    exit: (direction) => ({
      x: direction === "right" ? "-5%" : "5%",
      scale: 1.05,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.6 }
      }
    })
  };

  // More subtle background animation
  const backgroundVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 30,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[100svh] overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label="Discover travel destinations"
    >
      {/* Background gradient with subtle animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900"
        variants={backgroundVariants}
        animate="animate"
        style={{
          backgroundSize: "200% 200%",
        }}
      />
      
      {/* Abstract shapes for visual interest */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-400 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-purple-400 blur-[100px]" />
        <div className="absolute top-2/3 right-1/3 w-64 h-64 rounded-full bg-indigo-300 blur-[80px]" />
      </div>
      
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
            {/* Image with overlay */}
            <div className="relative w-full h-full">
              <img
                src={destinations[activeImage].image}
                alt={`Travel destination: ${destinations[activeImage].name}`}
                className="w-full h-full object-cover"
                style={{ 
                  WebkitBackfaceVisibility: "hidden",
                  transformStyle: "preserve-3d"
                }}
                loading="eager" // Load hero images immediately
              />
              
              {/* Optimized gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 via-transparent to-indigo-950/30"></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Content overlay with improved responsive layout */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between pt-20 pb-6">
        {/* Main content - top section */}
        <div className="container mx-auto px-5">
          <div className="w-full max-w-3xl mx-auto lg:mx-0 lg:ml-10 xl:ml-20 text-center lg:text-left">
            {/* Badge */}
            <motion.span 
              className="inline-block bg-white/15 backdrop-blur-md text-white/90 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Globe className="h-3.5 w-3.5 inline mr-2" />
              +10.000 experiencias por descubrir
            </motion.span>
            
            {/* Main heading */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 sm:mb-6 leading-[1.1] text-white tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Descubre las <span className="bg-gradient-to-r from-sky-200 via-blue-100 to-indigo-100 bg-clip-text text-transparent">Mejores</span> Experiencias Locales
            </motion.h1>
            
            {/* Description */}
            <motion.p
              className="text-lg mb-6 sm:mb-8 text-white/80 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Recomendaciones personalizadas de lugares para visitar, comer y comprar,
              seleccionados por locales que conocen mejor su ciudad.
            </motion.p>

            {/* Enhanced Search Box */}
            <motion.div
              className="relative w-full max-w-xl mx-auto lg:mx-0 z-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <form onSubmit={handleSearch}>
                <div 
                  className={`bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                    searchFocused ? 'ring-4 ring-white/30 shadow-lg shadow-indigo-500/20' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="pl-4 sm:pl-5">
                      <MapPin className="h-5 w-5 text-indigo-500" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="¿A dónde vas?"
                      className="px-3 sm:px-4 py-4 sm:py-5 w-full text-gray-700 focus:outline-none bg-transparent"
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
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 sm:px-6 py-4 sm:py-5 font-medium flex items-center gap-2 min-w-[100px] sm:min-w-[135px] justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                  
                  {/* Enhanced Search Suggestions */}
                  <AnimatePresence>
                    {searchFocused && (
                      <motion.div 
                        className="bg-white/95 backdrop-blur-sm border-t border-gray-100"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4">
                          {recentSearches.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 mb-2 font-medium">Búsquedas recientes</p>
                              <div className="flex flex-wrap gap-2">
                                {recentSearches.map((search, idx) => (
                                  <button
                                    key={`recent-${idx}`}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1.5 rounded-full flex items-center"
                                    onClick={() => setSearchQuery(search)}
                                    type="button"
                                  >
                                    <MapPin className="h-3 w-3 mr-1 text-indigo-500" />
                                    {search}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <p className="text-xs text-gray-500 mb-2 font-medium">Destinos populares</p>
                            <div className="grid grid-cols-2 gap-2">
                              {popularSearches.map((search, idx) => (
                                <button
                                  key={`popular-${idx}`}
                                  className="text-left bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm p-2.5 rounded-lg flex items-center"
                                  onClick={() => setSearchQuery(search)}
                                  type="button"
                                >
                                  <Compass className="h-4 w-4 mr-2 text-indigo-500" />
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
              
              {/* Category chips */}
              <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2 no-scrollbar">
                {["Todo", "Restaurantes", "Museos", "Eventos", "Compras"].map((item, idx) => (
                  <motion.button
                    key={item} 
                    className={`${idx === 0 ? 'bg-white/80 text-indigo-700' : 'bg-white/20 text-white hover:bg-white/30'} text-sm py-1.5 px-4 rounded-full whitespace-nowrap backdrop-blur-sm`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom container for destination info panel and navigation */}
        <div className="container mx-auto px-5 mt-8 flex flex-col">
          <div className="flex flex-col-reverse md:flex-row md:items-end justify-between gap-4">
            {/* Enhanced destination info panel - repositioned in mobile view */}
            <motion.div
              className={`backdrop-blur-lg bg-black/40 p-4 sm:p-6 rounded-2xl border border-white/10 z-10
                w-full ${isSmallScreen ? 'mb-4' : 'mb-0'} md:max-w-sm`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ 
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <Map className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-purple-300" />
                  <span className="text-purple-200 text-xs sm:text-sm font-medium">Destino destacado</span>
                </div>
                <div className="flex items-center bg-white/20 rounded-lg px-2 py-1">
                  <span className="text-yellow-300 mr-1 text-xs">★</span>
                  <span className="text-white text-xs font-medium">{destinations[activeImage].rating}</span>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{destinations[activeImage].name}</h2>
                <p className="text-white/80 text-xs sm:text-sm">{destinations[activeImage].tagline}</p>
                
                <div className="flex items-center space-x-4 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <Globe className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-1.5 text-indigo-200" />
                    <span className="text-indigo-100">{destinations[activeImage].country}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-1.5 text-indigo-200" />
                    <span className="text-indigo-100">{destinations[activeImage].places}</span>
                  </div>
                </div>
                
                <motion.button
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg w-full px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-center font-medium mt-1 sm:mt-2"
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Compass className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Explorar destino
                </motion.button>
              </div>
            </motion.div>
            
            {/* Carousel navigation - moved to right on desktop */}
            <div className={`flex justify-center ${isSmallScreen ? 'mb-2' : 'mb-0'} md:justify-end items-center gap-2 sm:gap-4`}>
              {/* Progress bar on desktop, dots on mobile */}
              <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md rounded-full h-2 w-48 overflow-hidden">
                {destinations.map((_, index) => (
                  <motion.button
                    key={index}
                    className="h-full"
                    style={{
                      width: `${100 / destinations.length}%`,
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
              <div className="flex md:hidden space-x-2">
                {destinations.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`rounded-full ${index === activeImage ? 'bg-white w-6 h-2' : 'bg-white/30 w-2 h-2'}`}
                    onClick={() => handleImageChange(index, index > activeImage ? "right" : "left")}
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    layout
                  />
                ))}
              </div>
              
              {/* Arrow navigation */}
              <div className="flex space-x-2 sm:space-x-3">
                <motion.button
                  className="bg-white/10 backdrop-blur-md rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer border border-white/20"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const prevIndex = (activeImage - 1 + destinations.length) % destinations.length;
                    handleImageChange(prevIndex, "left");
                  }}
                  aria-label="Previous destination"
                >
                  <ChevronLeft className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
                </motion.button>
                
                <motion.button
                  className="bg-white/10 backdrop-blur-md rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer border border-white/20"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const nextIndex = (activeImage + 1) % destinations.length;
                    handleImageChange(nextIndex, "right");
                  }}
                  aria-label="Next destination"
                >
                  <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
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