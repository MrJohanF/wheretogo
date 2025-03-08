// src/app/admin/layout.js

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, X, Home, MapPin, Users, BarChart2, Settings, 
  Search, Bell, User, ChevronDown, LogOut, Compass,
  Coffee, Utensils, Map, Activity
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AdminRoute from '@/app/components/AdminRoute';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'react-hot-toast';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Get auth context for user info and logout function
  const { user, logout } = useAuth();
  
  // Close sidebar on small screens by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && 
          !event.target.closest('#sidebar') && 
          !event.target.closest('[data-menu-button]')) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close profile dropdown when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-profile-area]')) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const navItems = [
    { name: 'Vista General', icon: <Home size={20} />, id: 'overview', href: '/admin/dashboard' },
    { name: 'Lugares', icon: <MapPin size={20} />, id: 'places', href: '/admin/places' },
    { name: 'Categorías', icon: <BarChart2 size={20} />, id: 'categories', href: '/admin/categories' },
    { name: 'Usuarios', icon: <Users size={20} />, id: 'users', href: '/admin/users' },
    { name: 'Ajustes', icon: <Settings size={20} />, id: 'settings', href: '/admin/settings' },
    { name: 'Actividad', icon: <Activity size={20} />, id: 'activity', href: '/admin/activity' }
  ];

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-50 text-gray-800">
        {/* Mobile Overlay */}
        {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div 
        id="sidebar"
        className="fixed lg:relative bg-white shadow-lg z-30 h-full overflow-hidden"
        initial={false}
        animate={{ 
          width: sidebarOpen ? 256 : (window.innerWidth < 1024 ? 0 : 80),
          translateX: sidebarOpen || window.innerWidth >= 1024 ? 0 : '-100%'
        }}
        transition={{ duration: 0.2, ease: [0.2, 0.0, 0.0, 1.0] }}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center">
              <Compass size={24} className="text-purple-600 mr-2" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                WhereToGo
              </h1>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-lg hover:bg-gray-100 lg:block hidden"
          >
            <Menu size={20} />
          </button>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden block"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 mb-6">
          {sidebarOpen && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
              <p className="text-sm font-medium">Panel de Administración</p>
              <p className="text-xs text-gray-500 mt-1">Gestiona lugares, categorías y usuarios</p>
            </div>
          )}
        </div>

        <nav className="px-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center w-full p-3 space-x-3 rounded-lg transition-colors duration-100 ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
              >
                <div className={pathname === item.href ? "text-white" : "text-gray-600"}>
                  {item.icon}
                </div>
                {sidebarOpen && (
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            ))}
          </div>
          
          {sidebarOpen && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-xs uppercase text-gray-400 font-semibold px-3 mb-2">Categorías Populares</h3>
              <div className="space-y-1">
                <div className="flex items-center p-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-100">
                  <Utensils size={16} className="mr-3 text-purple-600" />
                  <span>Restaurantes</span>
                  <span className="ml-auto text-gray-400 text-xs">128</span>
                </div>
                <div className="flex items-center p-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-100">
                  <Coffee size={16} className="mr-3 text-purple-600" />
                  <span>Cafés</span>
                  <span className="ml-auto text-gray-400 text-xs">85</span>
                </div>
                <div className="flex items-center p-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-100">
                  <Map size={16} className="mr-3 text-purple-600" />
                  <span>Ver todo</span>
                </div>
              </div>
            </div>
          )}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                data-menu-button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                aria-label="Menu"
              >
                <Menu size={20} />
              </button>
              
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 ml-2 w-full max-w-[16rem] md:max-w-xs">
                <Search size={18} className="text-gray-500 min-w-[18px]" />
                <input 
                  type="text" 
                  placeholder="Buscar lugares..." 
                  className="bg-transparent border-0 outline-none ml-2 w-full"
                />
              </div>
              
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 md:hidden ml-1"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative" data-profile-area>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full object-cover" 
                      />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase() || <User size={16} />
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium">
                    {user?.name || 'Administrador'}
                  </span>
                  <ChevronDown size={16} className="hidden sm:block" />
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-100">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium">{user?.name || 'Administrador'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'admin@wheretogo.com'}</p>
                    </div>
                    <Link 
                      href="/admin/profile" 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center transition-colors duration-75"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={16} className="mr-2 text-gray-500" /> Mi Perfil
                    </Link>
                    <Link 
                      href="/admin/settings" 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center transition-colors duration-75"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={16} className="mr-2 text-gray-500" /> Preferencias
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-500 transition-colors duration-75"
                      >
                        <LogOut size={16} className="mr-2" /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Search Bar - Simplified Animation */}
          {searchOpen && (
            <div className="md:hidden border-t border-gray-100">
              <div className="p-3">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full">
                  <Search size={18} className="text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Buscar lugares..." 
                    className="bg-transparent border-0 outline-none ml-2 w-full"
                    autoFocus
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-gray-400">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
    </AdminRoute>
  );
}