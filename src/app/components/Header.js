"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const router = useRouter();

  // Handle click outside to collapse search on desktop
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target) && 
        isSearchExpanded
      ) {
        setIsSearchExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchExpanded]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
    }
  };

  // Common spring animation settings
  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 26,
    mass: 1
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <AnimatePresence>
        {/* Mobile Expanded Search Overlay */}
        {isSearchExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-white z-50 pt-safe"
          >
            <form onSubmit={handleSearchSubmit} className="p-4 flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setIsSearchExpanded(false)}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>
              
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar lugares, categorías..."
                className="flex-1 py-2 px-4 border-none text-base focus:outline-none focus:ring-0 bg-gray-100 rounded-full"
                autoFocus
              />
              
              <button 
                type="submit"
                className="p-2 bg-indigo-600 rounded-full"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            </form>
            
            {/* Recent searches or suggestions */}
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Búsquedas recientes</h3>
              <div className="space-y-2">
                {['Restaurantes', 'Cafés', 'Parques', 'Museos'].map(term => (
                  <button 
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      searchInputRef.current?.focus();
                    }}
                    className="flex items-center gap-2 p-2 w-full text-left hover:bg-gray-50 rounded-lg"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed-height header container */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo with increased margin */}
        <Link href="/" className="flex items-center gap-2 mr-8">
          <MapPin className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-xl text-gray-800">Where To Go</span>
        </Link>
        
        {/* Desktop Navigation with fixed positioning - removed x animation */}
        <div className="hidden md:block flex-1">
          <motion.nav 
            animate={{ 
              opacity: isSearchExpanded ? 0.5 : 1,
              pointerEvents: isSearchExpanded ? "none" : "auto"
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex items-center gap-8"
          >
            <Link href="/explore" className="text-gray-600 hover:text-indigo-600">Explorar</Link>
            <Link href="/categories" className="text-gray-600 hover:text-indigo-600">Categorías</Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-600">Sobre Nosotros</Link>
          </motion.nav>
        </div>
        
        {/* Search and user section with advanced animation */}
        <div className="hidden md:flex items-center gap-4">
          <motion.div
            ref={searchContainerRef}
            layout
            className="relative h-10"
            animate={{
              width: isSearchExpanded ? 360 : 240
            }}
            transition={springTransition}
          >
            <form 
              onSubmit={handleSearchSubmit}
              className="w-full h-full"
            >
              <div className="relative h-full w-full flex items-center">
                {/* Animated search icon that transforms between states */}
                <motion.div
                  animate={{
                    left: isSearchExpanded ? 10 : 12,
                    opacity: isSearchExpanded ? 0.8 : 1
                  }}
                  transition={springTransition}
                  className="absolute top-1/2 transform -translate-y-1/2 z-10"
                >
                  <Search className={`h-5 w-5 ${isSearchExpanded ? 'text-indigo-500' : 'text-gray-400'}`} />
                </motion.div>
                
                {/* Input field with custom focus styles */}
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder={isSearchExpanded ? "Buscar lugares, categorías..." : "Buscar lugares..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchExpanded(true)}
                  className={`
                    pl-10 pr-${isSearchExpanded ? '12' : '4'} py-2 
                    border rounded-full text-sm 
                    h-full w-full transition-colors duration-300
                    ${isSearchExpanded 
                      ? 'border-indigo-300 shadow-sm bg-white' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
                    focus:outline-none focus:ring-0 focus:border-indigo-400
                  `}
                />

                {/* Animated search button */}
                <AnimatePresence>
                  {isSearchExpanded && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8, right: 0 }}
                      animate={{ opacity: 1, scale: 1, right: 8 }}
                      exit={{ opacity: 0, scale: 0.8, right: 0 }}
                      transition={springTransition}
                      type="submit"
                      className="absolute p-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white"
                    >
                      <Search className="h-3.5 w-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>
          
          <button 
            onClick={() => router.push('/login')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <User className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        {/* Mobile header actions */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            onClick={() => setIsSearchExpanded(true)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          
          <button 
            className="p-2 rounded-md focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md overflow-hidden"
          >
            <div className="space-y-3">
              <Link href="/explore" className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md">Explorar</Link>
              <Link href="/categories" className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md">Categorías</Link>
              <Link href="/about" className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md">Sobre Nosotros</Link>
              <Link href="/profile" className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md">Perfil</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}