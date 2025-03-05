import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "delete", // Can be 'delete', 'warning', 'info'
}) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "delete":
        return {
          icon: "bg-red-100 text-red-600",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: "bg-yellow-100 text-yellow-600",
          button: "bg-yellow-600 hover:bg-yellow-700",
        };
      case "info":
        return {
          icon: "bg-blue-100 text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
        };
      default:
        return {
          icon: "bg-red-100 text-red-600",
          button: "bg-red-600 hover:bg-red-700",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
      >
        <div className="flex items-start mb-4">
          <div className={`rounded-full p-2 ${styles.icon}`}>
            <AlertCircle size={24} />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${styles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
} 