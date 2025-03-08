// app/admin/users/add/page.jsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Lock, 
  X, 
  CheckCircle,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/admin/store/useUserStore";

export default function AddUserPage() {
  const router = useRouter();
  const { addUser, isLoading } = useUserStore();
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER", // Default role
  });

  // Available roles
  const userRoles = [
    { id: "USER", name: "Usuario" },
    { id: "ADMIN", name: "Administrador" },
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear any general error
    if (formError) setFormError("");
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "El nombre es obligatorio";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = "Ingresa un correo electrónico válido";
    }
    
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Prepare the data for API
    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role
    };
    
    // Submit data
    const result = await addUser(userData);
    
    if (result.success) {
      setFormSuccess(true);
      // Redirect after success
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } else {
      if (result.errors) {
        // Set specific field validation errors if we got them from the API
        setValidationErrors(result.errors);
      } else {
        // Set general error message
        setFormError(result.error || "Ha ocurrido un error al crear el usuario");
      }
    }
  };

  // Go back to users list
  const handleCancel = () => {
    router.push('/admin/users');
  };

  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const errorVariant = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { type: 'spring', stiffness: 400, damping: 40 }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const successVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      }
    }
  };

  if (isLoading && !formSuccess) {
    return (
      <div className="p-8 flex justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <div className="text-gray-500 dark:text-gray-400">Creando usuario...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="flex items-center mb-8">
        <motion.button 
          onClick={handleCancel}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </motion.button>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agregar Usuario
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Crear una nueva cuenta de usuario en la plataforma
          </p>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {formSuccess ? (
          <motion.div 
            key="success"
            variants={successVariant}
            initial="hidden"
            animate="visible"
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
          >
            <motion.div 
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4"
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h2 
              className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ¡Usuario Creado Exitosamente!
            </motion.h2>
            <motion.p 
              className="text-green-700 dark:text-green-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              El usuario ha sido agregado a la plataforma.
            </motion.p>
            <motion.p 
              className="text-sm text-green-600 dark:text-green-400 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Redirigiendo a la lista de usuarios...
            </motion.p>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-8"
            variants={containerVariant}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {formError && (
                <motion.div 
                  variants={errorVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <div className="flex">
                    <motion.div
                      initial={{ rotate: 90 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-3" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        Error
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        {formError}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <motion.div 
                className="space-y-4"
                variants={itemVariant}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Información Básica
                </h3>

                <motion.div variants={itemVariant}>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border \${
                      validationErrors.name 
                        ? 'border-red-300 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    } py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white`}
                    placeholder="Juan Pérez"
                    whileFocus={{ boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)' }}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariant}>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border \${
                      validationErrors.email 
                        ? 'border-red-300 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    } py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white`}
                    placeholder="usuario@ejemplo.com"
                    whileFocus={{ boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)' }}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariant}>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rol
                  </label>
                  <div className="mt-1">
                    <motion.select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                      whileFocus={{ boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)' }}
                    >
                      {userRoles.map(role => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </motion.select>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Define el nivel de acceso del usuario en la plataforma
                  </p>
                </motion.div>
              </motion.div>

              {/* Security Information */}
              <motion.div 
                className="space-y-4"
                variants={itemVariant}
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Seguridad
                </h3>

                <motion.div variants={itemVariant}>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <motion.input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full rounded-md border \${
                        validationErrors.password 
                          ? 'border-red-300 dark:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      } py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white`}
                      placeholder="••••••••"
                      whileFocus={{ boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)' }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </motion.button>
                  </div>
                  {validationErrors.password ? (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Mínimo 6 caracteres
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariant}>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative">
                    <motion.input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full rounded-md border \${
                        validationErrors.confirmPassword 
                          ? 'border-red-300 dark:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      } py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white`}
                      placeholder="••••••••"
                      whileFocus={{ boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)' }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </motion.button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
                  )}
                </motion.div>

                <motion.div 
                  className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-lg p-3 mt-2"
                  variants={itemVariant}
                >
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
                </motion.div>
              </motion.div>
            </div>

            <motion.div 
              className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3"
              variants={itemVariant}
            >
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
                whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center"
                >
                  <Save size={18} className="inline-block mr-2" />
                  Crear Usuario
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}