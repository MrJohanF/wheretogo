"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Search, ChevronRight, Compass, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSection() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  // Featured destinations with images
  const destinations = [
    {
      name: "Barcelona",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      places: 230
    },
    {
      name: "Tokyo",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      places: 422
    },
    {
      name: "Paris",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      places: 368
    },
    {
      name: "Roma",
      image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      places: 291
    },
  ];
  
  // Auto-rotate images when not hovering
  useEffect(() => {
    if (!isHovering) {
      const timer = setTimeout(() => {
        setActiveImage((prev) => (prev + 1) % destinations.length);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [activeImage, isHovering, destinations.length]);
  
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white py-16 md:py-28 overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 -z-10">
        <svg width="100%" height="100%" className="absolute opacity-[0.07]">
          <pattern id="map-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20h40M20 0v40" stroke="white" strokeWidth="0.5" fill="none" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#map-grid)" />
        </svg>
        
        {/* Animated gradient circles */}
        <motion.div 
          className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 right-20 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Map pin decorations */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute text-white/10"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${5 + Math.random() * 90}%`,
              fontSize: `${1 + Math.random() * 1.5}rem`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0.2, 0.7, 0.2],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <MapPin />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left content column */}
          <motion.div
            className="lg:w-1/2 z-10 mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-block bg-white/15 backdrop-blur-sm text-sm px-4 py-1 rounded-full mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              +10.000 experiencias por descubrir
            </motion.span>
            
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Descubre las Mejores<br className="hidden md:block" />
              <span className="text-indigo-100">Experiencias Locales</span>
            </motion.h1>
            
            <motion.p
              className="text-lg mb-8 text-indigo-100 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Recomendaciones personalizadas de lugares para visitar, comer, comprar y más, 
              todo seleccionado por locales que conocen mejor su ciudad.
            </motion.p>

            {/* Search Box */}
            <motion.div
              className={`bg-white rounded-xl overflow-hidden shadow-xl mb-10 transition-all duration-300 ${
                searchFocused ? 'ring-4 ring-white/20' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center">
                <div className="pl-5">
                  <MapPin className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="text"
                  placeholder="¿A dónde vas?"
                  className="px-4 py-4 w-full text-gray-700 focus:outline-none"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <motion.button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 font-medium flex items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Explorar
                </motion.button>
              </div>
              
              {/* Quick Searches */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between flex-wrap">
                  <p className="text-xs text-gray-500">Búsquedas rápidas:</p>
                  <div className="flex gap-3">
                    {["Restaurantes", "Museos", "Eventos", "Cafés"].map((item) => (
                      <motion.span 
                        key={item}
                        className="text-sm text-indigo-600 cursor-pointer hover:underline"
                        whileHover={{ scale: 1.05 }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex items-center flex-wrap gap-x-6 gap-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {["100K+ Usuarios", "50K+ Lugares", "120+ Ciudades"].map((stat, i) => (
                <motion.div 
                  key={stat} 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.2 }}
                >
                  <motion.span 
                    className="bg-white h-2 w-2 rounded-full mr-2"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      repeatDelay: Math.random() * 2 
                    }}
                  ></motion.span>
                  <span className="text-sm">{stat}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right image showcase column */}
          <motion.div 
            className="lg:w-5/12 relative h-[450px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Decorative elements */}
            <motion.div 
              className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center cursor-pointer z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveImage((prev) => (prev - 1 + destinations.length) % destinations.length)}
            >
              <ChevronRight className="h-5 w-5 transform rotate-180" />
            </motion.div>
            
            <motion.div 
              className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center cursor-pointer z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveImage((prev) => (prev + 1) % destinations.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.div>
            
            {/* Image carousel */}
            <div className="relative rounded-3xl overflow-hidden h-full shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={destinations[activeImage].image}
                    alt={destinations[activeImage].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-transparent to-transparent"></div>
                  
                  {/* Location info */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full p-8"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="flex items-center mb-2">
                      <Map className="h-5 w-5 mr-2 text-purple-300" />
                      <span className="text-purple-200 text-sm font-medium">Destino destacado</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-3">{destinations[activeImage].name}</h2>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-indigo-200" />
                      <span className="text-indigo-100">{destinations[activeImage].places} lugares para explorar</span>
                    </div>
                    
                    <motion.button
                      className="mt-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg px-6 py-3 flex items-center font-medium"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Compass className="h-5 w-5 mr-2" />
                      Explorar destino
                    </motion.button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Image navigation indicators */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2">
              {destinations.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === activeImage ? 'bg-white' : 'bg-white/30'}`}
                  onClick={() => setActiveImage(index)}
                  whileHover={{ scale: 1.2 }}
                  animate={{ 
                    scale: index === activeImage ? [1, 1.2, 1] : 1
                  }}
                  transition={{ 
                    duration: index === activeImage ? 1.5 : 0.3,
                    repeat: index === activeImage ? Infinity : 0,
                    repeatDelay: 1
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}