'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, MapPin, Users, BarChart2, Settings, Menu, Search,
  Bell, User, LogOut, Coffee, Utensils, Beer, Building,
  TreeDeciduous, Film, Music, Volleyball, ShoppingBag, Calendar,
  Hotel, Waves, Plus, ChevronDown, X, Star
} from 'lucide-react';
import Link from 'next/link';

// Dashboard animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [profileOpen, setProfileOpen] = useState(false);

  // Mock data for dashboard statistics
  const stats = [
    { name: 'Total Lugares', value: '1,256', change: '+8%' },
    { name: 'Usuarios Activos', value: '34.5k', change: '+12%' },
    { name: 'Nuevas Reseñas', value: '843', change: '+5%' },
    { name: 'Categorías', value: '12', change: '0%' }
  ];

  // Categories with their icons and counts
  const categories = [
    { name: 'Restaurantes', icon: <Utensils size={18} />, count: 128 },
    { name: 'Cafeterías', icon: <Coffee size={18} />, count: 85 },
    { name: 'Bares', icon: <Beer size={18} />, count: 97 },
    { name: 'Museos', icon: <Building size={18} />, count: 42 },
    { name: 'Parques', icon: <TreeDeciduous size={18} />, count: 36 },
    { name: 'Cines', icon: <Film size={18} />, count: 18 },
    { name: 'Teatros', icon: <Music size={18} />, count: 24 },
    { name: 'Deportes', icon: <Volleyball size={18} />, count: 31 },
    { name: 'Compras', icon: <ShoppingBag size={18} />, count: 76 },
    { name: 'Eventos', icon: <Calendar size={18} />, count: 54 },
    { name: 'Hoteles', icon: <Hotel size={18} />, count: 63 },
    { name: 'Playas', icon: <Waves size={18} />, count: 29 }
  ];

  // Recent activity mock data
  const recentActivity = [
    { type: 'new_place', name: 'Café Delicioso', category: 'Cafeterías', time: 'hace 2 horas' },
    { type: 'updated', name: 'Museo Nacional', category: 'Museos', time: 'hace 5 horas' },
    { type: 'new_review', name: 'Playa Bonita', category: 'Playas', time: 'hace 6 horas' },
    { type: 'new_place', name: 'Estadio Principal', category: 'Deportes', time: 'hace 1 día' },
    { type: 'new_user', name: 'María Rodríguez', role: 'Usuario', time: 'hace 1 día' }
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
            {[
              { name: 'Vista General', icon: <Home size={20} />, id: 'overview' },
              { name: 'Lugares', icon: <MapPin size={20} />, id: 'places' },
              { name: 'Usuarios', icon: <Users size={20} />, id: 'users' },
              { name: 'Análisis', icon: <BarChart2 size={20} />, id: 'analytics' },
              { name: 'Ajustes', icon: <Settings size={20} />, id: 'settings' }
            ].map((item) => (
              <button
                key={item.id}
                className={`flex items-center w-full p-3 space-x-3 rounded-lg transition-all ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setActiveSection(item.id)}
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
              </button>
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
        
        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">Panel de Control</h1>
              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus size={18} className="mr-2" /> Agregar Nuevo Lugar
              </button>
            </div>
            
            {/* Stats Overview */}
            <motion.div 
              variants={slideIn}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <div className="flex items-end justify-between mt-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <span className={`text-sm ${
                      stat.change.startsWith('+') ? 'text-green-500' : 
                      stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Categories Management */}
              <motion.div 
                variants={slideIn}
                className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Categorías</h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">Ver Todo</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                          {category.icon}
                        </span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Recent Activity */}
              <motion.div 
                variants={slideIn}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold mb-6">Actividad Reciente</h2>
                <div className="space-y-5">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                        ${activity.type === 'new_place' ? 'bg-green-100 text-green-600' : 
                          activity.type === 'updated' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'new_review' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-purple-100 text-purple-600'
                        }`}
                      >
                        {activity.type === 'new_place' ? <Plus size={16} /> : 
                         activity.type === 'updated' ? <MapPin size={16} /> :
                         activity.type === 'new_review' ? <Star size={16} /> :
                         <User size={16} />
                        }
                      </div>
                      <div>
                        <p className="text-sm">
                          {activity.type === 'new_user' 
                            ? <span><strong>{activity.name}</strong> se unió como {activity.role}</span>
                            : <span><strong>{activity.name}</strong> en {activity.category}</span>
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button className="w-full mt-6 text-sm text-center text-indigo-600 hover:text-indigo-800">
                  Ver Toda la Actividad
                </button>
              </motion.div>
            </div>
            
            {/* Quick Actions */}
            <motion.div 
              variants={slideIn}
              className="mt-8 bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-6">Acciones Rápidas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Agregar Lugar', icon: <MapPin size={18} />, color: 'bg-blue-100 text-blue-600' },
                  { name: 'Gestionar Categorías', icon: <Menu size={18} />, color: 'bg-purple-100 text-purple-600' },
                  { name: 'Reportes de Usuarios', icon: <Users size={18} />, color: 'bg-yellow-100 text-yellow-600' },
                  { name: 'Ver Análisis', icon: <BarChart2 size={18} />, color: 'bg-green-100 text-green-600' },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center"
                  >
                    <span className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                      {action.icon}
                    </span>
                    <span className="text-sm font-medium">{action.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}