"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Bell,
  Globe,
  Moon,
  Sun,
  Shield,
  Key,
  LogOut,
  Save,
  Camera,
  X,
  Check,
  AlertTriangle,
  MessageSquare,
  Settings,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function AdminSettings() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Administrador",
    bio: "Administrador gestionando contenido de la plataforma y cuentas de usuario.",
    avatar: "/images/avatar.jpg",
    phone: "+1 (555) 123-4567",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferencesForm, setPreferencesForm] = useState({
    theme: "system",
    language: "es",
    timezone: "America/New_York",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
  });

  const [securityForm, setSecurityForm] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    activeSessions: [
      {
        id: 1,
        device: "Chrome en Windows",
        ipAddress: "192.168.1.1",
        location: "Nueva York, EE.UU.",
        lastActive: "2023-07-15T10:30:00",
        current: true,
      },
      {
        id: 2,
        device: "Safari en iPhone",
        ipAddress: "192.168.1.2",
        location: "Nueva York, EE.UU.",
        lastActive: "2023-07-14T15:45:00",
        current: false,
      },
    ],
  });

  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "Inglés" },
    { code: "fr", name: "Francés" },
    { code: "de", name: "Alemán" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Portugués" },
  ];

  const timezones = [
    { code: "America/New_York", name: "Hora del Este (EE.UU. y Canadá)" },
    { code: "America/Chicago", name: "Hora Central (EE.UU. y Canadá)" },
    { code: "America/Denver", name: "Hora de Montaña (EE.UU. y Canadá)" },
    { code: "America/Los_Angeles", name: "Hora del Pacífico (EE.UU. y Canadá)" },
    { code: "Europe/London", name: "Londres" },
    { code: "Europe/Paris", name: "París" },
    { code: "Asia/Tokyo", name: "Tokio" },
  ];

  useEffect(() => {
    // Simular carga de datos del usuario
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferencesForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, checked } = e.target;
    setSecurityForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e, formType) => {
    e.preventDefault();
    console.log(`Guardando configuración de ${formType}:`, 
      formType === "profile" ? profileForm : 
      formType === "password" ? passwordForm : 
      formType === "preferences" ? preferencesForm : 
      securityForm
    );
    // Mostrar mensaje de éxito
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileForm(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSession = (sessionId) => {
    setSecurityForm(prev => ({
      ...prev,
      activeSessions: prev.activeSessions.filter(session => session.id !== sessionId)
    }));
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 py-6 sm:px-6 lg:px-8 flex justify-center items-center min-h-[60vh]"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg font-medium">Cargando configuración de cuenta...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    className="px-4 py-6 sm:px-6 lg:px-8"
  >
    {/* Header - Fixed to ensure visibility */}
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Configuración de Cuenta
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Gestiona tu perfil, preferencias y seguridad de cuenta
      </p>
    </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Pestañas de Configuración - Barra lateral izquierda */}
        <div className="col-span-12 md:col-span-3 lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6 space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "profile"
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <User className="mr-2 h-5 w-5" /> Información de perfil
              </button>
              
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "password"
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Lock className="mr-2 h-5 w-5" /> Contraseña
              </button>
              
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "preferences"
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Settings className="mr-2 h-5 w-5" /> Preferencias
              </button>
              
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "security"
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Shield className="mr-2 h-5 w-5" /> Seguridad
              </button>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-2 h-5 w-5" /> Cerrar sesión
              </motion.button>
            </div>
          </div>
        </div>

        {/* Contenido de Configuración - Lado derecho */}
        <div className="col-span-12 md:col-span-9 lg:col-span-9 space-y-8">
          {/* Información del Perfil */}
          {activeTab === "profile" && (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={(e) => handleSubmit(e, "profile")}
            >
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                    Información del Perfil
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                  {/* Sección de carga de avatar */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center"
                  >
                    <div className="mr-4 relative">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                        <img 
                          src={profileForm.avatar || "https://via.placeholder.com/200"} 
                          alt="Foto de perfil" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-0 right-0 rounded-full bg-indigo-600 p-2 cursor-pointer shadow-md hover:bg-indigo-700 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </label>
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Foto de Perfil</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        JPG, GIF o PNG. Máximo 1MB.
                      </p>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {[
                      {
                        label: "Nombre Completo",
                        id: "name",
                        name: "name",
                        value: profileForm.name,
                        icon: <User className="h-5 w-5 text-gray-400" />,
                        colspan: "sm:col-span-3"
                      },
                      {
                        label: "Correo Electrónico",
                        id: "email",
                        name: "email",
                        type: "email",
                        value: profileForm.email,
                        icon: <Mail className="h-5 w-5 text-gray-400" />,
                        colspan: "sm:col-span-3"
                      },
                      {
                        label: "Número de Teléfono",
                        id: "phone",
                        name: "phone",
                        value: profileForm.phone,
                        colspan: "sm:col-span-3"
                      },
                      {
                        label: "Rol",
                        id: "role",
                        name: "role",
                        value: profileForm.role,
                        disabled: true,
                        className: "bg-gray-50 dark:bg-gray-600 dark:text-gray-300 cursor-not-allowed",
                        colspan: "sm:col-span-3"
                      },
                      {
                        label: "Biografía",
                        id: "bio",
                        name: "bio",
                        value: profileForm.bio,
                        textarea: true,
                        rows: 3,
                        colspan: "sm:col-span-6",
                        helpText: "Breve descripción para tu perfil."
                      }
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={field.colspan}
                      >
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {field.label}
                        </label>
                        <div className={`mt-1 ${field.icon ? "relative" : ""}`}>
                          {field.icon && (
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              {field.icon}
                            </div>
                          )}
                          {field.textarea ? (
                            <textarea
                              id={field.id}
                              name={field.name}
                              rows={field.rows || 3}
                              value={field.value}
                              onChange={handleProfileChange}
                              disabled={field.disabled}
                              className={`block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white ${field.className || ""}`}
                            />
                          ) : (
                            <input
                              type={field.type || "text"}
                              id={field.id}
                              name={field.name}
                              value={field.value}
                              onChange={handleProfileChange}
                              disabled={field.disabled}
                              className={`block w-full ${field.icon ? "pl-10" : ""} rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white ${field.className || ""}`}
                            />
                          )}
                          {field.helpText && (
                            <p className="mt-2 text-sm text-gray-500">
                              {field.helpText}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/40 text-right sm:px-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm font-medium flex items-center ml-auto"
                  >
                    <Save size={18} className="mr-2" />
                    Guardar Perfil
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Sección de Contraseña */}
          {activeTab === "password" && (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={(e) => handleSubmit(e, "password")}
            >
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                    Cambiar Contraseña
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-4">
                  {[
                    {
                      label: "Contraseña Actual",
                      id: "currentPassword",
                      name: "currentPassword",
                      value: passwordForm.currentPassword,
                      show: showPassword,
                      toggleShow: () => setShowPassword(!showPassword)
                    },
                    {
                      label: "Nueva Contraseña",
                      id: "newPassword",
                      name: "newPassword",
                      value: passwordForm.newPassword,
                      show: showNewPassword,
                      toggleShow: () => setShowNewPassword(!showNewPassword)
                    },
                    {
                      label: "Confirmar Contraseña",
                      id: "confirmPassword",
                      name: "confirmPassword",
                      value: passwordForm.confirmPassword,
                      show: showConfirmPassword,
                      toggleShow: () => setShowConfirmPassword(!showConfirmPassword)
                    }
                  ].map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {field.label}
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type={field.show ? "text" : "password"}
                          id={field.id}
                          name={field.name}
                          value={field.value}
                          onChange={handlePasswordChange}
                          className="block w-full pr-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={field.toggleShow}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {field.show ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Requisitos de contraseña:</h3>
                        <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Mínimo 8 caracteres</li>
                            <li>Al menos una letra mayúscula</li>
                            <li>Al menos un número</li>
                            <li>Al menos un carácter especial</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/40 text-right sm:px-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm font-medium flex items-center ml-auto"
                  >
                    <Key size={18} className="mr-2" />
                    Actualizar Contraseña
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Sección de Preferencias */}
          {activeTab === "preferences" && (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={(e) => handleSubmit(e, "preferences")}
            >
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                    Preferencias
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                  {/* Preferencia de Tema */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Preferencia de Tema</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "theme-light", value: "light", icon: <Sun className="h-6 w-6 text-amber-500" />, label: "Claro" },
                        { id: "theme-dark", value: "dark", icon: <Moon className="h-6 w-6 text-indigo-400" />, label: "Oscuro" },
                        { 
                          id: "theme-system", 
                          value: "system", 
                          icon: (
                            <div className="h-6 w-6 relative">
                              <Sun className="h-5 w-5 absolute top-0 left-0 text-amber-500" />
                              <Moon className="h-4 w-4 absolute bottom-0 right-0 text-indigo-400" />
                            </div>
                          ),
                          label: "Sistema" 
                        }
                      ].map((theme, index) => (
                        <motion.div
                          key={theme.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + (index * 0.05) }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`border rounded-lg p-3 cursor-pointer ${
                            preferencesForm.theme === theme.value 
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                          onClick={() => setPreferencesForm(prev => ({ ...prev, theme: theme.value }))}
                        >
                          <div className="flex justify-center mb-2">
                            {theme.icon}
                          </div>
                          <div className="text-center">
                            <input 
                              type="radio" 
                              id={theme.id} 
                              name="theme" 
                              value={theme.value} 
                              checked={preferencesForm.theme === theme.value} 
                              onChange={handlePreferencesChange}
                              className="sr-only"
                            />
                            <label 
                              htmlFor={theme.id} 
                              className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                            >
                              {theme.label}
                            </label>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Idioma y Zona Horaria */}
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    {[
                      {
                        label: "Idioma",
                        id: "language",
                        name: "language",
                        value: preferencesForm.language,
                        icon: <Globe className="h-5 w-5 text-gray-400" />,
                        options: languages,
                        optionLabel: "name",
                        optionValue: "code"
                      },
                      {
                        label: "Zona Horaria",
                        id: "timezone",
                        name: "timezone",
                        value: preferencesForm.timezone,
                        icon: <Clock className="h-5 w-5 text-gray-400" />,
                        options: timezones,
                        optionLabel: "name",
                        optionValue: "code"
                      }
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (index * 0.1) }}
                      >
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {field.label}
                        </label>
                        <div className="mt-1 relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {field.icon}
                          </div>
                          <select
                            id={field.id}
                            name={field.name}
                            value={field.value}
                            onChange={handlePreferencesChange}
                            className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                          >
                            {field.options.map(option => (
                              <option key={option[field.optionValue]} value={option[field.optionValue]}>
                                {option[field.optionLabel]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Preferencias de Notificaciones */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Preferencias de Notificaciones
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          id: "emailNotifications",
                          name: "emailNotifications",
                          label: "Notificaciones por correo",
                          description: "Recibir notificaciones por correo sobre la actividad de la cuenta y actualizaciones.",
                          checked: preferencesForm.emailNotifications
                        },
                        {
                          id: "pushNotifications",
                          name: "pushNotifications",
                          label: "Notificaciones push",
                          description: "Recibir notificaciones push en tu navegador.",
                          checked: preferencesForm.pushNotifications
                        },
                        {
                          id: "marketingEmails",
                          name: "marketingEmails",
                          label: "Correos de marketing",
                          description: "Recibir correos sobre nuevas funciones, productos y servicios.",
                          checked: preferencesForm.marketingEmails
                        }
                      ].map((pref, index) => (
                        <motion.div 
                          key={pref.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + (index * 0.1) }}
                          className="flex items-start"
                        >
                          <div className="flex items-center h-5">
                            <input
                              id={pref.id}
                              name={pref.name}
                              type="checkbox"
                              checked={pref.checked}
                              onChange={handlePreferencesChange}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={pref.id} className="font-medium text-gray-700 dark:text-gray-300">
                              {pref.label}
                            </label>
                            <p className="text-gray-500 dark:text-gray-400">
                              {pref.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/40 text-right sm:px-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm font-medium flex items-center ml-auto"
                  >
                    <Save size={18} className="mr-2" />
                    Guardar Preferencias
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Sección de Seguridad */}
          {activeTab === "security" && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={(e) => handleSubmit(e, "security")}
            >
              <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
                <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                    Opciones de Seguridad
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-4">
                  {[
                    {
                      id: "twoFactorEnabled",
                      name: "twoFactorEnabled",
                      title: "Autenticación de dos factores",
                      description: "Añade una capa extra de seguridad a tu cuenta",
                      checked: securityForm.twoFactorEnabled
                    },
                    {
                      id: "loginAlerts",
                      name: "loginAlerts",
                      title: "Alertas de inicio de sesión",
                      description: "Recibe notificaciones cuando alguien inicie sesión en tu cuenta",
                      checked: securityForm.loginAlerts
                    }
                  ].map((option, index) => (
                    <motion.div 
                      key={option.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{option.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          id={option.id}
                          name={option.name}
                          type="checkbox"
                          checked={option.checked}
                          onChange={handleSecurityChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={option.id} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          {option.checked ? "Activado" : "Desactivado"}
                        </label>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Sesiones Activas */}
              <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Sesiones Activas
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    {securityForm.activeSessions.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No se encontraron sesiones activas
                        </p>
                      </div>
                    ) : (
                      securityForm.activeSessions.map((session, index) => (
                        <motion.div 
                          key={session.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 border rounded-lg ${
                            session.current 
                              ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/10' 
                              : 'border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                                {session.device}
                                {session.current && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Actual
                                  </span>
                                )}
                              </h4>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Dirección IP: {session.ipAddress}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Ubicación: {session.location}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Última Actividad: {new Date(session.lastActive).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {!session.current && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => handleRemoveSession(session.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Eliminar sesión</span>
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/40 sm:px-6 flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {securityForm.activeSessions.length} sesión{securityForm.activeSessions.length !== 1 ? 'es' : ''} activa{securityForm.activeSessions.length !== 1 ? 's' : ''}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                    onClick={() => {
                      const currentSession = securityForm.activeSessions.find(s => s.current);
                      setSecurityForm(prev => ({
                        ...prev,
                        activeSessions: prev.activeSessions.filter(s => s.current)
                      }));
                    }}
                  >
                    Cerrar Todas las Otras Sesiones
                  </motion.button>
                </div>
              </motion.div>
              
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/40 mt-6 rounded-lg text-right">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm font-medium flex items-center ml-auto"
                >
                  <Save size={18} className="mr-2" />
                  Guardar Configuración de Seguridad
                </motion.button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </motion.div>
  );
}