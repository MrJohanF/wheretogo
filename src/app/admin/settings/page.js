"use client";

import { useState, useEffect, useCallback, useMemo, memo, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Lock, Shield, LogOut, Settings,
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

// Lazy-loaded tab components - create these files in SettingsTabs folder
const ProfileTab = lazy(() => import('./SettingsTabs/ProfileTab'));
const PasswordTab = lazy(() => import('./SettingsTabs/PasswordTab'));
const PreferencesTab = lazy(() => import('./SettingsTabs/PreferencesTab'));
const SecurityTab = lazy(() => import('./SettingsTabs/SecurityTab'));

// Memoized components
const TabButton = memo(({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors \${
      active
        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
));

// Loading component
const LoadingSpinner = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center min-h-[60vh]"
  >
    <div className="w-12 h-12 border-3 border-t-indigo-600 border-indigo-200 dark:border-t-indigo-400 dark:border-gray-700 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600 dark:text-gray-400 text-base">
      Cargando configuración...
    </p>
  </motion.div>
);

// Fetch and manage form data - outside of component to avoid re-creation
const getInitialState = () => ({
  profile: {
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Administrador",
    bio: "Administrador gestionando contenido de la plataforma y cuentas de usuario.",
    avatar: "/images/avatar.jpg",
    phone: "+1 (555) 123-4567",
  },
  password: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  preferences: {
    theme: "system",
    language: "es",
    timezone: "America/New_York",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
  },
  security: {
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
  },
  visibility: {
    showPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  },
});

export default function AdminSettings() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Use one state for all forms to reduce hooks and state updates
  const [formState, setFormState] = useState(getInitialState);

  // Static data arrays
  const languages = useMemo(() => [
    { code: "es", name: "Español" },
    { code: "en", name: "Inglés" },
    { code: "fr", name: "Francés" },
    { code: "de", name: "Alemán" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Portugués" },
  ], []);

  const timezones = useMemo(() => [
    { code: "America/New_York", name: "Hora del Este (EE.UU. y Canadá)" },
    { code: "America/Chicago", name: "Hora Central (EE.UU. y Canadá)" },
    { code: "America/Denver", name: "Hora de Montaña (EE.UU. y Canadá)" },
    { code: "America/Los_Angeles", name: "Hora del Pacífico (EE.UU. y Canadá)" },
    { code: "Europe/London", name: "Londres" },
    { code: "Europe/Paris", name: "París" },
    { code: "Asia/Tokyo", name: "Tokio" },
  ], []);

  // Memoize tab configuration
  const tabs = useMemo(() => [
    { id: "profile", label: "Información de perfil", icon: <User className="h-5 w-5" /> },
    { id: "password", label: "Contraseña", icon: <Lock className="h-5 w-5" /> },
    { id: "preferences", label: "Preferencias", icon: <Settings className="h-5 w-5" /> },
    { id: "security", label: "Seguridad", icon: <Shield className="h-5 w-5" /> },
  ], []);

  // Simulate data loading once
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Form change handlers with useCallback
  const handleFormChange = useCallback((formName, field, value) => {
    setFormState(prev => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        [field]: value
      }
    }));
  }, []);

  const handlePasswordVisibility = useCallback((field) => {
    setFormState(prev => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [field]: !prev.visibility[field]
      }
    }));
  }, []);

  const handleSubmit = useCallback((e, formType) => {
    e.preventDefault();
    console.log(`Guardando configuración de \${formType}:`, formState[formType]);
    // Show success message or handle API call
  }, [formState]);

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            avatar: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveSession = useCallback((sessionId) => {
    setFormState(prev => ({
      ...prev,
      security: {
        ...prev.security,
        activeSessions: prev.security.activeSessions.filter(session => session.id !== sessionId)
      }
    }));
  }, []);

  const handleCloseAllSessions = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      security: {
        ...prev.security,
        activeSessions: prev.security.activeSessions.filter(s => s.current)
      }
    }));
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuración de Cuenta
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gestiona tu perfil, preferencias y seguridad de cuenta
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <motion.div 
          variants={slideIn}
          className="col-span-12 md:col-span-3 lg:col-span-3"
        >
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6 space-y-1">
              {tabs.map(tab => (
                <TabButton
                  key={tab.id}
                  active={activeTab === tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
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
        </motion.div>

        {/* Main Content Area */}
        <div className="col-span-12 md:col-span-9 lg:col-span-9">
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <ProfileTab 
                  key="profile"
                  formData={formState.profile}
                  onChange={(field, value) => handleFormChange('profile', field, value)}
                  onSubmit={(e) => handleSubmit(e, 'profile')}
                  onAvatarChange={handleAvatarChange}
                />
              )}
              
              {activeTab === "password" && (
                <PasswordTab 
                  key="password"
                  formData={formState.password}
                  visibility={formState.visibility}
                  onChange={(field, value) => handleFormChange('password', field, value)}
                  onToggleVisibility={handlePasswordVisibility}
                  onSubmit={(e) => handleSubmit(e, 'password')}
                />
              )}
              
              {activeTab === "preferences" && (
                <PreferencesTab 
                  key="preferences"
                  formData={formState.preferences}
                  languages={languages}
                  timezones={timezones}
                  onChange={(field, value) => handleFormChange('preferences', field, value)}
                  onSubmit={(e) => handleSubmit(e, 'preferences')}
                />
              )}
              
              {activeTab === "security" && (
                <SecurityTab 
                  key="security"
                  formData={formState.security}
                  onChange={(field, value) => handleFormChange('security', field, value)}
                  onRemoveSession={handleRemoveSession}
                  onCloseAllSessions={handleCloseAllSessions}
                  onSubmit={(e) => handleSubmit(e, 'security')}
                />
              )}
            </AnimatePresence>
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
}