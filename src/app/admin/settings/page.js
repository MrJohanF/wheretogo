// src/app/admin/settings/page.js

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Shield,
  LogOut,
  Settings,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import ProfileTab from "./SettingsTabs/ProfileTab";
import PasswordTab from "./SettingsTabs/PasswordTab";
import PreferencesTab from "./SettingsTabs/PreferencesTab";
import SecurityTab from "./SettingsTabs/SecurityTab";

// Animation variants - faster and snappier
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const slideIn = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.2 } },
};

// Improved tab transition variants
const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 },
  },
};

// Improved Tab Button Component
const TabButton = ({ active, icon, label, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ x: 3 }}
    whileTap={{ scale: 0.97 }}
    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
      active
        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-l-2 border-indigo-500"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
    }`}
  >
    <span className={active ? "text-indigo-600" : "text-gray-500"}>{icon}</span>
    <span className="ml-2">{label}</span>

    {active && (
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 500 }}
        className="ml-auto text-indigo-500"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    )}
  </motion.button>
);

// Improved Loading component with spring animation
const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: 1,
      transition: { duration: 0.2 },
    }}
    className="flex flex-col items-center justify-center min-h-[60vh]"
  >
    <motion.div
      initial={{ rotate: 0 }}
      animate={{
        rotate: 360,
        transition: {
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        },
      }}
      className="w-12 h-12 rounded-full border-3 border-indigo-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400"
    />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.1 },
      }}
      className="mt-4 text-gray-600 dark:text-gray-400 text-base"
    >
      Cargando configuración...
    </motion.p>
  </motion.div>
);

// Improved Notification with spring animation
const Notification = ({ message, type, onClose }) => {
  const bgColor =
    type === "success"
      ? "bg-green-50 dark:bg-green-900/20"
      : "bg-red-50 dark:bg-red-900/20";
  const textColor =
    type === "success"
      ? "text-green-800 dark:text-green-300"
      : "text-red-800 dark:text-red-300";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 25,
        },
      }}
      exit={{
        opacity: 0,
        y: -10,
        transition: {
          duration: 0.2,
        },
      }}
      className={`fixed top-4 right-4 ${bgColor} p-3 rounded-lg shadow-md max-w-sm z-50`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon
            className={`h-5 w-5 ${
              type === "success" ? "text-green-500" : "text-red-500"
            }`}
          />
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
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
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
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferencesData, setPreferencesData] = useState({
    themePreference: "Claro",
    language: "Español",
    timezone: "Bogotá, Colombia",
    notificationPreferences: {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
    },
  });

  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    activeSessions: [],
  });

  const [passwordVisibility, setPasswordVisibility] = useState({
    showPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  // Static data arrays
  const languages = [
    { code: "Español", name: "Español" },
    { code: "English", name: "Inglés" },
    { code: "Français", name: "Francés" },
    { code: "Deutsch", name: "Alemán" },
    { code: "Italiano", name: "Italiano" },
    { code: "Português", name: "Portugués" },
  ];

  const timezones = [
    { code: "Bogotá, Colombia", name: "Bogotá, Colombia" },
    { code: "America/New_York", name: "Hora del Este (EE.UU. y Canadá)" },
    { code: "America/Chicago", name: "Hora Central (EE.UU. y Canadá)" },
    { code: "America/Denver", name: "Hora de Montaña (EE.UU. y Canadá)" },
    {
      code: "America/Los_Angeles",
      name: "Hora del Pacífico (EE.UU. y Canadá)",
    },
    { code: "Europe/London", name: "Londres" },
    { code: "Europe/Paris", name: "París" },
    { code: "Asia/Tokyo", name: "Tokio" },
  ];

  // Tab configuration
  const tabs = [
    {
      id: "profile",
      label: "Información de perfil",
      icon: <User className="h-5 w-5" />,
    },
    { id: "password", label: "Contraseña", icon: <Lock className="h-5 w-5" /> },
    {
      id: "preferences",
      label: "Preferencias",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: "security",
      label: "Seguridad",
      icon: <Shield className="h-5 w-5" />,
    },
  ];

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Extract preferences from the response
  const extractPreferences = useCallback((preferences) => {
    const result = {
      themePreference: "Claro",
      language: "Español",
      timezone: "Bogotá, Colombia",
      notificationPreferences: {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
      },
    };

    // Map preferences to state object if preferences exist
    if (preferences && Array.isArray(preferences)) {
      preferences.forEach((pref) => {
        if (pref && typeof pref.value === "object" && pref.value !== null) {
          result[pref.key] = pref.value;
        } else if (pref && pref.key in result) {
          result[pref.key] = pref.value;
        }
      });
    }

    return result;
  }, []);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    // Skip fetching if no user ID is available yet
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
   
      const mockData = {
        success: true,
        profile: {
          personal: {
            name: user.name || "Usuario WhereToGo",
            email: user.email || "usuario@wheretogo.com",
            role: "Usuario",
            avatar: user.avatar || "",
            bio: "Apasionado por descubrir nuevos lugares y compartir experiencias.",
            phone: "+57 300 123 4567",
          },
          security: {
            twoFactorEnabled: false,
            loginAlerts: true,
          },
          sessions: [
            {
              id: 1,
              deviceName: "Chrome en Windows",
              ipAddress: "192.168.1.1",
              location: "Bogotá, Colombia",
              lastActivity: new Date().toISOString(),
              startTime: new Date().toISOString(),
              userAgent: "Chrome 98.0.4758.102",
              current: true,
            },
          ],
          preferences: [
            { key: "themePreference", value: "Claro" },
            { key: "language", value: "Español" },
            { key: "timezone", value: "Bogotá, Colombia" },
            {
              key: "notificationPreferences",
              value: {
                emailNotifications: true,
                pushNotifications: true,
                marketingEmails: false,
              },
            },
          ],
        },
      };

 
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
          phone: data.profile.personal.phone || "",
        });

        // Populate security data
        setSecurityData({
          twoFactorEnabled: data.profile.security.twoFactorEnabled || false,
          loginAlerts: data.profile.security.loginAlerts || true,
          activeSessions: data.profile.sessions.map((session) => ({
            id: session.id,
            device: session.deviceName,
            ipAddress: session.ipAddress,
            location: session.location,
            lastActive: session.lastActivity,
            startTime: session.startTime,
            userAgent: session.userAgent,
            // Mark current session (this is an approximation)
            current: session.current || false,
          })),
        });

        // Extract preferences with proper fallbacks
        setPreferencesData(extractPreferences(data.profile.preferences));
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      showNotification("Error al cargar datos del perfil", "error");
    } finally {
      setIsLoading(false);
    }
  }, [user, extractPreferences]);

  // Load profile data when component mounts
  useEffect(() => {
    fetchUserProfile();
    // Only re-fetch when user ID changes
  }, [fetchUserProfile]);

  // Handle form changes
  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (field, value) => {
    setPreferencesData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurityData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle session management
  const handleRemoveSession = async (sessionId) => {
    try {
      // For development, we'll mock the API call

      // Remove session from state
      setSecurityData((prev) => ({
        ...prev,
        activeSessions: prev.activeSessions.filter(
          (session) => session.id !== sessionId
        ),
      }));

      showNotification("Sesión cerrada exitosamente");

      // Uncomment when API is ready
      /*
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to end session");
      }
      */
    } catch (error) {
      console.error("Error removing session:", error);
      showNotification("Error al cerrar la sesión", "error");
    }
  };

  const handleCloseAllSessions = async () => {
    try {
      // For development, we'll mock the API call

      // Keep only current session in the UI
      const currentSession = securityData.activeSessions.find((s) => s.current);
      setSecurityData((prev) => ({
        ...prev,
        activeSessions: currentSession ? [currentSession] : [],
      }));

      showNotification("Todas las sesiones han sido cerradas");

      // Uncomment when API is ready
      /*
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sessions`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to end all sessions");
      }
      */
    } catch (error) {
      console.error("Error closing sessions:", error);
      showNotification("Error al cerrar las sesiones", "error");
    }
  };

  // Form submissions
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      // For development, we'll mock the API call
      showNotification("Perfil actualizado exitosamente");

      // Uncomment when API is ready
      /*
      // Prepare data for submission
      const submitData = {
        name: profileData.name,
        email: profileData.email,
        // Only send avatar if it's a valid URL
        ...(profileData.avatar ? { avatar: profileData.avatar } : { avatar: null })
      };
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${user.id}/personal`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(submitData)
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating profile");
      }
      
      const data = await response.json();
      
      if (data.success) {
        showNotification("Perfil actualizado exitosamente");
      } else {
        throw new Error(data.message || "Error updating profile");
      }
      */
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification(
        error.message || "Error al actualizar el perfil",
        "error"
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification("Las contraseñas no coinciden", "error");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${user.id}/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating password");
      }
      
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
      showNotification(
        error.message || "Error al actualizar la contraseña",
        "error"
      );
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${user.id}/preferences`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            themePreference: preferencesData.themePreference,
            language: preferencesData.language,
            timezone: preferencesData.timezone,
            notificationPreferences: preferencesData.notificationPreferences
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating preferences");
      }
      
      const data = await response.json();
      
      if (data.success) {
        showNotification("Preferencias actualizadas exitosamente");
      } else {
        throw new Error(data.message || "Error updating preferences");
      }
      
    } catch (error) {
      console.error("Error updating preferences:", error);
      showNotification(
        error.message || "Error al actualizar las preferencias",
        "error"
      );
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();

    try {   
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${user.id}/security`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            loginAlerts: securityData.loginAlerts
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating security settings");
      }
      
      const data = await response.json();
      
      if (data.success) {
        showNotification("Configuración de seguridad actualizada exitosamente");
      } else {
        throw new Error(data.message || "Error updating security settings");
      }
      
    } catch (error) {
      console.error("Error updating security settings:", error);
      showNotification(
        error.message || "Error al actualizar configuración de seguridad",
        "error"
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-30 dark:opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto relative"
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

        {/* Header - with staggered animation */}
        <motion.div variants={fadeIn} className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Configuración de Cuenta
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2 }}
            className="mt-1 text-sm text-gray-600 dark:text-gray-400"
          >
            Gestiona tu perfil, preferencias y seguridad de cuenta
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation - with faster animation */}
          <motion.div
            variants={slideIn}
            className="col-span-12 md:col-span-3 lg:col-span-3 md:sticky md:top-24 self-start"
          >
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="px-4 py-5 sm:p-6 space-y-1">
                {tabs.map((tab, index) => (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.15 }}
                  >
                    <TabButton
                      active={activeTab === tab.id}
                      icon={tab.icon}
                      label={tab.label}
                      onClick={() => setActiveTab(tab.id)}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5">
                <motion.button
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                >
                  <LogOut className="mr-2 h-5 w-5" /> Cerrar sesión
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area - with improved tab transitions */}
          <div className="col-span-12 md:col-span-9 lg:col-span-9">
          <div className="min-h-[680px]">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ProfileTab
                    formData={profileData}
                    onChange={handleProfileChange}
                    onSubmit={handleProfileSubmit}
                    onAvatarChange={handleAvatarChange}
                  />
                </motion.div>
              )}

              {activeTab === "password" && (
                <motion.div
                  key="password"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <PasswordTab
                    formData={passwordData}
                    visibility={passwordVisibility}
                    onChange={handlePasswordChange}
                    onToggleVisibility={handlePasswordVisibility}
                    onSubmit={handlePasswordSubmit}
                  />
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <PreferencesTab
                    formData={preferencesData}
                    languages={languages}
                    timezones={timezones}
                    onChange={handlePreferencesChange}
                    onSubmit={handlePreferencesSubmit}
                  />
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <SecurityTab
                    formData={securityData}
                    onChange={handleSecurityChange}
                    onRemoveSession={handleRemoveSession}
                    onCloseAllSessions={handleCloseAllSessions}
                    onSubmit={handleSecuritySubmit}
                  />
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </>
  );
}
