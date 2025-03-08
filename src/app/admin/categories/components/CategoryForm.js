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
  Image as ImageIcon,
  Shuffle,
} from "lucide-react";
import { useState, useCallback } from "react";

/**
 * Modern color palette for categories
 */
const MODERN_COLOR_PALETTE = [
  // Blues & Indigos
  "#3b82f6", // Blue 500
  "#2563eb", // Blue 600
  "#4f46e5", // Indigo 600
  "#6366f1", // Indigo 500
  "#2dd4bf", // Teal 400
  
  // Greens
  "#10b981", // Emerald 500
  "#059669", // Emerald 600
  "#16a34a", // Green 600
  "#84cc16", // Lime 500
  
  // Reds, Oranges & Pinks
  "#ef4444", // Red 500
  "#f97316", // Orange 500
  "#ec4899", // Pink 500
  "#d946ef", // Fuchsia 500
  "#f43f5e", // Rose 500
  
  // Purples
  "#a855f7", // Purple 500
  "#8b5cf6", // Violet 500
  "#c026d3", // Fuchsia 600
  
  // Deep & Rich Colors
  "#0369a1", // Sky 700
  "#0e7490", // Cyan 700
  "#0f766e", // Teal 700
  "#15803d", // Green 700
  "#b45309", // Amber 700
  "#c2410c", // Orange 700
  "#9f1239", // Rose 800
  "#7e22ce", // Purple 700
];

/**
 * Category form component for adding and editing categories
 */
export default function CategoryForm({ 
  isAdding,
  formData,
  onInputChange,
  onImageSelect,
  onIconSelect,
  onCancel,
  onSave,
  currentCategory,
  iconOptions 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [colorAnimation, setColorAnimation] = useState(false);

  /**
   * Generate a random color from the modern palette
   */
  const generateRandomColor = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MODERN_COLOR_PALETTE.length);
    const randomColor = MODERN_COLOR_PALETTE[randomIndex];
    
    // Create a synthetic event to pass to onInputChange
    const syntheticEvent = {
      target: {
        name: 'color',
        value: randomColor
      }
    };
    
    onInputChange(syntheticEvent);
    
    // Trigger animation effect
    setColorAnimation(true);
    setTimeout(() => setColorAnimation(false), 500);
  }, [onInputChange]);

  /**
   * Handle saving the category - performs API call
   */
  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare data for API
      const categoryData = {
        name: formData.name,
        icon: formData.icon,
        description: formData.description,
        image: formData.image,
        color: formData.color,
        isTrending: formData.isTrending
      };

      let response;

      if (isAdding) {
        // Create new category
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(categoryData),
        });
      } else {
        // Update existing category
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${currentCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(categoryData),
        });
      }

      if (!response.ok) {
        throw new Error(isAdding ? 'Error al crear la categoría' : 'Error al actualizar la categoría');
      }

      const result = await response.json();
      onSave(result); // Pass the result back to parent
    } catch (err) {
      setError(err.message);
      console.error('Error saving category:', err);
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
      {/* Form header */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {isAdding ? "Añadir Nueva Categoría" : "Editar Categoría"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Category name field */}
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

          {/* Description field */}
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

          {/* Color picker with random generator */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700"
              >
                Color de Categoría
              </label>
              <button
                type="button"
                onClick={generateRandomColor}
                className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                aria-label="Generar color aleatorio"
              >
                <Shuffle size={14} className="mr-1" />
                Generar color
              </button>
            </div>
            <div className="flex items-center space-x-3">
              {/* FIX 1: Add onChange to color input */}
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={onInputChange}
                className="w-12 h-10 border-0 p-0 cursor-pointer"
              />
              
              {/* FIX 2: Add onChange to color text input */}
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={onInputChange}
                className="w-28 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              
              <motion.div
                animate={colorAnimation ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="w-10 h-10 rounded-md shadow-sm"
                style={{ backgroundColor: formData.color }}
              ></motion.div>
            </div>

            {/* Color palette suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {MODERN_COLOR_PALETTE.slice(0, 8).map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded-full shadow-sm border border-gray-200 transition-transform hover:scale-110 focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const syntheticEvent = {
                      target: { name: 'color', value: color }
                    };
                    onInputChange(syntheticEvent);
                  }}
                  aria-label={`Seleccionar color ${color}`}
                ></button>
              ))}
            </div>
          </div>

          {/* FIX 5: Add onChange to checkbox */}
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
          {/* Icon selection */}
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
                  className={`w-12 h-12 rounded-md flex items-center justify-center transition-colors ${
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

          {/* Image upload */}
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
                    aria-label="Eliminar imagen"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <ImageIcon size={36} className="mx-auto text-gray-400" />
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

      {/* Form actions */}
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