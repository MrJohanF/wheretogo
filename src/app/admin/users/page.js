// app/admin/users/page.jsx
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  User,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Clock,
  UserX,
  PlusCircle,
  Download,
  SortAsc,
  SortDesc,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserManagement() {
  const router = useRouter();
  const { users, isLoading, error, fetchUsers, deleteUser } = useUserStore();
  const prefersReducedMotion = useReducedMotion();
  
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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [showActionFeedback, setShowActionFeedback] = useState(false);
  const [actionFeedback, setActionFeedback] = useState({ type: "", message: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Refs
  const filterPanelRef = useRef(null);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const slideIn = {
    hidden: { x: prefersReducedMotion ? 0 : -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const scaleIn = {
    hidden: { scale: prefersReducedMotion ? 1 : 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 300, damping: 30 } 
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Close filters panel on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target)) {
        setIsFiltersOpen(false);
      }
    }
    
    if (isFiltersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFiltersOpen]);

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
      activeUsers: users.filter(user => !user.suspended).length,
      newUsers: users.filter(user => {
        return new Date(user.createdAt) >= oneWeekAgo;
      }).length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      regularUsers: users.filter(u => u.role !== 'ADMIN').length
    };
  }, [users]);

  // Animation config based on list size
  const animationConfig = useMemo(() => ({
    shouldAnimate: !prefersReducedMotion && sortedUsers.length < 100,
    getDelay: (index) => sortedUsers.length > 50 ? 0 : Math.min(0.05, index * 0.01)
  }), [sortedUsers.length, prefersReducedMotion]);

  // Handle user delete confirmation
  const handleDeleteUser = useCallback(async () => {
    if (!selectedUserId) return;
    
    setDeleteInProgress(true);
    
    try {
      const result = await deleteUser(selectedUserId);
      
      if (result.success) {
        setDeleteSuccess(true);
        
        setTimeout(() => {
          setIsDeleteModalOpen(false);
          setSelectedUserId(null);
          setDeleteInProgress(false);
          setDeleteSuccess(false);
          
          // Show success message
          setActionFeedback({
            type: "success",
            message: "Usuario eliminado correctamente"
          });
          setShowActionFeedback(true);
          setTimeout(() => setShowActionFeedback(false), 3000);
        }, 1000);
      } else {
        throw new Error(result.error || "No se pudo eliminar el usuario");
      }
    } catch (error) {
      setDeleteInProgress(false);
      setActionFeedback({
        type: "error",
        message: error.message || "Error al eliminar el usuario"
      });
      setShowActionFeedback(true);
      setTimeout(() => setShowActionFeedback(false), 3000);
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
      case 'ADMIN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'MODERATOR': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
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

  // Handle sort toggle
  const handleSortToggle = useCallback(() => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  // Toggle filters panel
  const toggleFilters = useCallback(() => {
    setIsFiltersOpen(prev => !prev);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedRole("");
    setSelectedStatus("");
    setSortBy("createdAt");
    setSortDirection("desc");
    setCurrentPage(1);
  }, []);

  // Handle per page change
  const handlePerPageChange = useCallback((e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  // Table view for users
  const renderUsersTable = () => (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/80">
            <tr>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Usuario</span>
                  <motion.button 
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                    onClick={() => {
                      setSortBy('name');
                      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                    }}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                  >
                    <ArrowUpDown size={14} />
                  </motion.button>
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Rol</span>
                  <motion.button 
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                    onClick={() => {
                      setSortBy('role');
                      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                    }}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                  >
                    <ArrowUpDown size={14} />
                  </motion.button>
                </div>
              </th>
              <th scope="col" className="hidden md:table-cell px-4 py-3.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Fecha</span>
                  <motion.button 
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
                    onClick={() => {
                      setSortBy('createdAt');
                      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                    }}
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                  >
                    <ArrowUpDown size={14} />
                  </motion.button>
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedUsers.map((user, index) => (
              <motion.tr 
                key={user.id}
                initial={animationConfig.shouldAnimate ? { opacity: 0, y: 10 } : { opacity: 1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: animationConfig.getDelay(index), 
                  duration: 0.2 
                }}
                className="hover:bg-gray-50 dark:hover:bg-gray-750"
                onClick={() => setSelectedUser(user.id === selectedUser ? null : user.id)}
              >
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-sm">
                        <span className="text-sm font-medium text-white">{getUserInitials(user.name)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
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
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                    {user.role === 'ADMIN' ? (
                      <span className="flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Administrador
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        Usuario
                      </span>
                    )}
                  </span>
                </td>
                <td className="hidden md:table-cell px-4 py-3.5 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2 justify-end">
                    <motion.button 
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }} 
                      whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                      className="p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/users/edit/${user.id}`);
                      }}
                      aria-label="Editar usuario"
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }} 
                      whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                      className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
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
          </tbody>
        </table>
      </div>
      
      {paginatedUsers.length === 0 && !isLoading && (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
          <div className="flex flex-col items-center">
            <User className="h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-1">No se encontraron usuarios</h3>
            <p className="max-w-sm text-gray-500 dark:text-gray-400 mb-5">
              No hay usuarios que coincidan con los criterios de búsqueda actuales.
            </p>
            <motion.button
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              onClick={clearFilters}
              className="text-purple-600 dark:text-purple-400 font-medium flex items-center hover:underline"
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Limpiar filtros
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

// Grid view for users
const renderUsersGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {/* Add User Card - Now with consistent sizing */}
    <motion.div
      initial={animationConfig.shouldAnimate ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border-2 border-dashed border-purple-200 dark:border-purple-800/40 flex flex-col h-full"
      onClick={() => router.push('/admin/users/add')}
    >
      <div className="h-20 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,25 C75,50 50,25 0,60 L0,0 Z" fill="#8b5cf6"></path>
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-14 w-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <UserPlus className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
      
      <div className="p-4 pt-10 flex-1 flex flex-col items-center justify-center text-center">
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Agregar Usuario</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Crear una nueva cuenta de usuario en la plataforma
        </p>
      </div>
      
      <div className="mt-auto pt-3 pb-4 px-4 border-t border-gray-100 dark:border-gray-700 flex justify-center">
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-medium">
          <PlusCircle className="h-3.5 w-3.5 mr-1" />
          Nuevo Usuario
        </span>
      </div>
    </motion.div>

    {/* User Cards - Fixed to avoid trimming and maintain consistent height */}
    {paginatedUsers.map((user, index) => (
      <motion.div
        key={user.id}
        initial={animationConfig.shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: animationConfig.getDelay(index),
          type: 'spring',
          stiffness: 200,
          damping: 20
        }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full"
        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <div className="h-20 bg-gradient-to-r from-purple-500 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,25 C75,50 50,25 0,60 L0,0 Z" fill="white"></path>
            </svg>
          </div>
          {/* Avatar positioned to avoid trimming */}
          <div className="absolute top-1/2 left-4 transform translate-y-1/2">
            <div className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-md">
              <span className="text-sm font-medium text-white">{getUserInitials(user.name)}</span>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full \${getRoleBadgeClass(user.role)}`}>
              {user.role === 'ADMIN' ? (
                <span className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </span>
              ) : (
                <span className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  Usuario
                </span>
              )}
            </span>
          </div>
        </div>
        
        <div className="p-4 pt-8 flex-1 flex flex-col">
          <div>
            <h3 className="text-base font-medium text-gray-900 dark:text-white">{user.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1.5">
              <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </p>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>Registrado: {formatDate(user.createdAt)}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-3 px-4 pb-4 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-2">
          <motion.button 
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }} 
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            className="p-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 rounded-md"
            onClick={() => router.push(`/admin/users/edit/\${user.id}`)}
            aria-label="Editar usuario"
          >
            <Edit size={16} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }} 
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-md"
            onClick={() => {
              setSelectedUserId(user.id);
              setIsDeleteModalOpen(true);
            }}
            aria-label="Eliminar usuario"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </motion.div>
    ))}
    
    {paginatedUsers.length === 0 && !isLoading && (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
        <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-1">No se encontraron usuarios</h3>
        <p className="text-center max-w-sm mb-4">
          No hay usuarios que coincidan con los criterios de búsqueda actuales.
        </p>
        <motion.button
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
          whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
          onClick={clearFilters}
          className="text-purple-600 dark:text-purple-400 font-medium flex items-center hover:underline"
        >
          <RefreshCcw className="h-4 w-4 mr-1" />
          Limpiar filtros
        </motion.button>
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
      {/* Floating Action Feedback */}
      <AnimatePresence>
        {showActionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50 ${
              actionFeedback.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/50' 
                : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/50'
            }`}
          >
            {actionFeedback.type === 'success' ? (
              <UserCheck className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span className="font-medium text-sm">{actionFeedback.message}</span>
            <button 
              onClick={() => setShowActionFeedback(false)}
              className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div 
          variants={slideIn} 
          className="sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Users className="mr-3 h-6 w-6 text-purple-600 dark:text-purple-400" />
              Administración de Usuarios
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Gestiona los usuarios registrados en la plataforma WhereToGo
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <motion.button
              onClick={() => router.push('/admin/users/add')}
              whileHover={{ scale: prefersReducedMotion ? 1 : 1.02, boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)' }}
              whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
              icon: <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />, 
              label: "Total de Usuarios", 
              value: stats.totalUsers,
              bgColor: "bg-purple-100 dark:bg-purple-900/30",
              borderColor: "border-purple-200 dark:border-purple-900/50"
            },
            { 
              icon: <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />, 
              label: "Administradores", 
              value: stats.admins,
              bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
              borderColor: "border-indigo-200 dark:border-indigo-900/50"
            },
            { 
              icon: <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />, 
              label: "Nuevos (7 días)", 
              value: stats.newUsers,
              bgColor: "bg-green-100 dark:bg-green-900/30",
              borderColor: "border-green-200 dark:border-green-900/50"
            },
            { 
              icon: <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />, 
              label: "Usuarios Normales", 
              value: stats.regularUsers,
              bgColor: "bg-blue-100 dark:bg-blue-900/30",
              borderColor: "border-blue-200 dark:border-blue-900/50"
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: prefersReducedMotion ? 0 : -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border ${stat.borderColor}`}
            >
              <div className="p-4 flex items-center">
                <div className={`flex-shrink-0 ${stat.bgColor} rounded-lg p-2.5`}>
                  {stat.icon}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">
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
          className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
              {searchInput && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => {
                    setSearchInput("");
                    setSearchQuery("");
                  }}
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Role Filter */}
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white bg-transparent"
                >
                  <option value="">Todos los Roles</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="USER">Usuario</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
              </div>
              
              {/* Sort Controls */}
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={handleSortToggle}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={sortDirection === 'asc' ? 'Ordenar descendente' : 'Ordenar ascendente'}
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc size={18} className="text-purple-600 dark:text-purple-400" />
                  ) : (
                    <SortDesc size={18} className="text-purple-600 dark:text-purple-400" />
                  )}
                </button>
                
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 text-sm border-0 focus:ring-0 bg-transparent dark:text-white"
                  >
                    <option value="createdAt">Por fecha</option>
                    <option value="name">Por nombre</option>
                    <option value="email">Por email</option>
                    <option value="role">Por rol</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2.5 ${viewMode === 'table' ? 
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 
                    'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-650'}`}
                  aria-label="Ver como tabla"
                >
                  <LayoutList size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 
                    'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-650'}`}
                  aria-label="Ver como grid"
                >
                  <Users size={18} />
                </button>
              </div>
              
              {/* Per Page Control - Mobile Hidden */}
              <div className="relative hidden md:block">
                <select
                  value={usersPerPage}
                  onChange={handlePerPageChange}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white text-sm bg-transparent"
                >
                  <option value={5}>5 por página</option>
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Active Filters - Only show if filters are applied */}
          {(selectedRole || searchQuery) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Filtros activos:</span>
              
              {selectedRole && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
                  Rol: {selectedRole === 'ADMIN' ? 'Administrador' : 'Usuario'}
                  <button onClick={() => setSelectedRole("")} className="ml-1 hover:text-purple-900 dark:hover:text-purple-200">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  Búsqueda: "{searchQuery}"
                  <button onClick={() => {
                    setSearchInput("");
                    setSearchQuery("");
                  }} className="ml-1 hover:text-blue-900 dark:hover:text-blue-200">
                    <X size={14} />
                  </button>
                </span>
              )}
              
              <button 
                onClick={clearFilters}
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium ml-auto"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </motion.div>

        {/* User List Container */}
        <motion.div
          variants={scaleIn}
          className="mt-6 rounded-xl"
        >
          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-purple-200 dark:border-t-purple-400 dark:border-gray-700 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Cargando usuarios</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Espere mientras se recuperan los datos...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 flex flex-col items-center justify-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Error al cargar usuarios</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4 max-w-md">
                {error}
              </p>
              <motion.button
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                onClick={fetchUsers}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-sm"
              >
                <span className="flex items-center">
                  <RefreshCcw size={16} className="mr-2" />
                  Reintentar
                </span>
              </motion.button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
                  <UserCheck className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  {filteredUsers.length} {filteredUsers.length === 1 ? 'Usuario' : 'Usuarios'}
                </h2>
                <div className="flex space-x-2">
                  <motion.button 
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg"
                  >
                    <Download size={18} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                    whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                    onClick={() => fetchUsers()}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg"
                  >
                    <RefreshCcw size={18} />
                  </motion.button>
                </div>
              </div>
              
              <div className={viewMode === 'table' ? '' : 'p-4'}>
                {viewMode === 'table' ? renderUsersTable() : renderUsersGrid()}
              </div>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {!isLoading && !error && sortedUsers.length > 0 && (
          <motion.div 
            variants={slideIn}
            className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center justify-between flex-wrap gap-3"
          >
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> a{" "}
              <span className="font-medium">{Math.min(currentPage * usersPerPage, sortedUsers.length)}</span> de{" "}
              <span className="font-medium">{sortedUsers.length}</span> usuarios
            </div>
            <div className="flex items-center space-x-1">
              <motion.button
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`flex items-center px-3 py-1.5 border rounded-lg text-sm font-medium ${
                  currentPage === 1 
                    ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
                aria-label="Página anterior"
              >
                <ChevronLeft size={18} className="mr-1" />
                Anterior
              </motion.button>
              
              {/* Page numbers */}
              <div className="hidden sm:flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  
                  // Calculate page numbers to show depending on current page position
                  if (totalPages <= 5) {
                    // If 5 pages or less, show all pages
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // If current page is near the beginning
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // If current page is near the end
                    pageNum = totalPages - 4 + i;
                  } else {
                    // If current page is in the middle
                    pageNum = currentPage - 2 + i;
                  }
                  
                  if (pageNum <= 0 || pageNum > totalPages) return null;
                  
                  return (
                    <motion.button
                      key={pageNum}
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                      whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`flex items-center justify-center w-9 h-9 border rounded-lg text-sm ${
                        currentPage === pageNum 
                          ? 'bg-purple-600 border-purple-600 text-white dark:bg-purple-700 dark:border-purple-700' 
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                      }`}
                      aria-label={`Ir a página ${pageNum}`}
                      aria-current={currentPage === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>
              
              {/* Current page indicator for small screens */}
              <div className="sm:hidden flex items-center">
                <span className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300">
                  Página {currentPage} de {totalPages}
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`flex items-center px-3 py-1.5 border rounded-lg text-sm font-medium ${
                  currentPage === totalPages || totalPages === 0
                    ? 'border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
                }`}
                aria-label="Página siguiente"
              >
                Siguiente
                <ChevronRight size={18} className="ml-1" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 dark:bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700"
            >
              {deleteInProgress ? (
                <div className="flex flex-col items-center justify-center py-6">
                  {deleteSuccess ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20, 
                          delay: 0.1
                        }}
                        className="bg-green-100 dark:bg-green-800/30 rounded-full p-3 inline-flex text-green-600 dark:text-green-400 mb-3"
                      >
                        <UserCheck size={24} />
                      </motion.div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        Usuario Eliminado Correctamente
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        El usuario ha sido eliminado de la plataforma.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="relative w-16 h-16 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-t-red-500 border-red-100 dark:border-t-red-400 dark:border-red-900/30 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <UserX className="h-6 w-6 text-red-500 dark:text-red-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        Eliminando Usuario
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Espere mientras se elimina el usuario...
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-100/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 ring-4 ring-red-600/20 dark:ring-red-800/20">
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
                      <div className="mt-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg p-3">
                        <div className="text-sm text-red-800 dark:text-red-300">
                          <p className="font-medium">Esta acción eliminará:</p>
                          <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                            <li>Perfil de usuario y datos personales</li>
                            <li>Historial de actividad en la plataforma</li>
                            <li>Comentarios y valoraciones</li>
                            <li>Contenido creado por este usuario</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                      whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                      whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                      type="button"
                      onClick={handleDeleteUser}
                      className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Sí, Eliminar Usuario
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}