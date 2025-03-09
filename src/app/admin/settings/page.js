// src/app/admin/settings/page.js

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Shield, LogOut, Settings, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import ProfileTab from './SettingsTabs/ProfileTab';
import PasswordTab from './SettingsTabs/PasswordTab';
import PreferencesTab from './SettingsTabs/PreferencesTab';
import SecurityTab from './SettingsTabs/SecurityTab';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

// Tab Button Component
const TabButton = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      active
        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </button>
);

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

// Notification component
const Notification = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20';
  const textColor = type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 ${bgColor} p-4 rounded-md shadow-md max-w-sm z-50`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${type === 'success' ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={onClose}
            className={`inline-flex ${textColor} hover:opacity-75`}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminSettings() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [notification, setNotification] = useState(null);
  
  // Initial form states
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    avatar: "",
    bio: "",
    phone: ""
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [preferencesData, setPreferencesData] = useState({
    theme: "system",
    language: "es",
    timezone: "America/New_York",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  });
  
  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    activeSessions: []
  });
  
  const [passwordVisibility, setPasswordVisibility] = useState({
    showPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  // Static data arrays
  const languages = [
    { code: "es", name: "Español" },
    { code: "en", name: "Inglés" },
    { code: "fr", name: "Francés" },
    { code: "de", name: "Alemán" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Portugués" }
  ];

  const timezones = [
    { code: "America/New_York", name: "Hora del Este (EE.UU. y Canadá)" },
    { code: "America/Chicago", name: "Hora Central (EE.UU. y Canadá)" },
    { code: "America/Denver", name: "Hora de Montaña (EE.UU. y Canadá)" },
    { code: "America/Los_Angeles", name: "Hora del Pacífico (EE.UU. y Canadá)" },
    { code: "Europe/London", name: "Londres" },
    { code: "Europe/Paris", name: "París" },
    { code: "Asia/Tokyo", name: "Tokio" }
  ];

  // Tab configuration
  const tabs = [
    { id: "profile", label: "Información de perfil", icon: <User className="h-5 w-5" /> },
    { id: "password", label: "Contraseña", icon: <Lock className="h-5 w-5" /> },
    { id: "preferences", label: "Preferencias", icon: <Settings className="h-5 w-5" /> },
    { id: "security", label: "Seguridad", icon: <Shield className="h-5 w-5" /> }
  ];

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${user.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Populate profile data
        setProfileData({
          name: data.profile.personal.name || "",
          email: data.profile.personal.email || "",
          role: data.profile.personal.role || "",
          avatar: data.profile.personal.avatar || "",
          bio: data.profile.personal.bio || "",
          phone: data.profile.personal.phone || ""
        });
        
        // Populate security data
        setSecurityData({
          twoFactorEnabled: data.profile.security.twoFactorEnabled || false,
          loginAlerts: true, // Default since not provided by API
          activeSessions: data.profile.sessions.map(session => ({
            id: session.id,
            device: session.deviceName,
            ipAddress: session.ipAddress,
            location: session.location,
            lastActive: session.lastActivity,
            startTime: session.startTime,
            userAgent: session.userAgent,
            current: false // Will mark current session later
          }))
        });
        
        // Populate preferences
        const theme = data.profile.preferences.find(pref => pref.key === "theme");
        if (theme) {
          setPreferencesData(prev => ({
            ...prev,
            theme: theme.value
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      showNotification("Error al cargar datos del perfil", "error");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Load profile data when component mounts
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle form changes
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePreferencesChange = (field, value) => {
    setPreferencesData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSecurityChange = (field, value) => {
    setSecurityData(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle session management
  const handleRemoveSession = async (sessionId) => {
    try {
      // Here you would make an API call to revoke the session
      // For now, we'll just update the UI
      setSecurityData(prev => ({
        ...prev,
        activeSessions: prev.activeSessions.filter(session => session.id !== sessionId)
      }));
      showNotification("Sesión cerrada exitosamente");
    } catch (error) {
      console.error("Error removing session:", error);
      showNotification("Error al cerrar la sesión", "error");
    }
  };
  
  const handleCloseAllSessions = async () => {
    try {
      // Here you would make an API call to revoke all sessions except current
      // For now, we'll just update the UI
      const currentSession = securityData.activeSessions.find(s => s.current);
      setSecurityData(prev => ({
        ...prev,
        activeSessions: currentSession ? [currentSession] : []
      }));
      showNotification("Todas las sesiones han sido cerradas");
    } catch (error) {
      console.error("Error closing sessions:", error);
      showNotification("Error al cerrar las sesiones", "error");
    }
  };

  // Form submissions
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
            avatar: `https://api.mywheretogo.com/api/auth/profile/${user.id}`
          })
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        showNotification("Perfil actualizado exitosamente");
      } else {
        throw new Error(data.message || "Error updating profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification(error.message || "Error al actualizar el perfil", "error");
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("Las contraseñas no coinciden", "error");
      return;
    }
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          })
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        showNotification("Contraseña actualizada exitosamente");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        throw new Error(data.message || "Error updating password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showNotification(error.message || "Error al actualizar la contraseña", "error");
    }
  };
  
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      // Update theme preference
      const themeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/preferences/${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            key: "theme",
            value: preferencesData.theme
          })
        }
      );
      
      const themeData = await themeResponse.json();
      
      if (themeData.success) {
        showNotification("Preferencias actualizadas exitosamente");
      } else {
        throw new Error(themeData.message || "Error updating preferences");
      }
      
      // Here you would add more API calls for other preferences if needed
      
    } catch (error) {
      console.error("Error updating preferences:", error);
      showNotification(error.message || "Error al actualizar las preferencias", "error");
    }
  };
  
  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    // Currently there's no direct API for security settings
    showNotification("Configuración de seguridad actualizada");
  };

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
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

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
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-2 h-5 w-5" /> Cerrar sesión
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <div className="col-span-12 md:col-span-9 lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <ProfileTab 
                key="profile"
                formData={profileData}
                onChange={handleProfileChange}
                onSubmit={handleProfileSubmit}
                onAvatarChange={handleAvatarChange}
              />
            )}
            
            {activeTab === "password" && (
              <PasswordTab 
                key="password"
                formData={passwordData}
                visibility={passwordVisibility}
                onChange={handlePasswordChange}
                onToggleVisibility={handlePasswordVisibility}
                onSubmit={handlePasswordSubmit}
              />
            )}
            
            {activeTab === "preferences" && (
              <PreferencesTab 
                key="preferences"
                formData={preferencesData}
                languages={languages}
                timezones={timezones}
                onChange={handlePreferencesChange}
                onSubmit={handlePreferencesSubmit}
              />
            )}
            
            {activeTab === "security" && (
              <SecurityTab 
                key="security"
                formData={securityData}
                onChange={handleSecurityChange}
                onRemoveSession={handleRemoveSession}
                onCloseAllSessions={handleCloseAllSessions}
                onSubmit={handleSecuritySubmit}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}