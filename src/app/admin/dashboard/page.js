"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Menu,
  User,
  Coffee,
  Utensils,
  Beer,
  Building,
  TreeDeciduous,
  Film,
  Music,
  Volleyball,
  ShoppingBag,
  Calendar,
  Hotel,
  Waves,
  Plus,
  Star,
  TrendingUp,
  Activity,
  // Include all potential icons from your categories
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/admin/store/useUserStore";
import useAdminStore from "@/app/admin/store/adminStore";
import useCategoriesStore from "@/app/admin/store/useCategoryStore";

// Dashboard animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { users, isLoading, error, fetchUsers, deleteUser } = useUserStore();
  const {
    places: { data: places },
    fetchPlaces,
  } = useAdminStore();
  const { 
    categories,
    loading: categoriesLoading, 
    error: categoriesError, 
    fetchCategories
  } = useCategoriesStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  // Calculate stats
  const stats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return {
      totalUsers: users.length,
      totalPlaces: places.length,
    };
  }, [users, places]);

  // Icon mapping function to convert string icon names to components
  const getIconComponent = (iconName) => {
    const iconMap = {
      "Utensils": <Utensils size={18} />,
      "Coffee": <Coffee size={18} />,
      "Beer": <Beer size={18} />,
      "Building": <Building size={18} />,
      "TreeDeciduous": <TreeDeciduous size={18} />,
      "Film": <Film size={18} />,
      "Music": <Music size={18} />,
      "Volleyball": <Volleyball size={18} />,
      "ShoppingBag": <ShoppingBag size={18} />,
      "Calendar": <Calendar size={18} />,
      "Hotel": <Hotel size={18} />,
      "Waves": <Waves size={18} />,
      "MapPin": <MapPin size={18} />,
      "Users": <Users size={18} />,
      "Menu": <Menu size={18} />,
      "Plus": <Plus size={18} />,
      "Star": <Star size={18} />,
      "TrendingUp": <TrendingUp size={18} />,
      // Add more mappings as needed
    };
    return iconMap[iconName] || <MapPin size={18} />; // Default icon
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchPlaces();
    fetchCategories(); // Add this to load categories
  }, [fetchUsers, fetchPlaces, fetchCategories]);

  // Recent activity mock data
  const recentActivity = [
    {
      type: "new_place",
      name: "Café Delicioso",
      category: "Cafeterías",
      time: "hace 2 horas",
    },
    {
      type: "updated",
      name: "Museo Nacional",
      category: "Museos",
      time: "hace 5 horas",
    },
    {
      type: "new_review",
      name: "Playa Bonita",
      category: "Playas",
      time: "hace 6 horas",
    },
    {
      type: "new_place",
      name: "Estadio Principal",
      category: "Deportes",
      time: "hace 1 día",
    },
    {
      type: "new_user",
      name: "María Rodríguez",
      role: "Usuario",
      time: "hace 1 día",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">Panel de Control</h1>
              <button
                onClick={() => router.push("/admin/places/edit/add")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus size={18} className="mr-2" /> Agregar Nuevo Lugar
              </button>
            </div>

            {/* Stats Overview */}
            <motion.div
              variants={slideIn}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  icon: <Users size={24} />,
                  label: "Total de Usuarios",
                  value: stats.totalUsers,
                  change: "+12%",
                },
                {
                  icon: <MapPin size={24} />,
                  label: "Lugares Registrados",
                  value: stats.totalPlaces,
                  change: "+8%",
                },
                {
                  icon: <Star size={24} />,
                  label: "Valoracion Media",
                  value: "4.8",
                  change: "+0.2%",
                },
                {
                  icon: <TrendingUp size={24} />,
                  label: "Crecimiento",
                  value: "23%",
                  change: "+5%",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      {stat.icon}
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-sm text-gray-500 mb-1">{stat.label}</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
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
                  <Link 
                    href="/admin/categories" 
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Ver Todo
                  </Link>
                </div>
                
                {categoriesLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <span className="animate-pulse">Cargando categorías...</span>
                  </div>
                ) : categoriesError ? (
                  <div className="text-red-500 text-center py-4">
                    Error al cargar categorías: {categoriesError}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.slice(0, 12).map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 flex items-center justify-between cursor-pointer"
                        style={category.color ? { backgroundColor: `${category.color}20` } : {}}
                        onClick={() => router.push(`/admin/categories?id=${category.id}`)}
                      >
                        <div className="flex items-center">
                          <span 
                            className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3"
                            style={category.color ? { 
                              backgroundColor: `${category.color}30`, 
                              color: category.color 
                            } : {}}
                          >
                            {getIconComponent(category.icon)}
                          </span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {category._count?.places || category.count || 0}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {!categoriesLoading && !categoriesError && categories.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">No hay categorías disponibles</p>
                    <button 
                      onClick={() => router.push('/admin/categories')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                      Crear categoría
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                variants={slideIn}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold mb-6">
                  Actividad Reciente
                </h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                        ${
                          activity.type === "new_place"
                            ? "bg-green-100 text-green-600"
                            : activity.type === "updated"
                            ? "bg-blue-100 text-blue-600"
                            : activity.type === "new_review"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {activity.type === "new_place" ? (
                          <Plus size={16} />
                        ) : activity.type === "updated" ? (
                          <MapPin size={16} />
                        ) : activity.type === "new_review" ? (
                          <Star size={16} />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm">
                          {activity.type === "new_user" ? (
                            <span>
                              <strong>{activity.name}</strong> se unió como{" "}
                              {activity.role}
                            </span>
                          ) : (
                            <span>
                              <strong>{activity.name}</strong> en{" "}
                              {activity.category}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
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
                  {
                    name: "Agregar Lugar",
                    icon: <MapPin size={18} />,
                    color: "bg-blue-100 text-blue-600",
                    href: "/admin/places/edit/add",
                  },
                  {
                    name: "Gestionar Categorías",
                    icon: <Menu size={18} />,
                    color: "bg-purple-100 text-purple-600",
                    href: "/admin/categories",
                  },
                  {
                    name: "Agregar Usuario",
                    icon: <Users size={18} />,
                    color: "bg-yellow-100 text-yellow-600",
                    href: "/admin/users/add",
                  },
                  {
                    name: "Ver Actividad",
                    icon: <Activity size={18} />,
                    color: "bg-green-100 text-green-600",
                    href: "/admin/analytics",
                  },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg flex flex-col items-center justify-center"
                    onClick={() => action.href && router.push(action.href)}
                  >
                    <span
                      className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-2`}
                    >
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