"use client";

import { motion } from "framer-motion";
import {
  X,
  Save,
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
  Image,
} from "lucide-react";
import { useState } from "react";

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

export default function CategoryForm({ 
  isAdding,
  formData,
  onInputChange,
  onImageSelect,
  onIconSelect,
  onCancel,
  onSave 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare the data according to the API structure
      const categoryData = {
        name: formData.name,
        icon: formData.icon,
        description: formData.description,
        image: formData.image,
        color: formData.color,
        subcategories: [], // Initialize empty subcategories array
        isTrending: formData.isTrending
      };

      // Make the API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la categoría');
      }

      const result = await response.json();
      onSave(result); // Pass the saved category back to parent
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {isAdding ? "Añadir Nueva Categoría" : "Editar Categoría"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
                onChange={onInputChange}
                className="w-12 h-10 border-0 p-0"
              />
              <input
                type="text"
                value={formData.color}
                onChange={onInputChange}
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
              onChange={onInputChange}
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
                  onClick={() => onIconSelect(option.name)}
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
                    onClick={() => onImageSelect(null)}
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
                        onChange={(e) => onImageSelect(e)}
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
          onClick={onCancel}
          disabled={isLoading}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Guardar Categoría
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
} 