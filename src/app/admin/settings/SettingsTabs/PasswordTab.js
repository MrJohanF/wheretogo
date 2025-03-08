import { motion } from "framer-motion";
import { Lock, Key, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function PasswordTab({ formData, visibility, onChange, onToggleVisibility, onSubmit }) {
  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      onSubmit={onSubmit}
    >
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
            <Lock className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
            Cambiar Contraseña
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña Actual
            </label>
            <div className="mt-1 relative">
              <input
                type={visibility.showPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={(e) => onChange('currentPassword', e.target.value)}
                className="block w-full pr-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => onToggleVisibility('showPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {visibility.showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nueva Contraseña
            </label>
            <div className="mt-1 relative">
              <input
                type={visibility.showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={(e) => onChange('newPassword', e.target.value)}
                className="block w-full pr-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => onToggleVisibility('showNewPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {visibility.showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar Contraseña
            </label>
            <div className="mt-1 relative">
              <input
                type={visibility.showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => onChange('confirmPassword', e.target.value)}
                className="block w-full pr-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => onToggleVisibility('showConfirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {visibility.showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
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
  );
}