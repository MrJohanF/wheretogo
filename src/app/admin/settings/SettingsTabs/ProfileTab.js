import { motion } from "framer-motion";
import { User, Mail, Save, Camera } from "lucide-react";
import { useState } from "react";

export default function ProfileTab({ formData, onChange, onSubmit, onAvatarChange }) {
  // State to track form errors
  const [errors, setErrors] = useState({});
  
  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Filter out invalid avatar values before submission
      const submissionData = {
        ...formData,
        // Only include avatar if it's a valid URL or null if empty
        avatar: formData.avatar && (
          formData.avatar.startsWith('http://') || 
          formData.avatar.startsWith('https://') || 
          formData.avatar.startsWith('data:image/')
        ) ? formData.avatar : null
      };
      
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
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
            Información del Perfil
          </h3>
        </div>
        
        {/* Avatar section */}
        <div className="px-4 py-5 sm:p-6 space-y-6">
          <div className="flex items-center">
            <div className="mr-4 relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
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
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                )}
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
                onChange={onAvatarChange}
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Foto de Perfil</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                JPG, GIF o PNG. Máximo 1MB.
              </p>
              {errors.avatar && (
                <p className="text-sm text-red-500 mt-1">{errors.avatar}</p>
              )}
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Name field */}
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre Completo
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={(e) => onChange('name', e.target.value)}
                  className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            {/* Email field */}
            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo Electrónico
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={(e) => onChange('email', e.target.value)}
                  className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Phone field */}
            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Número de Teléfono
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={(e) => onChange('phone', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Role field */}
            <div className="sm:col-span-3">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rol
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role || ''}
                  disabled
                  className="bg-gray-50 dark:bg-gray-600 dark:text-gray-300 cursor-not-allowed block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm"
                />
              </div>
            </div>

            {/* Bio field */}
            <div className="sm:col-span-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Biografía
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => onChange('bio', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Breve descripción para tu perfil.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form actions */}
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
  );
}