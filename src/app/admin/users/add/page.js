// app/admin/users/add/page.jsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Upload, 
  X, 
  CheckCircle,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  Lock,
  Mail,
  UserCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/admin/store/useUserStore";
import debounce from 'lodash.debounce';

export default function AddUserPage() {
  const router = useRouter();
  const { addUser, isLoading } = useUserStore();
  const fileInputRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: null,
    avatarPreview: null,
    role: "USER", // Default role
  });

  // Available roles
  const userRoles = [
    { id: "USER", name: "Usuario", icon: <User className="h-4 w-4" /> },
    { id: "ADMIN", name: "Administrador", icon: <Shield className="h-4 w-4" /> },
  ];

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "Sin contraseña" };
    if (password.length < 6) return { strength: 1, label: "Débil" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score === 1) return { strength: 1, label: "Débil" };
    if (score === 2) return { strength: 2, label: "Moderada" };
    if (score === 3) return { strength: 3, label: "Buena" };
    return { strength: 4, label: "Fuerte" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Field validation function
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value.trim() ? "El nombre es obligatorio" : "";
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value.trim() ? "El correo electrónico es obligatorio" : 
              !emailRegex.test(value) ? "Ingresa un correo electrónico válido" : "";
      }
      case 'password':
        return !value ? "La contraseña es obligatoria" : 
              value.length < 6 ? "La contraseña debe tener al menos 6 caracteres" : "";
      case 'confirmPassword':
        return value !== formData.password ? "Las contraseñas no coinciden" : "";
      default:
        return "";
    }
  };

  // Create debounced validation function
  const debouncedValidate = useCallback(
    debounce((name, value) => {
      const error = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }, 300),
    []
  );

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any global errors
    if (formError) setFormError("");
    
    // Use debounced validation for better performance
    debouncedValidate(name, value);
    
    // For confirmPassword, validate immediately when password changes
    if (name === 'password' && formData.confirmPassword) {
      debouncedValidate('confirmPassword', formData.confirmPassword);
    }
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
      
      // Use createObjectURL for better performance
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: file,
        avatarPreview: objectUrl
      }));
    }
  };
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (formData.avatarPreview && formData.avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.avatarPreview);
      }
    };
  }, [formData.avatarPreview]);
  
  // Remove avatar
  const handleRemoveAvatar = (e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (formData.avatarPreview && formData.avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(formData.avatarPreview);
    }
    
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
    const errors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    };
    
    setFieldErrors(errors);
    
    // Check if any errors exist
    return !Object.values(errors).some(error => error !== "");
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validate form
    if (!validateForm()) {
      setFormError("Por favor, corrige los errores en el formulario");
      return;
    }
    
    // Prepare user data for API
    const userData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role
    };
    
    try {
      const result = await addUser(userData);
      
      if (result && result.success) {
        setFormSuccess(true);
        // Redirect after success
        setTimeout(() => {
          router.push('/admin/users');
        }, 2000);
      } else {
        if (result && result.errors) {
          // Format specific validation errors from API
          const errorMessages = [];
          for (const field in result.errors) {
            errorMessages.push(result.errors[field].join('. '));
          }
          setFormError(errorMessages.join('. '));
        } else {
          setFormError((result && result.error) || "Ha ocurrido un error al crear el usuario");
        }
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setFormError(error.message || "Ha ocurrido un error al crear el usuario");
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
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariant = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const errorVariant = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -10, height: 0 },
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
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 },
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

  // Loading state UI
  if (isLoading && !formSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-purple-600 dark:border-t-purple-500 rounded-full animate-spin"></div>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </motion.div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Creando Usuario</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Estamos procesando tu solicitud...
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <motion.button 
            onClick={handleCancel}
            className="mr-4 p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.1 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.9 }}
            aria-label="Volver a la lista de usuarios"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <motion.div
            initial={{ x: prefersReducedMotion ? 0 : -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <UserCheck className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-500" />
              Agregar Usuario
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Crear una nueva cuenta de usuario en la plataforma WhereToGo
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
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30 rounded-xl p-8 text-center"
            >
              <div className="relative inline-block">
                <motion.div 
                  className="h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center mb-6 mx-auto"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 300, 
                      damping: 20, 
                      delay: 0.4 
                    }}
                  >
                    <CheckCircle className="h-10 w-10 text-white" />
                  </motion.div>
                </motion.div>
              </div>
              
              <motion.h2 
                className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                ¡Usuario Creado Exitosamente!
              </motion.h2>
              
              <motion.p 
                className="text-green-700 dark:text-green-400 mb-6 max-w-md mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                El usuario ha sido agregado correctamente a la plataforma WhereToGo
              </motion.p>
              
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-full h-2 w-32">
                  <motion.div 
                    className="bg-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                  />
                </div>
              </motion.div>
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
                        initial={{ rotate: prefersReducedMotion ? 0 : 90 }}
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - User Information */}
                <motion.div 
                  className="lg:col-span-2 space-y-6"
                  variants={itemVariant}
                >
                  {/* Basic Information Card */}
                  <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                    variants={itemVariant}
                    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-5 flex items-center">
                      <User className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-500" />
                      Información Básica
                    </h3>

                    <div className="space-y-5">
                      {/* Name Field */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Nombre Completo <span className="text-red-500" aria-hidden="true">*</span>
                          <span className="sr-only">(requerido)</span>
                        </label>
                        <motion.div 
                          className={`relative rounded-lg border ${
                            fieldErrors.name 
                              ? 'border-red-300 dark:border-red-700' 
                              : 'border-gray-300 dark:border-gray-600'
                          } focus-within:border-purple-500 dark:focus-within:border-purple-500`}
                          whileFocus={{ boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.15)' }}
                        >
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            aria-describedby={fieldErrors.name ? "name-error" : undefined}
                            aria-invalid={fieldErrors.name ? "true" : "false"}
                            className={`block w-full rounded-lg py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-transparent focus:ring-0 focus:outline-none`}
                            placeholder="Juan Pérez"
                          />
                        </motion.div>
                        {fieldErrors.name && (
                          <p id="name-error" className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Correo Electrónico <span className="text-red-500" aria-hidden="true">*</span>
                          <span className="sr-only">(requerido)</span>
                        </label>
                        <motion.div 
                          className={`relative rounded-lg border ${
                            fieldErrors.email 
                              ? 'border-red-300 dark:border-red-700' 
                              : 'border-gray-300 dark:border-gray-600'
                          } focus-within:border-purple-500 dark:focus-within:border-purple-500 flex`}
                          whileFocus={{ boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.15)' }}
                        >
                          <span className="inline-flex items-center pl-4 text-gray-500 dark:text-gray-400">
                            <Mail size={18} />
                          </span>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            aria-describedby={fieldErrors.email ? "email-error" : undefined}
                            aria-invalid={fieldErrors.email ? "true" : "false"}
                            className="block w-full rounded-lg py-3 pl-2 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-transparent focus:ring-0 focus:outline-none"
                            placeholder="usuario@ejemplo.com"
                          />
                        </motion.div>
                        {fieldErrors.email && (
                          <p id="email-error" className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Role Selection */}
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Rol del Usuario
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          {userRoles.map(role => (
                            <motion.div
                              key={role.id}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setFormData(prev => ({ ...prev, role: role.id }))}
                              className={`cursor-pointer rounded-lg p-3 border-2 ${
                                formData.role === role.id 
                                  ? 'border-purple-500 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800/50'
                              }`}
                            >
                              <div className="flex items-center">
                                <div className={`mr-3 rounded-full p-2 ${
                                  formData.role === role.id
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                }`}>
                                  {role.icon}
                                </div>
                                <div>
                                  <div className={`font-medium ${
                                    formData.role === role.id
                                      ? 'text-purple-800 dark:text-purple-300'
                                      : 'text-gray-900 dark:text-gray-200'
                                  }`}>
                                    {role.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {role.id === "USER" ? "Acceso estándar" : "Acceso completo"}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Define el nivel de acceso del usuario en la plataforma WhereToGo
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Security Information Card */}
                  <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                    variants={itemVariant}
                    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-5 flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-500" />
                      Seguridad
                    </h3>

                    <div className="space-y-5">
                      {/* Password Field */}
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Contraseña <span className="text-red-500" aria-hidden="true">*</span>
                          <span className="sr-only">(requerido)</span>
                        </label>
                        <motion.div 
                          className={`relative rounded-lg border ${
                            fieldErrors.password 
                              ? 'border-red-300 dark:border-red-700' 
                              : 'border-gray-300 dark:border-gray-600'
                          } focus-within:border-purple-500 dark:focus-within:border-purple-500`}
                          whileFocus={{ boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.15)' }}
                        >
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            aria-describedby={fieldErrors.password ? "password-error" : "password-hint"}
                            aria-invalid={fieldErrors.password ? "true" : "false"}
                            className="block w-full rounded-lg py-3 px-4 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-transparent focus:ring-0 focus:outline-none"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </motion.div>
                        
                        {/* Password strength meter */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Seguridad: <span className={`font-medium ${
                                passwordStrength.strength === 0 ? 'text-gray-400 dark:text-gray-500' :
                                passwordStrength.strength === 1 ? 'text-red-500 dark:text-red-400' :
                                passwordStrength.strength === 2 ? 'text-yellow-500 dark:text-yellow-400' :
                                passwordStrength.strength === 3 ? 'text-lime-500 dark:text-lime-400' :
                                'text-green-500 dark:text-green-400'
                              }`}>{passwordStrength.label}</span>
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${
                                passwordStrength.strength === 0 ? 'bg-gray-300 dark:bg-gray-600' :
                                passwordStrength.strength === 1 ? 'bg-red-500 dark:bg-red-500' :
                                passwordStrength.strength === 2 ? 'bg-yellow-500 dark:bg-yellow-500' :
                                passwordStrength.strength === 3 ? 'bg-lime-500 dark:bg-lime-500' :
                                'bg-green-500 dark:bg-green-500'
                              }`}
                              initial={{ width: '0%' }}
                              animate={{ width: `${passwordStrength.strength * 25}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                        
                        {fieldErrors.password ? (
                          <p id="password-error" className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                            {fieldErrors.password}
                          </p>
                        ) : (
                          <p id="password-hint" className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                            Mínimo 6 caracteres. Una contraseña segura incluye letras mayúsculas, minúsculas, números y símbolos.
                          </p>
                        )}
                      </div>

                      {/* Confirm Password Field */}
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirmar Contraseña <span className="text-red-500" aria-hidden="true">*</span>
                          <span className="sr-only">(requerido)</span>
                        </label>
                        <motion.div 
                          className={`relative rounded-lg border ${
                            fieldErrors.confirmPassword 
                              ? 'border-red-300 dark:border-red-700' 
                              : 'border-gray-300 dark:border-gray-600'
                          } focus-within:border-purple-500 dark:focus-within:border-purple-500`}
                          whileFocus={{ boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.15)' }}
                        >
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
                            aria-invalid={fieldErrors.confirmPassword ? "true" : "false"}
                            className="block w-full rounded-lg py-3 px-4 pr-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-transparent focus:ring-0 focus:outline-none"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </motion.div>
                        {fieldErrors.confirmPassword && (
                          <p id="confirm-password-error" className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                            {fieldErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Security Tips */}
                    <motion.div 
                      className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-lg p-4 mt-5"
                      variants={itemVariant}
                    >
                      <div className="flex">
                        <Shield className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            Recomendaciones de seguridad:
                          </h4>
                          <ul className="mt-1 text-xs text-amber-700 dark:text-amber-400 list-disc pl-4 space-y-1">
                            <li>Incluir letras mayúsculas y minúsculas</li>
                            <li>Incluir al menos un número</li>
                            <li>Incluir al menos un carácter especial (ej. !@#$%)</li>
                            <li>Evitar secuencias obvias (ej. 123456) o palabras comunes</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Right Column - Avatar and Role Description */}
                <motion.div className="space-y-6">
                  {/* Avatar Card */}
                  <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                    variants={itemVariant}
                    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-5">
                      Imagen de Perfil
                    </h3>
                    
                    {/* Avatar Upload Area */}
                    <motion.div 
                      className="relative group cursor-pointer bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border-2 border-dashed border-gray-300 dark:border-gray-700"
                      whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.1)', borderColor: '#8b5cf6' }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <motion.div 
                          className="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mb-4 relative"
                          whileHover={{ scale: 1.05 }}
                        >
                          {formData.avatarPreview ? (
                            <img src={formData.avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200">
                            <Upload className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-200" />
                          </div>
                        </motion.div>
                        
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                          {formData.avatarPreview ? 'Cambiar foto de perfil' : 'Subir foto de perfil'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          JPG, PNG o GIF. Max 2MB
                        </p>
                        
                        {formData.avatarPreview && (
                          <motion.button
                            type="button"
                            onClick={(e) => handleRemoveAvatar(e)}
                            className="mt-3 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium flex items-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Eliminar
                          </motion.button>
                        )}
                      </div>
                      <input
                        id="avatar-upload"
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        aria-label="Subir avatar"
                      />
                    </motion.div>
                  </motion.div>
                  
                  {/* Role Descriptions Card */}
                  <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                    variants={itemVariant}
                    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-5">
                      Permisos por Rol
                    </h3>
                    
                    {/* Role Cards */}
                    <div className="space-y-4">
                      {[
                        { 
                          id: "USER",
                          title: "Usuario",
                          icon: <User className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
                          items: [
                            "Navegar y ver lugares",
                            "Crear listas de favoritos",
                            "Dejar reseñas y valoraciones",
                            "Editar su perfil personal"
                          ]
                        },
                        { 
                          id: "ADMIN",
                          title: "Administrador",
                          icon: <Shield className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />,
                          items: [
                            "Acceso completo al sistema",
                            "Gestión de usuarios",
                            "Administración de contenidos",
                            "Configuración de la plataforma"
                          ]
                        }
                      ].map((role) => (
                        <motion.div
                          key={role.id}
                          className={`border ${
                            formData.role === role.id 
                              ? 'border-purple-200 dark:border-purple-700/50 bg-purple-50/50 dark:bg-purple-900/10' 
                              : 'border-gray-200 dark:border-gray-700'
                          } rounded-lg p-4 relative overflow-hidden`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: formData.role === role.id ? 0.1 : 0 }}
                          whileHover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        >
                          {formData.role === role.id && (
                            <motion.div 
                              className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"
                              layoutId="activeRoleIndicator"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                          <div className="flex items-center mb-2">
                            <span className="mr-2">{role.icon}</span>
                            <h4 className={`font-medium ${
                              formData.role === role.id 
                                ? 'text-purple-800 dark:text-purple-300' 
                                : 'text-gray-800 dark:text-gray-200'
                            }`}>{role.title}</h4>
                          </div>
                          <ul className="text-sm space-y-1.5">
                            {role.items.map((item, i) => (
                              <motion.li 
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.05) }}
                                className={`flex items-start ${
                                  formData.role === role.id 
                                    ? 'text-purple-700 dark:text-purple-400' 
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" /> 
                                {item}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Form Actions */}
              <motion.div 
                className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3"
                variants={itemVariant}
              >
                <motion.button
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: prefersReducedMotion ? 1 : 1.02, 
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)' 
                  }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-medium"
                >
                  <motion.span
                    initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -5 }}
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
    </div>
  );
}