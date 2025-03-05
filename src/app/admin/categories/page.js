"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  X,
  Save,
  Upload,
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
  Check,
  Image,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/app/components/ConfirmationModal";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

export default function CategoriesManagement() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [viewingSubcategories, setViewingSubcategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [isEditingSubcategory, setIsEditingSubcategory] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [subcategoryFormData, setSubcategoryFormData] = useState({
    name: "",
    categoryId: null,
  });
  const [showDeleteSubcategoryConfirm, setShowDeleteSubcategoryConfirm] =
    useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#6366F1", // Default indigo color
    isTrending: false,
    image: null,
  });

  // Mock icons for selection
  const iconOptions = [
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
  ];

  // Mock data for categories - in a real application, you would fetch from your API
  useEffect(() => {
    // Simulate loading data
    setLoading(true);

    setTimeout(() => {
      const mockCategories = [
        {
          id: 1,
          name: "Restaurantes",
          icon: "Utensils",
          description: "Lugares para comer y cenar",
          color: "#EF4444",
          count: 128,
          isTrending: true,
          image: "/images/restaurante.avif",
          subcategories: [
            { id: 1, name: "Italiano" },
            { id: 2, name: "Mexicano" },
            { id: 3, name: "Japonés" },
          ],
        },
        {
          id: 2,
          name: "Cafeterías",
          icon: "Coffee",
          description: "Obtén tu dosis de cafeína",
          color: "#F59E0B",
          count: 85,
          isTrending: false,
          image: "/images/cafe.avif",
          subcategories: [
            { id: 4, name: "Cafeterías" },
            { id: 5, name: "Casas de Té" },
          ],
        },
        {
          id: 3,
          name: "Bares",
          icon: "Beer",
          description: "Bebidas y vida nocturna",
          color: "#8B5CF6",
          count: 97,
          isTrending: true,
          image: "/images/bar.avif",
          subcategories: [
            { id: 6, name: "Pubs" },
            { id: 7, name: "Lounges" },
            { id: 8, name: "Clubs" },
          ],
        },
        {
          id: 4,
          name: "Museos",
          icon: "Building",
          description: "Exhibiciones culturales y artefactos históricos",
          color: "#10B981",
          count: 42,
          isTrending: false,
          image: "/images/museo.avif",
          subcategories: [
            { id: 9, name: "Museos de Arte" },
            { id: 10, name: "Museos de Historia" },
          ],
        },
        {
          id: 5,
          name: "Parques",
          icon: "TreeDeciduous",
          description: "Espacios al aire libre y recreación",
          color: "#3B82F6",
          count: 36,
          isTrending: false,
          image: "/images/parque.avif",
          subcategories: [
            { id: 11, name: "Parques Urbanos" },
            { id: 12, name: "Parques Nacionales" },
          ],
        },
      ];

      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setLoading(false);
    }, 700); // Mock loading delay
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description &&
          cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Image selection handler
  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        image: URL.createObjectURL(e.target.files[0]), // For preview
        // In real app, you would handle the actual file upload
      });
    }
  };

  // Icon selection handler
  const handleIconSelect = (iconName) => {
    setFormData({
      ...formData,
      icon: iconName,
    });
  };

  // Add new category
  const handleAddCategory = () => {
    setIsAddingCategory(true);
    setFormData({
      name: "",
      description: "",
      icon: "",
      color: "#6366F1",
      isTrending: false,
      image: null,
    });
  };

  // Edit existing category
  const handleEditCategory = (category) => {
    setIsEditingCategory(true);
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon,
      color: category.color || "#6366F1",
      isTrending: category.isTrending,
      image: category.image,
    });
  };

  // Delete category confirmation
  const handleDeleteInit = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  // Confirm delete category
  const handleConfirmDelete = () => {
    // In a real app, you would make an API call here
    const updatedCategories = categories.filter(
      (cat) => cat.id !== categoryToDelete.id
    );
    setCategories(updatedCategories);
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);

    // Show success notification
    // ...
  };

  // Save category (add or edit)
  const handleSaveCategory = () => {
    if (isAddingCategory) {
      // Add new category - in a real app, you would make an API call
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        ...formData,
        count: 0,
        subcategories: [],
      };

      setCategories([...categories, newCategory]);
      setIsAddingCategory(false);
    } else if (isEditingCategory) {
      // Update category - in a real app, you would make an API call
      const updatedCategories = categories.map((cat) =>
        cat.id === currentCategory.id ? { ...cat, ...formData } : cat
      );

      setCategories(updatedCategories);
      setIsEditingCategory(false);
      setCurrentCategory(null);
    }

    // Reset form
    setFormData({
      name: "",
      description: "",
      icon: "",
      color: "#6366F1",
      isTrending: false,
      image: null,
    });
  };

  // Toggle trending status
  const handleToggleTrending = (category) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === category.id ? { ...cat, isTrending: !cat.isTrending } : cat
    );
    setCategories(updatedCategories);
  };

  // View subcategories
  const handleViewSubcategories = (category) => {
    setSelectedCategory(category);
    setViewingSubcategories(true);
  };

  // ** Subcategory Handling **

  // Add New Subcategory
  const handleAddSubcategory = () => {
    setIsAddingSubcategory(true);
    setSubcategoryFormData({
      name: "",
      categoryId: selectedCategory?.id,
    });
  };

  // Edit Existing Subcategory
  const handleEditSubcategory = (subcategory) => {
    setIsEditingSubcategory(true);
    setCurrentSubcategory(subcategory);
    setSubcategoryFormData({
      name: subcategory.name,
      categoryId: selectedCategory?.id,
    });
  };

  // Delete Subcategory Init
  const handleDeleteSubcategoryInit = (subcategory) => {
    setSubcategoryToDelete(subcategory);
    setShowDeleteSubcategoryConfirm(true);
  };

  // Confirm Delete Subcategory
  const handleConfirmDeleteSubcategory = () => {
    // In a real app, you would make an API call here
    const updatedCategories = categories.map((cat) => {
      if (cat.id === selectedCategory?.id) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter(
            (sub) => sub.id !== subcategoryToDelete.id
          ),
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setSelectedCategory(
      updatedCategories.find((cat) => cat.id === selectedCategory?.id)
    );
    setShowDeleteSubcategoryConfirm(false);
    setSubcategoryToDelete(null);
  };

  // Save Subcategory (Add or Edit)
  const handleSaveSubcategory = () => {
    if (!subcategoryFormData.name.trim()) {
      // Show validation error
      return;
    }

    if (isAddingSubcategory) {
      // Add new subcategory
      const newSubcategory = {
        id:
          Math.max(
            0,
            ...(selectedCategory?.subcategories.map((s) => s.id) || [])
          ) + 1,
        name: subcategoryFormData.name,
        categoryId: selectedCategory?.id,
      };

      const updatedCategories = categories.map((cat) => {
        if (cat.id === selectedCategory?.id) {
          return {
            ...cat,
            subcategories: [...cat.subcategories, newSubcategory],
          };
        }
        return cat;
      });

      setCategories(updatedCategories);
      setSelectedCategory(
        updatedCategories.find((cat) => cat.id === selectedCategory?.id)
      );
    } else if (isEditingSubcategory) {
      // Update subcategory
      const updatedCategories = categories.map((cat) => {
        if (cat.id === selectedCategory?.id) {
          return {
            ...cat,
            subcategories: cat.subcategories.map((sub) =>
              sub.id === currentSubcategory.id
                ? { ...sub, name: subcategoryFormData.name }
                : sub
            ),
          };
        }
        return cat;
      });

      setCategories(updatedCategories);
      setSelectedCategory(
        updatedCategories.find((cat) => cat.id === selectedCategory?.id)
      );
    }

    // Reset form
    setIsAddingSubcategory(false);
    setIsEditingSubcategory(false);
    setCurrentSubcategory(null);
    setSubcategoryFormData({
      name: "",
      categoryId: null,
    });
  };

  // Handle Input Change for Subcategory Form
  const handleSubcategoryInputChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryFormData({
      ...subcategoryFormData,
      [name]: value,
    });
  };

  return (
    <div className="h-full bg-gray-50 text-gray-800">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="p-6 max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {viewingSubcategories ? (
            <div className="flex items-center">
              <button
                onClick={() => setViewingSubcategories(false)}
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

          {!viewingSubcategories && (
            <button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={18} className="mr-2" /> Añadir Categoría
            </button>
          )}

          {viewingSubcategories && (
            <button
              onClick={handleAddSubcategory}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={18} className="mr-2" /> Añadir Subcategoría
            </button>
          )}
        </div>

        {/* Search Bar */}
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* Category List */}
        {!loading &&
          !isAddingCategory &&
          !isEditingCategory &&
          !viewingSubcategories && (
            <motion.div
              variants={slideUp}
              className="bg-white rounded-xl shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Categoría
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Descripción
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cantidad
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tendencia
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Subcategorías
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategories.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          No se encontraron categorías.{" "}
                          {searchTerm && "Intenta con otro término de búsqueda."}
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((category, index) => (
                        <motion.tr
                          key={category.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
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
                                {
                                  iconOptions.find(
                                    (i) => i.name === category.icon
                                  )?.icon
                                }
                              </div>
                              <span className="font-medium">
                                {category.name}
                              </span>
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
                              onClick={() => handleToggleTrending(category)}
                              className={`p-1 rounded-md ${
                                category.isTrending
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <Star
                                size={18}
                                fill={
                                  category.isTrending ? "currentColor" : "none"
                                }
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewSubcategories(category)}
                              className="flex items-center text-indigo-600 hover:text-indigo-900"
                            >
                              <span>{category.subcategories?.length || 0}</span>
                              <ChevronRight size={16} className="ml-1" />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteInit(category)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        {/* Subcategories View */}
        {!loading && viewingSubcategories && (
          <motion.div
            variants={slideUp}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            {selectedCategory?.subcategories?.length === 0 ? (
              <div className="text-center py-10">
                <div className="mb-4 text-gray-400">
                  <Building size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Aún no hay subcategorías
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza añadiendo una nueva subcategoría a{" "}
                  {selectedCategory.name}.
                </p>
                <button
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleAddSubcategory}
                >
                  <Plus size={16} className="mr-2" /> Añadir Subcategoría
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedCategory?.subcategories?.map((subcategory) => (
                  <motion.div
                    key={subcategory.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="font-medium">{subcategory.name}</span>
                    <div>
                      <button
                        onClick={() => handleEditSubcategory(subcategory)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategoryInit(subcategory)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Add/Edit Category Form */}
        {(isAddingCategory || isEditingCategory) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {isAddingCategory ? "Añadir Nueva Categoría" : "Editar Categoría"}
              </h2>
              <button
                onClick={() => {
                  setIsAddingCategory(false);
                  setIsEditingCategory(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de Categoría *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="ej. Restaurantes"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Breve descripción de la categoría"
                  ></textarea>
                </div>

                {/* Color Picker */}
                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Color de Categoría
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-12 h-10 border-0 p-0"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={handleInputChange}
                      name="color"
                      className="w-28 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div
                      className="w-10 h-10 rounded-md"
                      style={{ backgroundColor: formData.color }}
                    ></div>
                  </div>
                </div>

                {/* Trending Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTrending"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isTrending"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Marcar como categoría en tendencia
                  </label>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icono de Categoría
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {iconOptions.map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => handleIconSelect(option.name)}
                        className={`w-12 h-12 rounded-md flex items-center justify-center ${
                          formData.icon === option.name
                            ? `bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500`
                            : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                        }`}
                      >
                        {option.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen de Categoría
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    {formData.image ? (
                      <div className="relative w-full h-36">
                        <img
                          src={formData.image}
                          alt="Vista previa de categoría"
                          className="h-full w-full object-cover rounded-md"
                        />
                        <button
                          onClick={() =>
                            setFormData({ ...formData, image: null })
                          }
                          className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-md"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Image size={36} className="mx-auto text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            <span>Subir un archivo</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageSelect}
                            />
                          </label>
                          <p className="pl-1">o arrastrar y soltar</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF hasta 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setIsEditingCategory(false);
                }}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Save size={18} className="mr-2" />
                Guardar Categoría
              </button>
            </div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
          title="Eliminar Categoría"
          message={`¿Estás seguro que deseas eliminar la categoría "${categoryToDelete?.name}"? Esto también eliminará todas las subcategorías relacionadas. Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="delete"
        />

        {/* Subcategory Form Modal */}
        {(isAddingSubcategory || isEditingSubcategory) && (
          <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 dark:bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isAddingSubcategory
                    ? "Agregar Nueva Subcategoría"
                    : "Editar Subcategoría"}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setIsAddingSubcategory(false);
                    setIsEditingSubcategory(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2 transition-colors"
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
                    onClick={handleSaveSubcategory}
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
                    onClick={() => {
                      setIsAddingSubcategory(false);
                      setIsEditingSubcategory(false);
                    }}
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

        {/* Delete Subcategory Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteSubcategoryConfirm}
          onClose={() => setShowDeleteSubcategoryConfirm(false)}
          onConfirm={handleConfirmDeleteSubcategory}
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
