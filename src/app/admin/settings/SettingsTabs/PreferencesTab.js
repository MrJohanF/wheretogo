import { motion } from "framer-motion";
import { Settings, Sun, Moon, Globe, Clock, Save } from "lucide-react";

export default function PreferencesTab({ formData, languages, timezones, onChange, onSubmit }) {
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
            <Settings className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
            Preferencias
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-6">
          {/* Theme Preference */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Preferencia de Tema</h4>
            <div className="grid grid-cols-3 gap-3">
              {/* Light theme option */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`border rounded-lg p-3 cursor-pointer \${
                  formData.theme === "light" 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => onChange('theme', 'light')}
              >
                <div className="flex justify-center mb-2">
                  <Sun className="h-6 w-6 text-amber-500" />
                </div>
                <div className="text-center">
                  <input 
                    type="radio" 
                    id="theme-light" 
                    name="theme" 
                    value="light" 
                    checked={formData.theme === "light"} 
                    onChange={() => onChange('theme', 'light')}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="theme-light" 
                    className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                  >
                    Claro
                  </label>
                </div>
              </motion.div>

              {/* Dark theme option */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`border rounded-lg p-3 cursor-pointer \${
                  formData.theme === "dark" 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => onChange('theme', 'dark')}
              >
                <div className="flex justify-center mb-2">
                  <Moon className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="text-center">
                  <input 
                    type="radio" 
                    id="theme-dark" 
                    name="theme" 
                    value="dark" 
                    checked={formData.theme === "dark"} 
                    onChange={() => onChange('theme', 'dark')}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="theme-dark" 
                    className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                  >
                    Oscuro
                  </label>
                </div>
              </motion.div>

              {/* System theme option */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`border rounded-lg p-3 cursor-pointer \${
                  formData.theme === "system" 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => onChange('theme', 'system')}
              >
                <div className="flex justify-center mb-2">
                  <div className="h-6 w-6 relative">
                    <Sun className="h-5 w-5 absolute top-0 left-0 text-amber-500" />
                    <Moon className="h-4 w-4 absolute bottom-0 right-0 text-indigo-400" />
                  </div>
                </div>
                <div className="text-center">
                  <input 
                    type="radio" 
                    id="theme-system" 
                    name="theme" 
                    value="system" 
                    checked={formData.theme === "system"} 
                    onChange={() => onChange('theme', 'system')}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="theme-system" 
                    className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                  >
                    Sistema
                  </label>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Language and Timezone */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            {/* Language field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Idioma
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={(e) => onChange('language', e.target.value)}
                  className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                >
                  {languages.map(option => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
            
            {/* Timezone field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Zona Horaria
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={(e) => onChange('timezone', e.target.value)}
                  className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                >
                  {timezones.map(option => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Preferencias de Notificaciones
            </h4>
            <div className="space-y-3">
              {/* Email notifications */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start"
              >
                <div className="flex items-center h-5">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={(e) => onChange('emailNotifications', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="emailNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                    Notificaciones por correo
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Recibir notificaciones por correo sobre la actividad de la cuenta y actualizaciones.
                  </p>
                </div>
              </motion.div>

              {/* Push notifications */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="flex items-start"
              >
                <div className="flex items-center h-5">
                  <input
                    id="pushNotifications"
                    name="pushNotifications"
                    type="checkbox"
                    checked={formData.pushNotifications}
                    onChange={(e) => onChange('pushNotifications', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="pushNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                    Notificaciones push
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Recibir notificaciones push en tu navegador.
                  </p>
                </div>
              </motion.div>

              {/* Marketing emails */}
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-start"
              >
                <div className="flex items-center h-5">
                  <input
                    id="marketingEmails"
                    name="marketingEmails"
                    type="checkbox"
                    checked={formData.marketingEmails}
                    onChange={(e) => onChange('marketingEmails', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingEmails" className="font-medium text-gray-700 dark:text-gray-300">
                    Correos de marketing
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Recibir correos sobre nuevas funciones, productos y servicios.
                  </p>
                </div>
              </motion.div>
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
  );
}