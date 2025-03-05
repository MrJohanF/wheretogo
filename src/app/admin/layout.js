'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Menu, 
  Home, 
  MapPin, 
  Users, 
  BarChart2, 
  Settings, 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Vista General', icon: <Home size={20} />, id: 'overview', href: '/admin/dashboard' },
    { name: 'Lugares', icon: <MapPin size={20} />, id: 'places', href: '/admin/places' },
    { name: 'Categorías', icon: <BarChart2 size={20} />, id: 'categories', href: '/admin/categories' },
    { name: 'Usuarios', icon: <Users size={20} />, id: 'users', href: '/admin/users' },
    { name: 'Ajustes', icon: <Settings size={20} />, id: 'settings', href: '/admin/settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <motion.div 
        className={`bg-white shadow-lg ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 overflow-hidden`}
        animate={{ width: sidebarOpen ? 256 : 80 }}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && (
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
            >
              WhereToGo
            </motion.h1>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center w-full p-3 space-x-3 rounded-lg transition-all ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {sidebarOpen && (
                  <motion.span 
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className={`${sidebarOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
              <Search size={18} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="bg-transparent border-0 outline-none ml-2 w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                    <User size={16} />
                  </div>
                  <span>Admin</span>
                  <ChevronDown size={16} />
                </button>
                
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20"
                  >
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                      <User size={16} className="mr-2" /> Perfil
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Settings size={16} className="mr-2" /> Ajustes
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-500">
                      <LogOut size={16} className="mr-2" /> Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}