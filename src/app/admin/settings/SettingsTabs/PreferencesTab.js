// src/app/admin/settings/SettingsTabs/PreferencesTab.js

import { motion } from "framer-motion";
import { Settings, Sun, Moon, Globe, Clock, Save, Bell } from "lucide-react";

export default function PreferencesTab({
  formData,
  languages,
  timezones,
  onChange,
  onSubmit,
}) {
  // Helper function to safely access nested notification preferences
  const getNotificationValue = (key) => {
    return formData.notificationPreferences &&
      typeof formData.notificationPreferences === "object"
      ? formData.notificationPreferences[key]
      : false;
  };

  // Helper function to update nested notification preferences
  const handleNotificationChange = (key, value) => {
    onChange("notificationPreferences", {
      ...formData.notificationPreferences,
      [key]: value,
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      onSubmit={onSubmit}
    >
      <motion.div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mr-3">
              <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </span>
            Preferencias
          </h3>
        </div>

        <div className="px-6 py-6 space-y-8">
{/* Theme Preference */}
<section>
  <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">Preferencia de Tema</h4>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {[
      { id: "Claro", icon: <Sun className="h-7 w-7 text-amber-500" />, label: "Claro", 
        bgClass: "from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/5" },
      { id: "Oscuro", icon: <Moon className="h-7 w-7 text-indigo-400" />, label: "Oscuro",
        bgClass: "from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/5" },
      { id: "Sistema", icon: (
        <div className="h-7 w-7 relative">
          <Sun className="h-5 w-5 absolute top-0 left-0 text-amber-500" />
          <Moon className="h-5 w-5 absolute bottom-0 right-0 text-indigo-400" />
        </div>
      ), label: "Sistema", bgClass: "from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-700/40" }
    ].map(theme => (
      <div
        key={theme.id}
        onClick={() => onChange('themePreference', theme.id)}
        className={`group border rounded-xl p-4 cursor-pointer transition-all duration-150 hover:-translate-y-1 
          ${formData.themePreference === theme.id 
            ? 'border-indigo-400 ring-2 ring-indigo-500/20 shadow-md' 
            : 'border-gray-200 dark:border-gray-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow'
          }`}
      >
        <div className={`flex justify-center items-center h-16 mb-3 rounded-lg bg-gradient-to-r ${theme.bgClass} transition-transform duration-150 group-hover:scale-[1.03]`}>
          {theme.icon}
        </div>
        <div className="text-center">
          <input 
            type="radio" 
            id={`theme-${theme.id.toLowerCase()}`} 
            name="themePreference" 
            value={theme.id} 
            checked={formData.themePreference === theme.id} 
            onChange={() => onChange('themePreference', theme.id)}
            className="sr-only"
          />
          <label 
            htmlFor={`theme-${theme.id.toLowerCase()}`} 
            className="text-base font-medium text-gray-900 dark:text-white cursor-pointer"
          >
            {theme.label}
          </label>
          {formData.themePreference === theme.id && (
            <div className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium animate-fadeIn">
              Seleccionado
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</section>

          {/* Language and Timezone */}
          <section>
            <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4">
              Región y Localización
            </h4>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              {/* Language field */}
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Idioma
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-indigo-400" />
                  </div>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={(e) => onChange("language", e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
                  >
                    {languages.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Timezone field */}
              <div>
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Zona Horaria
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <select
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={(e) => onChange("timezone", e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
                  >
                    {timezones.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section>
            <div className="flex items-center mb-4">
              <span className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-2">
                <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </span>
              <h4 className="text-base font-medium text-gray-900 dark:text-white">
                Preferencias de Notificaciones
              </h4>
            </div>

            <div className="space-y-5 mt-4 pl-2">
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
                    checked={getNotificationValue("emailNotifications")}
                    onChange={(e) =>
                      handleNotificationChange(
                        "emailNotifications",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="emailNotifications"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Notificaciones por correo
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Recibir notificaciones por correo sobre la actividad de la
                    cuenta y actualizaciones.
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
                    checked={getNotificationValue("pushNotifications")}
                    onChange={(e) =>
                      handleNotificationChange(
                        "pushNotifications",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="pushNotifications"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Notificaciones push
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Recibir notificaciones push en tu navegador cuando la
                    aplicación esté abierta.
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
                    checked={getNotificationValue("marketingEmails")}
                    onChange={(e) =>
                      handleNotificationChange(
                        "marketingEmails",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="marketingEmails"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    Correos de marketing
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Recibir correos sobre nuevas funciones, productos y
                    servicios.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        </div>

        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 text-right">
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg shadow font-medium flex items-center ml-auto"
          >
            <Save size={18} className="mr-2" />
            Guardar Preferencias
          </motion.button>
        </div>
      </motion.div>
    </motion.form>
  );
}
