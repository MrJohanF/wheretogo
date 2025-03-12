"use client";
import { useState, useEffect, useRef } from "react";
import { MapPin, Search, ChevronRight, ChevronLeft, Compass, Map } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

export default function HeroSection() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [prevImage, setPrevImage] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("right");
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  
  // Featured destinations with images
  const destinations = [
    {
      name: "Barcelona",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      places: 230
    },
    {
      name: "Tokyo",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      places: 422
    },
    {
      name: "Paris",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      places: 368
    },
    {
      name: "Roma",
      image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      places: 291
    },
  ];
  
  // Handle image transition with direction
  const handleImageChange = (newIndex, direction = "right") => {
    setPrevImage(activeImage);
    setActiveImage(newIndex);
    setTransitionDirection(direction);
  };
  
  // Auto-rotate images when not hovering
  useEffect(() => {
    if (!isHovering) {
      const timer = setTimeout(() => {
        const nextImage = (activeImage + 1) % destinations.length;
        handleImageChange(nextImage, "right");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeImage, isHovering, destinations.length]);
  
  // Track mouse position for light effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const { clientX, clientY } = e;
        const rect = containerRef.current.getBoundingClientRect();
        
        // Calculate the mouse position relative to the container
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        setMousePosition({ x, y });
        
        // Update spotlight position with smooth transitions
        if (spotlightRef.current) {
          spotlightRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Generate bouncing orbs for background
  const orbsConfig = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: 40 + Math.random() * 160,
    initialPosition: {
      x: Math.random() * 100,
      y: Math.random() * 100,
    },
    bounce: {
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 30,
    },
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 12,
  }));

  // Fluid transition variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction === "right" ? "100%" : "-100%",
      scale: 1.1,
      opacity: 0,
    }),
    center: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      x: direction === "right" ? "-100%" : "100%",
      scale: 1.1,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    })
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900"
    >
      {/* Full-width carousel */}
      <div ref={carouselRef} className="absolute inset-0 w-full h-full">
        {/* Animated fluid carousel */}
        <AnimatePresence initial={false} mode="wait" custom={transitionDirection}>
          <motion.div
            key={activeImage}
            className="absolute inset-0 w-full h-full"
            custom={transitionDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ zIndex: 1 }}
          >
            {/* Image with fluid mask overlay */}
            <div className="relative w-full h-full">
              <img
                src={destinations[activeImage].image}
                alt={destinations[activeImage].name}
                className="w-full h-full object-cover"
                style={{ 
                  WebkitBackfaceVisibility: "hidden",
                  willChange: "transform"
                }}
              />
              
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-transparent to-indigo-900/40"></div>
              
              {/* Liquid filter effect */}
              <div 
                className="absolute inset-0 backdrop-blur-[2px] opacity-10" 
                style={{ 
                  mixBlendMode: "overlay",
                  maskImage: "radial-gradient(black, transparent)"
                }}
              ></div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Light effect following mouse */}
        <div 
          ref={spotlightRef}
          className="absolute pointer-events-none"
          style={{
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
            transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
            transition: "transform 0.8s cubic-bezier(0.075, 0.82, 0.165, 1)",
            zIndex: 2
          }}
        ></div>
        
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          {orbsConfig.map((orb) => (
            <motion.div
              key={orb.id}
              className="absolute rounded-full bg-white/5 backdrop-blur-xl"
              style={{
                width: orb.size,
                height: orb.size,
                left: `${orb.initialPosition.x}%`,
                top: `${orb.initialPosition.y}%`,
              }}
              animate={{
                x: [0, orb.bounce.x * 10, 0],
                y: [0, orb.bounce.y * 10, 0],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                repeat: Infinity,
                duration: orb.duration,
                ease: "easeInOut",
                delay: orb.delay,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center lg:items-start">
          <div className="w-full max-w-3xl mx-auto lg:mx-0 lg:ml-10 xl:ml-20 text-center lg:text-left">
            {/* Badge */}
            <motion.span 
              className="inline-block bg-white/15 backdrop-blur-md text-sm px-4 py-1 rounded-full mb-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              +10.000 experiencias por descubrir
            </motion.span>
            
            {/* Main heading */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Descubre las <span className="bg-gradient-to-r from-cyan-100 to-indigo-100 bg-clip-text text-transparent">Mejores</span> Experiencias Locales
            </motion.h1>
            
            {/* Description */}
            <motion.p
              className="text-lg mb-8 text-indigo-50/90 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Recomendaciones personalizadas de lugares para visitar, comer y comprar,
              seleccionados por locales que conocen mejor su ciudad.
            </motion.p>

            {/* Search Box */}
            <motion.div
              className={`bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl mb-10 w-full max-w-xl mx-auto lg:mx-0 transition-all duration-300 ${
                searchFocused ? 'ring-4 ring-white/20 shadow-lg shadow-indigo-500/20' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
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
                  className="px-4 py-5 w-full text-gray-700 focus:outline-none bg-transparent"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <motion.button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 font-medium flex items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Explorar
                </motion.button>
              </div>
              
              {/* Quick Searches */}
              <div className="bg-gray-50/80 backdrop-blur-sm px-5 py-3 border-t border-gray-100">
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
            
            {/* Location info panel */}
            <motion.div
              className="absolute bottom-16 left-0 right-0 lg:left-auto lg:right-auto lg:bottom-auto max-w-md backdrop-blur-lg bg-black/30 p-6 rounded-2xl border border-white/10 mx-4 lg:mx-0 lg:mr-10 xl:mr-20 lg:mt-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ 
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center mb-2">
                <Map className="h-5 w-5 mr-2 text-purple-300" />
                <span className="text-purple-200 text-sm font-medium">Destino destacado</span>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white">{destinations[activeImage].name}</h2>
              <div className="flex items-center mb-4">
                <MapPin className="h-4 w-4 mr-2 text-indigo-200" />
                <span className="text-indigo-100">{destinations[activeImage].places} lugares para explorar</span>
              </div>
              
              <motion.button
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg w-full px-6 py-3 flex items-center justify-center font-medium"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.25)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Compass className="h-5 w-5 mr-2" />
                Explorar destino
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Carousel navigation */}
      <div className="absolute z-20 bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
        {/* Navigation arrows */}
        <motion.button
          className="bg-white/10 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center cursor-pointer border border-white/20"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const prevIndex = (activeImage - 1 + destinations.length) % destinations.length;
            handleImageChange(prevIndex, "left");
          }}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </motion.button>
        
        {/* Indicators */}
        <div className="flex space-x-3">
          {destinations.map((_, index) => (
            <motion.button
              key={index}
              className={`rounded-full ${index === activeImage 
                ? 'bg-white w-8 h-2' 
                : 'bg-white/30 w-2 h-2'}`}
              onClick={() => handleImageChange(
                index, 
                index > activeImage ? "right" : "left"
              )}
              whileHover={{ scale: 1.2 }}
              transition={{ 
                duration: 0.3,
                layout: { type: "spring", stiffness: 300, damping: 30 }
              }}
              layout
            />
          ))}
        </div>
        
        <motion.button
          className="bg-white/10 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center cursor-pointer border border-white/20"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const nextIndex = (activeImage + 1) % destinations.length;
            handleImageChange(nextIndex, "right");
          }}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </motion.button>
      </div>
      
      {/* Global styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        /* Optimizations for fluid animations */
        img {
          backface-visibility: hidden;
          transform: translateZ(0);
          perspective: 1000;
        }
      `}</style>
    </section>
  );
}