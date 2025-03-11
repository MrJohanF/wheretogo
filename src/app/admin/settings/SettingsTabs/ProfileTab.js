// src/app/admin/settings/SettingsTabs/ProfileTab.js

import { motion } from "framer-motion";
import { User, Mail, Save, Camera, Phone, BriefcaseBusiness } from "lucide-react";
import { useState } from "react";

export default function ProfileTab({ formData, onChange, onSubmit, onAvatarChange }) {
  // State to track form errors
  const [errors, setErrors] = useState({});
  
  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Clear any previous errors
      setErrors({});
      
      // Call parent onSubmit
      onSubmit(e);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };
  
  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
    >
      <motion.div 
        className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mr-3">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </span>
            Información del Perfil
          </h3>
        </div>
        
        {/* Avatar section */}
        <div className="px-6 py-6 space-y-6">
          <div className="flex items-center">
            <div className="mr-6 relative group">
              <motion.div 
                whileHover={{ boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.3)" }}
                className="h-28 w-28 rounded-full overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-4 border-white dark:border-gray-700 shadow-md"
              >
                {formData.avatar ? (
                  <img 
                    src={formData.avatar}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </motion.div>
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute -bottom-2 -right-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-3 cursor-pointer shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 group-hover:scale-110"
              >
                <Camera className="w-5 h-5 text-white" />
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={onAvatarChange}
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">Foto de Perfil</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                JPG, GIF o PNG. Máximo 1MB.
              </p>
              <motion.p 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-xs mt-2 text-indigo-600 dark:text-indigo-400 font-medium"
              >
                Una buena foto de perfil ayuda a construir confianza con otros usuarios
              </motion.p>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Name field */}
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre Completo
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-400 dark:text-indigo-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={(e) => onChange('name', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>
            
            {/* Email field */}
            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Correo Electrónico
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-400 dark:text-indigo-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={(e) => onChange('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Phone field */}
            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Número de Teléfono
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-indigo-400 dark:text-indigo-500" />
                </div>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={(e) => onChange('phone', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>

            {/* Role field */}
            <div className="sm:col-span-3">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rol
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BriefcaseBusiness className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role || ''}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700 dark:text-gray-300 cursor-not-allowed block w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                El rol es asignado por el administrador del sistema
              </p>
            </div>

            {/* Bio field */}
            <div className="sm:col-span-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Biografía
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio || ''}
                  onChange={(e) => onChange('bio', e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Cuéntanos un poco sobre ti..."
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {formData.bio ? formData.bio.length : 0} / 200
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Breve descripción para tu perfil. Máximo 200 caracteres.
              </p>
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 text-right">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow font-medium flex items-center ml-auto"
          >
            <Save size={18} className="mr-2" />
            Guardar Perfil
          </motion.button>
        </div>
      </motion.div>
    </motion.form>
  );
}