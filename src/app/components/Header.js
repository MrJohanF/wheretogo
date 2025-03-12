"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  User,
  MapPin,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  // Original states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // New state for header transparency
  const [isTransparent, setIsTransparent] = useState(true);
  
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const userMenuRef = useRef(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Scroll detection for transparency toggle
  const { scrollY } = useScroll();
  
  useEffect(() => {
    const updateHeaderStyle = () => {
      const scrollPosition = window.scrollY;
      setIsTransparent(scrollPosition <= 50);
    };
    
    // Set initial state
    updateHeaderStyle();
    
    // Add scroll listener
    window.addEventListener("scroll", updateHeaderStyle);
    
    return () => window.removeEventListener("scroll", updateHeaderStyle);
  }, []);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        isSearchExpanded
      ) {
        setIsSearchExpanded(false);
      }
      
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        isUserMenuOpen
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchExpanded, isUserMenuOpen]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Common spring animation settings
  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 26,
  };

  return (
    <motion.header 
      className="fixed w-full top-0 z-50"
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ 
        backgroundColor: isTransparent 
          ? "rgba(0,0,0,0)" 
          : "rgba(255,255,255,1)",
        boxShadow: isTransparent 
          ? "none" 
          : "0 2px 10px rgba(0,0,0,0.1)"
      }}
      transition={{ duration: 0.3 }}
    >
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
            <form
              onSubmit={handleSearchSubmit}
              className="p-4 flex items-center gap-3"
            >
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

              <button type="submit" className="p-2 bg-indigo-600 rounded-full">
                <Search className="h-5 w-5 text-white" />
              </button>
            </form>

            {/* Recent searches or suggestions */}
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Búsquedas recientes
              </h3>
              <div className="space-y-2">
                {["Restaurantes", "Cafés", "Parques", "Museos"].map((term) => (
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

      {/* Header container with backdrop blur */}
      <div className={`${isTransparent ? 'bg-transparent backdrop-blur-sm bg-black/5' : 'bg-white'} transition-all duration-300`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo with increased margin */}
          <Link href="/" className="flex items-center gap-2 mr-8">
            <MapPin className={`h-6 w-6 ${isTransparent ? 'text-white' : 'text-indigo-600'}`} />
            <span className={`font-bold text-xl ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
              Where To Go
            </span>
          </Link>

          {/* Desktop Navigation with conditional styling */}
          <div className="hidden md:block flex-1">
            <motion.nav
              animate={{
                opacity: isSearchExpanded ? 0.5 : 1,
                pointerEvents: isSearchExpanded ? "none" : "auto",
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex items-center gap-8"
            >
              <Link
                href="/explore"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-300`}
              >
                Explorar
              </Link>
              <Link
                href="/categories"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-300`}
              >
                Categorías
              </Link>
              <Link 
                href="/about" 
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-indigo-600'} transition-colors duration-300`}
              >
                Sobre Nosotros
              </Link>
            </motion.nav>
          </div>

          {/* Search and user section with adaptive styling */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div
              ref={searchContainerRef}
              layout
              className="relative h-10"
              animate={{
                width: isSearchExpanded ? 360 : 240,
              }}
              transition={springTransition}
            >
              <form onSubmit={handleSearchSubmit} className="w-full h-full">
                <div className="relative h-full w-full flex items-center">
                  {/* Animated search icon */}
                  <motion.div
                    animate={{
                      left: isSearchExpanded ? 10 : 12,
                      opacity: isSearchExpanded ? 0.8 : 1,
                    }}
                    transition={springTransition}
                    className="absolute top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <Search
                      className={`h-5 w-5 ${
                        isSearchExpanded 
                          ? "text-indigo-500" 
                          : isTransparent 
                            ? "text-white" 
                            : "text-gray-400"
                      }`}
                    />
                  </motion.div>

                  {/* Adaptive input field */}
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={
                      isSearchExpanded
                        ? "Buscar lugares, categorías..."
                        : "Buscar lugares..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchExpanded(true)}
                    className={`
                      pl-10 pr-${isSearchExpanded ? "12" : "4"} py-2 
                      border rounded-full text-sm 
                      h-full w-full transition-all duration-300
                      ${
                        isSearchExpanded
                          ? "border-indigo-300 shadow-sm bg-white text-gray-800"
                          : isTransparent
                            ? "border-white/30 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white placeholder-white/70"
                            : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 placeholder-gray-400"
                      }
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

            {/* User menu with adaptive styling */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  isTransparent 
                    ? 'hover:bg-white/20 text-white' 
                    : user ? 'hover:bg-indigo-50' : 'hover:bg-gray-100'
                } relative`}
              >
                <User className={`h-5 w-5 ${
                  user 
                    ? isTransparent ? 'text-white' : 'text-indigo-600'
                    : isTransparent ? 'text-white' : 'text-gray-600'
                }`} />
                {user && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 8 }}
                    exit={{ opacity: 0, scale: 0.95, y: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 w-48 mt-1 bg-white rounded-lg shadow-lg py-1 border border-gray-200"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Iniciar Sesión
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Registrarse
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile header actions with adaptive styling */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`p-2 rounded-full transition-colors duration-300 ${
                isTransparent 
                  ? 'hover:bg-white/20 text-white' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              className={`p-2 rounded-md focus:outline-none transition-colors duration-300 ${
                isTransparent ? 'text-white' : 'text-gray-600'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu with adaptive styling */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden px-4 pt-2 pb-4 overflow-hidden ${
                isTransparent 
                  ? 'bg-black/60 backdrop-blur-lg text-white' 
                  : 'bg-white shadow-md text-gray-600'
              }`}
            >
              <div className="space-y-3">
                <Link
                  href="/explore"
                  className={`block px-3 py-2 rounded-md ${
                    isTransparent 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Explorar
                </Link>
                <Link
                  href="/categories"
                  className={`block px-3 py-2 rounded-md ${
                    isTransparent 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Categorías
                </Link>
                <Link
                  href="/about"
                  className={`block px-3 py-2 rounded-md ${
                    isTransparent 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Sobre Nosotros
                </Link>
                <Link
                  href="/profile"
                  className={`block px-3 py-2 rounded-md ${
                    isTransparent 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Perfil
                </Link>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className={`flex w-full items-center px-3 py-2 rounded-md ${
                      isTransparent 
                        ? 'text-red-300 hover:bg-red-800/20' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className={`block px-3 py-2 rounded-md ${
                      isTransparent 
                        ? 'text-indigo-300 hover:bg-indigo-800/20' 
                        : 'text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}