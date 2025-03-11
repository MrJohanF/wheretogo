// src/app/admin/settings/SettingsTabs/SecurityTab.js

import { motion } from "framer-motion";
import { Shield, Save, X, Clock, MapPin, Monitor } from "lucide-react";
import ToggleSwitch from "../../../components/ui/toggle"; // Adjust path as needed

export default function SecurityTab({
  formData,
  onChange,
  onRemoveSession,
  onCloseAllSessions,
  onSubmit,
}) {
  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("es-ES", options);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      onSubmit={onSubmit}
    >
      <motion.div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-6">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mr-3">
              <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </span>
            Opciones de Seguridad
          </h3>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Two Factor Authentication */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-700/40 gap-3 sm:gap-4"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white text-base">
                Autenticación de dos factores
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Añade una capa extra de seguridad a tu cuenta requiriendo un
                código además de tu contraseña
              </p>
            </div>
            <div className="flex items-center self-start sm:self-center mt-2 sm:mt-0 shrink-0">
              {/* Toggle replaced with the new ToggleSwitch component */}
              <ToggleSwitch
                id="twoFactorEnabled"
                name="twoFactorEnabled"
                checked={formData.twoFactorEnabled}
                onChange={(value) => onChange("twoFactorEnabled", value)}
                enabledText="Activado"
                disabledText="Desactivado"
                ariaLabel="Toggle two-factor authentication"
              />
            </div>
          </motion.div>

          {/* Login Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-700/40 gap-3 sm:gap-4"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white text-base">
                Alertas de inicio de sesión
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Recibe notificaciones cuando alguien inicie sesión en tu cuenta
                desde un nuevo dispositivo o ubicación
              </p>
            </div>

            <div className="flex items-center self-start sm:self-center mt-2 sm:mt-0 shrink-0">
              {/* Toggle replaced with the new ToggleSwitch component */}
              <ToggleSwitch
                id="loginAlerts"
                name="loginAlerts"
                checked={formData.loginAlerts}
                onChange={(value) => onChange("loginAlerts", value)}
                enabledText="Activado"
                disabledText="Desactivado"
                ariaLabel="Toggle login alerts"
              />
            </div>
          </motion.div>
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
            Guardar Configuración de Seguridad
          </motion.button>
        </div>
      </motion.div>

      {/* Active Sessions */}
      <motion.div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
            <span className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg mr-3">
              <Monitor className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </span>
            Sesiones Activas
          </h3>
        </div>
        <div className="px-6 py-6">
          <div className="space-y-4">
            {formData.activeSessions.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Monitor className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
                  No se encontraron sesiones activas
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Cuando inicies sesión en diferentes dispositivos, aparecerán
                  aquí
                </p>
              </div>
            ) : (
              formData.activeSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 border rounded-xl \${
                    session.current
                      ? "border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 dark:border-green-800/30"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center text-base">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">
                            Sesión Actual
                          </span>
                        )}
                      </h4>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm flex items-center text-gray-500 dark:text-gray-400">
                          <svg
                            className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-3.757-4.243z"
                              clipRule="evenodd"
                            />
                            <path d="M12 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {session.ipAddress}
                        </p>
                        <p className="text-sm flex items-center text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                          {session.location}
                        </p>
                        <p className="text-sm flex items-center text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1.5 text-gray-400 dark:text-gray-500" />
                          Última actividad: {formatDate(session.lastActive)}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => onRemoveSession(session.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 p-2 rounded-full"
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

          {formData.activeSessions.length > 1 && (
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                onClick={onCloseAllSessions}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Cerrar Todas las Otras Sesiones
              </motion.button>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                Esta acción cerrará todas las sesiones excepto la actual
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 sm:px-6 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formData.activeSessions.length} sesión
            {formData.activeSessions.length !== 1 ? "es" : ""} activa
            {formData.activeSessions.length !== 1 ? "s" : ""}
          </span>

          {/* This is blank to maintain the justify-between spacing */}
          <div></div>
        </div>
      </motion.div>
    </motion.form>
  );
}