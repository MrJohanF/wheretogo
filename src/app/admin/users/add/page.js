"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Upload, 
  X, 
  CheckCircle,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  Calendar,
  Edit
} from "lucide-react";
import { useRouter } from "next/navigation";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function AddUserPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    avatarPreview: null,
    role: "user", // Default role
  });

  // Available roles
  const userRoles = [
    { id: "user", name: "Usuario" },
    { id: "editor", name: "Editor" },
    { id: "admin", name: "Administrador" },
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any validation errors
    if (formError) setFormError("");
  };
  
  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setFormError("La imagen no puede ser mayor a 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          avatar: file,
          avatarPreview: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove avatar
  const handleRemoveAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: null,
      avatarPreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError("El nombre es obligatorio");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setFormError("Ingresa un correo electrónico válido");
      return false;
    }
    
    if (!formData.password) {
      setFormError("La contraseña es obligatoria");
      return false;
    }
    
    if (formData.password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success!
      setFormSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      setFormError(error.message || "Ha ocurrido un error al crear el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  // Go back to users list
  const handleCancel = () => {
    router.push('/admin/users');
  };

  if (isLoading && !formSuccess) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="flex items-center mb-8">
        <button 
          onClick={handleCancel}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agregar Usuario
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Crear una nueva cuenta de usuario en la plataforma
          </p>
        </div>
      </div>

      {formSuccess ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">¡Usuario Creado Exitosamente!</h2>
          <p className="text-green-700 dark:text-green-300">
            El usuario ha sido agregado a la plataforma.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-4">
            Redirigiendo a la lista de usuarios...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                    Error
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                    {formError}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Información Básica
              </h3>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rol
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                  >
                    {userRoles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Define el nivel de acceso del usuario en la plataforma
                </p>
              </div>
            </div>

            {/* Security Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Seguridad
              </h3>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-lg p-3 mt-2">
                <div className="flex">
                  <Shield className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                      Recomendaciones de seguridad:
                    </h4>
                    <ul className="mt-1 text-xs text-amber-700 dark:text-amber-400 list-disc pl-4 space-y-1">
                      <li>Incluir letras mayúsculas y minúsculas</li>
                      <li>Incluir al menos un número</li>
                      <li>Incluir al menos un carácter especial (ej. !@#\$%)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Imagen de Perfil
              </h3>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex items-center justify-center">
                <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-center lg:space-x-8">
                  {/* Avatar Preview */}
                  <div className="mb-6 lg:mb-0">
                    <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {formData.avatarPreview ? (
                        <img
                          src={formData.avatarPreview}
                          alt="Avatar Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Foto de Perfil (Opcional)
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Sube una imagen JPG, PNG o GIF. Máximo 2MB.
                    </p>
                    <div className="flex space-x-3">
                      <input
                        id="avatar-upload"
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-1.5" />
                        {formData.avatarPreview ? "Cambiar Imagen" : "Subir Imagen"}
                      </button>
                      
                      {formData.avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium flex items-center"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Permissions Description */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Permisos por Rol
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Usuario</h4>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Navegar y ver lugares</li>
                    <li>• Crear favoritos</li>
                    <li>• Dejar reseñas</li>
                    <li>• Editar su perfil</li>
                  </ul>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Edit className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Editor</h4>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Todo lo de usuario</li>
                    <li>• Crear y editar lugares</li>
                    <li>• Moderar reseñas</li>
                    <li>• Gestionar categorías</li>
                  </ul>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">Administrador</h4>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Acceso completo</li>
                    <li>• Gestionar usuarios</li>
                    <li>• Configuración del sistema</li>
                    <li>• Acceso al panel administrativo</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 font-medium"
            >
              <Save size={18} className="inline-block mr-2" />
              Crear Usuario
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}