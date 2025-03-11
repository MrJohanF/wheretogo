// src/app/admin/settings/SettingsTabs/PasswordTab.js

import { motion } from "framer-motion";
import { Lock, Key, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function PasswordTab({ formData, visibility, onChange, onToggleVisibility, onSubmit }) {
  // Function to determine password strength
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    // Simple password strength calculation
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#\$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const score = [hasLowercase, hasUppercase, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length;
    
    // Map score to strength level
    const strengthMap = {
      0: { strength: 0, label: '', color: '' },
      1: { strength: 1, label: 'Muy débil', color: 'bg-red-500 w-1/5' },
      2: { strength: 2, label: 'Débil', color: 'bg-orange-500 w-2/5' },
      3: { strength: 3, label: 'Regular', color: 'bg-yellow-500 w-3/5' },
      4: { strength: 4, label: 'Buena', color: 'bg-lime-500 w-4/5' },
      5: { strength: 5, label: 'Excelente', color: 'bg-green-500 w-full' }
    };
    
    return strengthMap[score];
  };
  
  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      onSubmit={onSubmit}
    >
      <motion.div 
        className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mr-3">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </span>
            Cambiar Contraseña
          </h3>
        </div>
        
        <div className="px-6 py-6 space-y-6">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña Actual
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type={visibility.showPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={(e) => onChange('currentPassword', e.target.value)}
                className="block w-full pl-10 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ingresa tu contraseña actual"
              />
              <button
                type="button"
                onClick={() => onToggleVisibility('showPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {visibility.showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nueva Contraseña
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type={visibility.showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={(e) => onChange('newPassword', e.target.value)}
                className="block w-full pl-10 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ingresa tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => onToggleVisibility('showNewPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {visibility.showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
            
            {formData.newPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2"
              >
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className={`h-2.5 rounded-full ${passwordStrength.color}`}></div>
                  </div>
                  <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {passwordStrength.label}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type={visibility.showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                className={`block w-full pl-10 pr-10 rounded-lg border ${
                  formData.newPassword && 
                  formData.confirmPassword && 
                  formData.newPassword !== formData.confirmPassword 
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                } py-2.5 shadow-sm dark:bg-gray-700 dark:text-white`}
                placeholder="Confirma tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => onToggleVisibility('showConfirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {visibility.showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
            {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-sm text-red-500"
              >
                Las contraseñas no coinciden
              </motion.p>
            )}
          </div>

          {/* Password Requirements */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-4 border border-amber-200 dark:border-amber-800/30"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Requisitos de contraseña:</h3>
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-200">
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
        
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 text-right">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow font-medium flex items-center ml-auto"
          >
            <Key size={18} className="mr-2" />
            Actualizar Contraseña
          </motion.button>
        </div>
      </motion.div>
    </motion.form>
  );
}