"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/admin/store/useUserStore";
import debounce from 'lodash.debounce';

import {
  Users,
  UserPlus,
  Search,
  ChevronDown,
  Edit,
  Trash2,
  ArrowUpDown,
  Mail,
  Calendar,
  Shield,
  AlertTriangle,
  UserCheck,
  Activity,
  LayoutList,
  User
} from "lucide-react";
import Link from "next/link";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function UserManagement() {
  const router = useRouter();
  const { users, isLoading, error, fetchUsers, deleteUser } = useUserStore();
  
  // State
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [usersPerPage, setUsersPerPage] = useState(10);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      setCurrentPage(1); // Reset to first page on search
    }, 300),
    []
  );

  // Handle search input changes with debounce
  useEffect(() => {
    debouncedSearch(searchInput);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchInput, debouncedSearch]);

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchQuery || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = !selectedRole || user.role === selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  // Memoized sorted users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortBy === 'name' || sortBy === 'email') {
        return sortDirection === 'asc' 
          ? a[sortBy].localeCompare(b[sortBy])
          : b[sortBy].localeCompare(a[sortBy]);
      }
      
      const dateA = new Date(a[sortBy]).getTime();
      const dateB = new Date(b[sortBy]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [filteredUsers, sortBy, sortDirection]);

  // Memoized paginated users
  const paginatedUsers = useMemo(() => {
    return sortedUsers.slice(
      (currentPage - 1) * usersPerPage, 
      currentPage * usersPerPage
    );
  }, [sortedUsers, currentPage, usersPerPage]);

  // Calculate pagination values
  const totalPages = useMemo(() => {
    return Math.ceil(sortedUsers.length / usersPerPage);
  }, [sortedUsers.length, usersPerPage]);

  // Calculate stats
  const stats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return {
      totalUsers: users.length,
      activeUsers: users.length, // Can be adjusted if we have active status
      newUsers: users.filter(user => {
        return new Date(user.createdAt) >= oneWeekAgo;
      }).length,
      suspendedUsers: 0, // Can be adjusted if we have suspended status
      admins: users.filter(u => u.role === 'ADMIN').length,
      regularUsers: users.filter(u => u.role !== 'ADMIN').length
    };
  }, [users]);

  // Animation config based on list size
  const animationConfig = useMemo(() => ({
    shouldAnimate: sortedUsers.length < 100,
    getDelay: (index) => sortedUsers.length > 50 ? 0 : Math.min(0.05, index * 0.01)
  }), [sortedUsers.length]);

  // Handle user delete confirmation
  const handleDeleteUser = useCallback(async () => {
    if (!selectedUserId) return;
    
    const result = await deleteUser(selectedUserId);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
    }
  }, [selectedUserId, deleteUser]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole]);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "Hoy";
    if (diffDays <= 2) return "Ayer";
    if (diffDays <= 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Get role badge styling
  const getRoleBadgeClass = useCallback((role) => {
    switch(role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }, []);

  // Get user initials for avatar
  const getUserInitials = useCallback((name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, []);

  // Table view for users
  const renderUsersTable = () => (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Usuario</span>
                  <button 
                    onClick={() => {
                      setSortBy('name');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                  >
                    <ArrowUpDown size={14} />
                  </button>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Fecha</span>
                  <button 
                    onClick={() => {
                      setSortBy('createdAt');
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    }}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                  >
                    <ArrowUpDown size={14} />
                  </button>
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {paginatedUsers.map((user, index) => (
              <motion.tr 
                key={user.id}
                initial={animationConfig.shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: animationConfig.getDelay(index) }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{getUserInitials(user.name)}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate max-w-[140px] md:max-w-xs">{user.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                    {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                  </span>
                </td>
                <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-1 justify-end">
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-md"
                      onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                      aria-label="Editar usuario"
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-md"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsDeleteModalOpen(true);
                      }}
                      aria-label="Eliminar usuario"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {paginatedUsers.length === 0 && !isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <User className="h-8 w-8 text-gray-400 mb-2" />
                    No se encontraron usuarios que coincidan con los filtros.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Grid view for users
  const renderUsersGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paginatedUsers.map((user, index) => (
        <motion.div
          key={user.id}
          initial={animationConfig.shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: animationConfig.getDelay(index) }}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col"
        >
          <div className="h-16 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
            <div className="absolute -bottom-5 left-4">
              <div className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">{getUserInitials(user.name)}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 pt-6 flex-1 flex flex-col">
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            </div>
            
            <div className="mt-3 flex items-center">
              <span className={`px-2 py-0.5 text-xs leading-5 font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(user.createdAt)}
              </span>
            </div>
            
            <div className="mt-auto pt-3 flex justify-end space-x-1">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-md"
                onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                aria-label="Editar usuario"
              >
                <Edit size={16} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-md"
                onClick={() => {
                  setSelectedUserId(user.id);
                  setIsDeleteModalOpen(true);
                }}
                aria-label="Eliminar usuario"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
      {paginatedUsers.length === 0 && !isLoading && (
        <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-400">
          <User className="h-10 w-10 text-gray-400 mb-2" />
          <p>No se encontraron usuarios que coincidan con los filtros.</p>
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <motion.div variants={slideIn} className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Administración de Usuarios
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Gestiona los usuarios registrados en tu plataforma
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <motion.button
            onClick={() => router.push('/admin/users/add')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Agregar Usuario
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={slideIn}
        className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { 
            icon: <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />, 
            label: "Total de Usuarios", 
            value: stats.totalUsers,
            bgColor: "bg-indigo-100 dark:bg-indigo-900/30"
          },
          { 
            icon: <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />, 
            label: "Administradores", 
            value: stats.admins,
            bgColor: "bg-green-100 dark:bg-green-900/30"
          },
          { 
            icon: <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />, 
            label: "Nuevos (7 días)", 
            value: stats.newUsers,
            bgColor: "bg-amber-100 dark:bg-amber-900/30"
          },
          { 
            icon: <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />, 
            label: "Usuarios Normales", 
            value: stats.regularUsers,
            bgColor: "bg-blue-100 dark:bg-blue-900/30"
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 flex items-center">
              <div className={`flex-shrink-0 ${stat.bgColor} rounded-md p-2.5`}>
                {stat.icon}
              </div>
              <div className="ml-3 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        variants={slideIn}
        className="mt-6 grid gap-3 md:flex md:items-center md:space-x-3"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm bg-transparent"
            >
              <option value="">Todos los Roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuario</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
            <button 
              onClick={() => {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg"
              aria-label={sortDirection === 'asc' ? 'Ordenar descendente' : 'Ordenar ascendente'} 
            >
              <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'text-indigo-500' : 'text-gray-500'} />
            </button>
            
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-2 pr-7 py-2 text-sm border-0 focus:ring-0 bg-transparent"
              >
                <option value="createdAt">Por fecha</option>
                <option value="name">Por nombre</option>
                <option value="email">Por email</option>
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
            </div>
          </div>
          
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 
                'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 
                'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
              aria-label="Ver como tabla"
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 
                'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 
                'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
              aria-label="Ver como grid"
            >
              <Users size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* User List */}
      <motion.div
        variants={slideIn}
        className="mt-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4 sm:p-6"
      >
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-10 h-10 border-3 border-t-indigo-600 border-indigo-200 dark:border-t-indigo-400 dark:border-gray-700 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-60 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-lg font-medium text-gray-800 dark:text-white mb-2">Error al cargar usuarios</p>
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Reintentar
              </motion.button>
            </div>
          </div>
        ) : viewMode === 'table' ? renderUsersTable() : renderUsersGrid()}
      </motion.div>

      {/* Pagination */}
      {!isLoading && !error && sortedUsers.length > 0 && (
        <motion.div 
          variants={slideIn}
          className="mt-6 flex items-center justify-between flex-wrap gap-3"
        >
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Mostrando {(currentPage - 1) * usersPerPage + 1} a{" "}
            {Math.min(currentPage * usersPerPage, sortedUsers.length)} de{" "}
            <span className="font-medium">{sortedUsers.length}</span> usuarios
          </div>
          <div className="flex space-x-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === 1 
                  ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Anterior
            </motion.button>
            
            {/* Page numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = currentPage <= 3 
                  ? i + 1 
                  : currentPage >= totalPages - 2 
                    ? totalPages - 4 + i 
                    : currentPage - 2 + i;
                
                if (pageNum <= 0 || pageNum > totalPages) return null;
                
                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center border rounded-md text-sm ${
                      currentPage === pageNum 
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-600 dark:text-indigo-300' 
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages || totalPages === 0
                  ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Siguiente
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 dark:bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-100/80 text-red-600 ring-4 ring-red-600/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-1">
                  Eliminar Usuario
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ¿Estás seguro de que quieres eliminar este usuario? Esta acción
                  no se puede deshacer y todos sus datos asociados serán eliminados.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDeleteUser}
                className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Eliminar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
       </motion.div>
  );
}