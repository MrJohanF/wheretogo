// src/app/admin/settings/SettingsTabs/SecurityTab.js

import { motion } from "framer-motion";
import { Shield, Save, X } from "lucide-react";

export default function SecurityTab({ formData, onChange, onRemoveSession, onCloseAllSessions, onSubmit }) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      onSubmit={onSubmit}
    >
      <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
            Opciones de Seguridad
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-4">
          {/* Two Factor Authentication */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Autenticación de dos factores</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Añade una capa extra de seguridad a tu cuenta
              </p>
            </div>
            <div className="flex items-center">
              <input
                id="twoFactorEnabled"
                name="twoFactorEnabled"
                type="checkbox"
                checked={formData.twoFactorEnabled}
                onChange={(e) => onChange('twoFactorEnabled', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="twoFactorEnabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {formData.twoFactorEnabled ? "Activado" : "Desactivado"}
              </label>
            </div>
          </motion.div>

          {/* Login Alerts */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Alertas de inicio de sesión</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recibe notificaciones cuando alguien inicie sesión en tu cuenta
              </p>
            </div>
            <div className="flex items-center">
              <input
                id="loginAlerts"
                name="loginAlerts"
                type="checkbox"
                checked={formData.loginAlerts}
                onChange={(e) => onChange('loginAlerts', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="loginAlerts" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {formData.loginAlerts ? "Activado" : "Desactivado"}
              </label>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Active Sessions */}
      <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Sesiones Activas
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            {formData.activeSessions.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron sesiones activas
                </p>
              </div>
            ) : (
              formData.activeSessions.map((session, index) => (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border rounded-lg ${
                    session.current 
                      ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/10' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Actual
                          </span>
                        )}
                      </h4>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Dirección IP: {session.ipAddress}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ubicación: {session.location}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Última Actividad: {new Date(session.lastActive).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => onRemoveSession(session.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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
        </div>
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/40 sm:px-6 flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formData.activeSessions.length} sesión{formData.activeSessions.length !== 1 ? 'es' : ''} activa{formData.activeSessions.length !== 1 ? 's' : ''}
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
            onClick={onCloseAllSessions}
          >
            Cerrar Todas las Otras Sesiones
          </motion.button>
        </div>
      </motion.div>
      
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/40 mt-6 rounded-lg text-right">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="px-5 py-2 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm font-medium flex items-center ml-auto"
        >
          <Save size={18} className="mr-2" />
          Guardar Configuración de Seguridad
        </motion.button>
      </div>
    </motion.form>
  );
}
