import { useState, useEffect, useRef } from "react";
import { AlertCircle, AlertTriangle, Info, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "delete", // 'delete', 'warning', 'info'
  isConfirmLoading = false,
}) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Handle portal mounting for SSR compatibility
  useEffect(() => {
    setMounted(true);
    
    // Add escape key listener
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);
  
  // Focus trap and scroll lock
  useEffect(() => {
    if (isOpen) {
      // Lock scroll
      document.body.style.overflow = "hidden";
      // Focus the cancel button
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const typeConfig = {
    delete: {
      icon: <AlertCircle className="stroke-[2.5]" />,
      iconClass: "bg-red-100/80 text-red-600 ring-red-600/20",
      buttonClass: "bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500/40",
      title: title || "Confirm Deletion",
    },
    warning: {
      icon: <AlertTriangle className="stroke-[2.5]" />,
      iconClass: "bg-amber-100/80 text-amber-600 ring-amber-600/20",
      buttonClass: "bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500/40",
      title: title || "Warning",
    },
    info: {
      icon: <Info className="stroke-[2.5]" />,
      iconClass: "bg-blue-100/80 text-blue-600 ring-blue-600/20",
      buttonClass: "bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500/40",
      title: title || "Information",
    },
  };
  
  const config = typeConfig[type] || typeConfig.delete;

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-gray-900/50 dark:bg-black/60"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
        >
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            {/* Modal Panel */}
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30 
              }}
              className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 text-left shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 sm:my-8 sm:max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.94 }}
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 z-10"
                aria-label="Close"
              >
                <X size={18} />
              </motion.button>
              
              <div className="p-6 sm:p-8">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${config.iconClass} ring-4 sm:mx-0 sm:h-12 sm:w-12`}>
                    {config.icon}
                  </div>
                  <div className="mt-4 text-center sm:ml-6 sm:mt-0 sm:text-left">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
                      {config.title}
                    </h3>
                    <div className="mt-3">
                      <p className="text-base text-gray-600 dark:text-gray-300">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 sm:flex sm:flex-row-reverse gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className={`inline-flex w-full justify-center rounded-lg border border-transparent px-5 py-2.5 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-3 focus:ring-offset-2 sm:w-auto ${config.buttonClass} ${isConfirmLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                    onClick={onConfirm}
                    disabled={isConfirmLoading}
                  >
                    {isConfirmLoading ? (
                      <span className="inline-flex items-center">
                        <Loader2 size={18} className="animate-spin mr-2" />
                        Processing...
                      </span>
                    ) : confirmText}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-5 py-2.5 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    {cancelText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}