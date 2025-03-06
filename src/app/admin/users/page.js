"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  Users,
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  X,
  ArrowUpDown,
  Mail,
  Calendar,
  Shield,
  AlertTriangle,
  UserCheck,
  Activity,
  Clock,
  LayoutList
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
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    suspendedUsers: 0,
  });

  const router = useRouter();

  // User roles available
  const roles = [
    { value: "", label: "Todos los Roles" },
    { value: "admin", label: "Administrador" },
    { value: "editor", label: "Editor" },
    { value: "user", label: "Usuario" },
  ];

  // User statuses
  const statuses = [
    { value: "", label: "Todos los Estados" },
    { value: "active", label: "Activo" },
    { value: "pending", label: "Pendiente" },
    { value: "suspended", label: "Suspendido" },
  ];

  useEffect(() => {
    // Fetch users from API endpoint
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // This would be an actual API call in your implementation
        // const response = await fetch('/api/users?page=\${currentPage}&limit=10&sort=\${sortBy}&direction=\${sortDirection}');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockUsers = generateMockUsers(50);
        
        // Filter and sort the mock data on the client side (normally done server-side)
        const filtered = mockUsers.filter(user => {
          const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               user.email.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRole = selectedRole ? user.role === selectedRole : true;
          const matchesStatus = selectedStatus ? user.status === selectedStatus : true;
          
          return matchesSearch && matchesRole && matchesStatus;
        });
        
        // Calculate stats
        setStats({
          totalUsers: mockUsers.length,
          activeUsers: mockUsers.filter(u => u.status === 'active').length,
          newUsers: mockUsers.filter(u => {
            const userDate = new Date(u.created_at);
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return userDate >= lastWeek;
          }).length,
          suspendedUsers: mockUsers.filter(u => u.status === 'suspended').length,
        });
        
        setUsers(filtered.slice(0, 10)); // Only show 10 per page
        setTotalPages(Math.ceil(filtered.length / 10));
        
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, selectedRole, selectedStatus, sortBy, sortDirection, currentPage]);

  // Mock user data generator
  const generateMockUsers = (count) => {
    const roles = ["admin", "editor", "user"];
    const statuses = ["active", "pending", "suspended"];
    
    return Array.from({ length: count }, (_, i) => {
      const id = i + 1;
      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const created_at = new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString();
      
      return {
        id,
        name: `Usuario ${id}`,
        email: `usuario${id}@ejemplo.com`,
        avatar: `https://i.pravatar.cc/150?u=${id}`,
        role,
        status,
        created_at,
        last_login: status === 'active' ? new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString() : null,
        saved_places: Math.floor(Math.random() * 20),
        reviews: Math.floor(Math.random() * 15),
      };
    });
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    
    try {
      // This would be an actual API call in your implementation
      // await fetch(`/api/users/\${selectedUserId}`, { method: 'DELETE' });
      
      // Update local state
      setUsers(users.filter(user => user.id !== selectedUserId));
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1,
        activeUsers: users.find(u => u.id === selectedUserId)?.status === 'active' 
          ? prev.activeUsers - 1 
          : prev.activeUsers,
        suspendedUsers: users.find(u => u.id === selectedUserId)?.status === 'suspended'
          ? prev.suspendedUsers - 1
          : prev.suspendedUsers
      }));
      
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      // This would be an actual API call in your implementation
      // const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      // await fetch(`/api/users/\${userId}/status`, { 
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      // Update local state
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      if (newStatus === 'active') {
        setStats(prev => ({
          ...prev,
          activeUsers: prev.activeUsers + 1,
          suspendedUsers: prev.suspendedUsers - 1
        }));
      } else {
        setStats(prev => ({
          ...prev,
          activeUsers: prev.activeUsers - 1,
          suspendedUsers: prev.suspendedUsers + 1
        }));
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    
    if (diffDays <= 1) {
      return "Hoy";
    } else if (diffDays <= 2) {
      return "Ayer";
    } else if (diffDays <= 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', options);
    }
  };

  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Get role badge styling
  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Table view for users
  const renderUsersTable = () => (
    <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Usuario
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Rol
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Fecha de Registro
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Último Acceso
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {users.map((user, index) => (
            <motion.tr 
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={user.avatar} 
                      alt={user.name} 
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                  {user.role === 'admin' ? 'Administrador' : 
                   user.role === 'editor' ? 'Editor' : 'Usuario'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                  {user.status === 'active' ? 'Activo' : 
                   user.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(user.created_at)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {user.last_login ? formatDate(user.last_login) : "Nunca"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2 justify-end">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    onClick={() => {/* View details or profile */}}
                  >
                    <Users size={18} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => {/* Edit user */}}
                  >
                    <Edit size={18} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    className={user.status === 'active' ? 
                      "text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300" :
                      "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    }
                    onClick={() => handleToggleUserStatus(user.id, user.status)}
                  >
                    {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => {
                      setSelectedUserId(user.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </td>
            </motion.tr>
          ))}
          {users.length === 0 && !isLoading && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                No se encontraron usuarios que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Grid view for users
  const renderUsersGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="relative">
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
              <img 
                className="h-20 w-20 rounded-full border-4 border-white dark:border-gray-800 object-cover" 
                src={user.avatar} 
                alt={user.name} 
              />
            </div>
          </div>
          
          <div className="pt-12 pb-4 px-4">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <Mail className="h-3.5 w-3.5 mr-1" />
                {user.email}
              </p>
            </div>
            
            <div className="mt-4 flex justify-center space-x-2">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                {user.role === 'admin' ? 'Administrador' : 
                 user.role === 'editor' ? 'Editor' : 'Usuario'}
              </span>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                {user.status === 'active' ? 'Activo' : 
                 user.status === 'pending' ? 'Pendiente' : 'Suspendido'}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
              <div className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Registrado</span>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(user.created_at)}</p>
              </div>
              <div className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Último acceso</span>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.last_login ? formatDate(user.last_login) : "Nunca"}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center space-x-2">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full"
                onClick={() => {/* View details or profile */}}
              >
                <Users size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                onClick={() => {/* Edit user */}}
              >
                <Edit size={18} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${user.status === 'active' ? 
                  "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20" :
                  "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                }`}
                onClick={() => handleToggleUserStatus(user.id, user.status)}
              >
                {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                onClick={() => {
                  setSelectedUserId(user.id);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
      {users.length === 0 && !isLoading && (
        <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
          No se encontraron usuarios que coincidan con los filtros.
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
        className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-md p-3">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total de Usuarios
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stats.totalUsers.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-md p-3">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Usuarios Activos
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stats.activeUsers.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/30 rounded-md p-3">
                <Activity className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Registros Nuevos (7 días)
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stats.newUsers.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 rounded-md p-3">
                <Ban className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Usuarios Suspendidos
                  </dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {stats.suspendedUsers.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        variants={slideIn}
        className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -mt-2 h-4 w-4 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -mt-2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
            className="flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </motion.button>

          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="created_at">Fecha de Registro</option>
              <option value="name">Nombre</option>
              <option value="last_login">Último Acceso</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -mt-2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 ${viewMode === 'table' ? 
                'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 
                'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
            >
              <LayoutList className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 
                'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 
                'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
            >
              <Users className="h-5 w-5" />
            </motion.button>
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
              <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg font-medium">Cargando usuarios...</p>
            </div>
          </div>
        ) : viewMode === 'table' ? renderUsersTable() : renderUsersGrid()}
      </motion.div>

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <motion.div 
          variants={slideIn}
          className="mt-6 flex items-center justify-between"
        >
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Mostrando {(currentPage - 1) * 10 + 1} a{" "}
            {Math.min(currentPage * 10, users.length)} de{" "}
            <span className="font-medium">{stats.totalUsers}</span> usuarios
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${
                currentPage === 1 
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Anterior
            </motion.button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 2 ? i + 1 : 
                              currentPage >= totalPages - 1 ? totalPages - 2 + i : 
                              currentPage - 1 + i;
              
              if (pageNum <= 0 || pageNum > totalPages) return null;
              
              return (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border ${
                    currentPage === pageNum 
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-600 dark:text-indigo-300' 
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } rounded-md text-sm`}
                >
                  {pageNum}
                </motion.button>
              );
            })}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${
                currentPage === totalPages 
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100/80 text-red-600 ring-4 ring-red-600/20 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="stroke-[2.5]" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Eliminar Usuario
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ¿Estás seguro de que quieres eliminar este usuario? Esta acción
                    no se puede deshacer y todos sus datos asociados serán eliminados.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDeleteUser}
                className="inline-flex w-full justify-center rounded-lg border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
              >
                Eliminar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}