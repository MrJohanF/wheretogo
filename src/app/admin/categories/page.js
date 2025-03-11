// src\app\admin\categories\page.js

"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  ChevronRight,
  X,
  Star,
  Coffee,
  Utensils,
  Beer,
  Building,
  TreeDeciduous,
  Film,
  Music,
  Volleyball,
  ShoppingBag,
  Calendar,
  Hotel,
  Waves,
  ChevronLeft,
  ChevronDown,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import CategoryForm from "./components/CategoryForm";
import useCategoriesStore from "@/app/admin/store/useCategoryStore";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const slideUp = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30, 
      duration: 0.3 
    } 
  },
};

const rowFadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

/**
 * Categories Management Component
 * Handles all operations related to category management including:
 * - Listing, searching, and filtering categories
 * - Adding, editing, and deleting categories
 * - Managing subcategories
 */
export default function CategoriesManagement() {
  const router = useRouter();
  
  // Access global state from Zustand store
  const {
    // Core state
    loading,
    error,
    categories,
    searchTerm,

    // Pagination state
    currentPage,
    itemsPerPage,
    
    // Category CRUD state
    isAddingCategory,
    isEditingCategory,
    currentCategory,
    showDeleteConfirm,
    categoryToDelete,

    // Subcategory state
    viewingSubcategories,
    selectedCategory,
    isAddingSubcategory,
    isEditingSubcategory,
    currentSubcategory,
    showDeleteSubcategoryConfirm,
    subcategoryToDelete,
    
    // Form data
    formData,
    subcategoryFormData,
    
    // Derived data
    getFilteredCategories,
    
    // Actions
    fetchCategories,
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
    initAddCategory,
    initEditCategory,
    cancelCategoryForm,
    handleInputChange,
    handleIconSelect,
    handleImageSelect,
    saveCategory,
    initDeleteCategory,
    cancelDeleteCategory,
    confirmDeleteCategory,
    toggleTrendingStatus,
    viewSubcategories,
    exitSubcategoriesView,
    initAddSubcategory,
    initEditSubcategory,
    cancelSubcategoryForm,
    handleSubcategoryInputChange,
    saveSubcategory,
    initDeleteSubcategory,
    cancelDeleteSubcategory,
    confirmDeleteSubcategory,
    isUploading,
  } = useCategoriesStore();

  // Available icons for categories
  const iconOptions = useMemo(() => [
    { name: "Coffee", icon: <Coffee size={20} /> },
    { name: "Utensils", icon: <Utensils size={20} /> },
    { name: "Beer", icon: <Beer size={20} /> },
    { name: "Building", icon: <Building size={20} /> },
    { name: "TreeDeciduous", icon: <TreeDeciduous size={20} /> },
    { name: "Film", icon: <Film size={20} /> },
    { name: "Music", icon: <Music size={20} /> },
    { name: "Football", icon: <Volleyball size={20} /> },
    { name: "ShoppingBag", icon: <ShoppingBag size={20} /> },
    { name: "Calendar", icon: <Calendar size={20} /> },
    { name: "Hotel", icon: <Hotel size={20} /> },
    { name: "Waves", icon: <Waves size={20} /> },
  ], []);

  // Get filtered and paginated data
  const filteredCategories = getFilteredCategories();
  const totalItems = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Get current page items
  const currentCategories = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredCategories, currentPage, itemsPerPage]);

  /**
   * Fetch categories from API on component mount
   */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Generate pagination buttons
  const renderPaginationButtons = useMemo(() => {
    const buttons = [];
    
    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-700"
        }`}
      >
        1
      </button>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis1" className="px-2">
          ...
        </span>
      );
    }
    
    // Show current page and neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last as they're always shown
      
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? "bg-indigo-100 text-indigo-700 font-medium"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="ellipsis2" className="px-2">
          ...
        </span>
      );
    }
    
    // Always show last page if it's not the first page
    if (totalPages > 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "bg-indigo-100 text-indigo-700 font-medium"
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          {totalPages}
        </button>
      );
    }
    
    return buttons;
  }, [currentPage, totalPages, setCurrentPage]);

  // Memoize page info text to avoid re-renders
  const pageInfoText = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return `Mostrando ${start} a ${end} de ${totalItems} categorías`;
  }, [currentPage, itemsPerPage, totalItems]);

  return (
    <div className="h-full bg-gray-50 text-gray-800">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="p-6 max-w-7xl mx-auto"
      >
        {/* Header with appropriate title based on current view */}
        <div className="flex items-center justify-between mb-8">
          {viewingSubcategories ? (
            <div className="flex items-center">
              <button
                onClick={exitSubcategoriesView}
                className="mr-2 p-2 rounded-full hover:bg-gray-200"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold">
                Subcategorías de {selectedCategory?.name}
              </h1>
            </div>
          ) : (
            <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
          )}

          {/* Action buttons */}
          {!viewingSubcategories ? (
            <button
              onClick={initAddCategory}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={18} className="mr-2" /> Añadir Categoría
            </button>
          ) : (
            <button
              onClick={initAddSubcategory}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={18} className="mr-2" /> Añadir Subcategoría
            </button>
          )}
        </div>

        {/* Search bar (only shown in category list view) */}
        {!viewingSubcategories && !isAddingCategory && !isEditingCategory && (
          <div className="mb-6 flex items-center bg-white rounded-lg shadow-sm px-4 py-2 max-w-md">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar categorías..."
              className="flex-1 outline-none border-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Error message display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Category list table */}
        {!loading && !isAddingCategory && !isEditingCategory && !viewingSubcategories && (
          <motion.div variants={slideUp} className="bg-white rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tendencia
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subcategorías
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCategories.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        No se encontraron categorías.{" "}
                        {searchTerm && "Intenta con otro término de búsqueda."}
                      </td>
                    </tr>
                  ) : (
                    // Only animate the visible rows for better performance
                    <AnimatePresence>
                      {currentCategories.map((category) => (
                        <motion.tr
                          key={category.id}
                          layout={false} // Disable layout animations for better performance
                          variants={rowFadeIn}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ duration: 0.2 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className="w-10 h-10 rounded-full mr-3 flex items-center justify-center"
                                style={{
                                  backgroundColor: category.color + "20",
                                  color: category.color,
                                }}
                              >
                                {iconOptions.find((i) => i.name === category.icon)?.icon}
                              </div>
                              <span className="font-medium">{category.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                            {category.description || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {category.count}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleTrendingStatus(category)}
                              className={`p-1 rounded-md ${
                                category.isTrending
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <Star size={18} fill={category.isTrending ? "currentColor" : "none"} />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => viewSubcategories(category)}
                              className="flex items-center text-indigo-600 hover:text-indigo-900"
                            >
                              <span>{category.subcategories?.length || 0}</span>
                              <ChevronRight size={16} className="ml-1" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => initEditCategory(category)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              aria-label="Editar categoría"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => initDeleteCategory(category)}
                              className="text-red-600 hover:text-red-900"
                              aria-label="Eliminar categoría"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  {pageInfoText}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1 rounded-md ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {renderPaginationButtons}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </button>
                  
                  <div className="relative ml-2">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="appearance-none bg-white border rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value={5}>5 / pág</option>
                      <option value={10}>10 / pág</option>
                      <option value={20}>20 / pág</option>
                      <option value={50}>50 / pág</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Subcategories view */}
        {!loading && viewingSubcategories && (
          <motion.div variants={slideUp} className="bg-white rounded-xl shadow-sm p-6">
            {selectedCategory?.subcategories?.length === 0 ? (
              <div className="text-center py-10">
                <div className="mb-4 text-gray-400">
                  <Building size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Aún no hay subcategorías
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza añadiendo una nueva subcategoría a {selectedCategory.name}.
                </p>
                <button
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={initAddSubcategory}
                >
                  <Plus size={16} className="mr-2" /> Añadir Subcategoría
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedCategory?.subcategories?.map((subcategory, index) => (
                  <motion.div
                    key={subcategory.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{subcategory.name}</span>
                    <div>
                      <button
                        onClick={() => initEditSubcategory(subcategory)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        aria-label="Editar subcategoría"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => initDeleteSubcategory(subcategory)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Eliminar subcategoría"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Category form (add/edit) */}
        {(isAddingCategory || isEditingCategory) && (
          <CategoryForm
            isAddingCategory={isAddingCategory}
            formData={formData}
            onInputChange={handleInputChange}
            onImageSelect={handleImageSelect}
            onIconSelect={handleIconSelect}
            onCancel={cancelCategoryForm}
            onSave={saveCategory}
            currentCategory={currentCategory}
            iconOptions={iconOptions}
            isUploading={isUploading} 
          />
        )}

        {/* Confirmation modals */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={cancelDeleteCategory}
          onConfirm={confirmDeleteCategory}
          title="Eliminar Categoría"
          message={`¿Estás seguro que deseas eliminar la categoría "${categoryToDelete?.name}"? Esto también eliminará todas las subcategorías relacionadas. Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="delete"
        />

        {/* Subcategory form modal */}
        {(isAddingSubcategory || isEditingSubcategory) && (
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 dark:bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 35,
                duration: 0.2
              }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isAddingSubcategory ? "Agregar Nueva Subcategoría" : "Editar Subcategoría"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={cancelSubcategoryForm}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </motion.button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="subcategory-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nombre de Subcategoría <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subcategory-name"
                    name="name"
                    required
                    value={subcategoryFormData.name}
                    onChange={handleSubcategoryInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="ej. Cocina Italiana"
                  />
                </div>

                <div className="pt-3 mt-6 flex flex-col sm:flex-row-reverse gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={saveSubcategory}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent 
                    text-base font-medium rounded-lg shadow-sm text-white 
                    bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700
                    focus:outline-none focus:ring-3 focus:ring-indigo-500/40"
                  >
                    <Save size={18} className="mr-2" />
                    Guardar Subcategoría
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={cancelSubcategoryForm}
                    className="inline-flex items-center justify-center px-5 py-2.5 
                    border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                    text-base font-medium text-gray-700 dark:text-gray-200 
                    bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                    focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Cancelar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete subcategory confirmation modal */}
        <ConfirmationModal
          isOpen={showDeleteSubcategoryConfirm}
          onClose={cancelDeleteSubcategory}
          onConfirm={confirmDeleteSubcategory}
          title="Eliminar Subcategoría"
          message={`¿Estás seguro que deseas eliminar la subcategoría "${subcategoryToDelete?.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="delete"
        />
      </motion.div>
    </div>
  );
}