

import { motion } from "framer-motion";
import {
  X,
  Image as ImageIcon,
  Save,
  MapPin,
  Phone,
  Link,
  Clock,
  Menu,
} from "lucide-react";

export default function PlaceForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  categories,
  subcategories,
  features,
  isEditing = false,
}) {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleMultiSelectChange = (fieldName, id) => {
    setFormData((prevData) => {
      const currentIds = prevData[fieldName] || [];
      const newIds = currentIds.includes(id)
        ? currentIds.filter((existingId) => existingId !== id)
        : [...currentIds, id];

      return { ...prevData, [fieldName]: newIds };
    });
  };

  const handleOperatingHoursChange = (index, field, value) => {
    const updatedHours = [...formData.operatingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setFormData({ ...formData, operatingHours: updatedHours });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // In a real app, you'd upload these to your server/cloud storage
    // Here we're just creating URL objects for preview
    const newImages = files.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      file: file, // Keep the file object for actual upload
      altText: file.name,
    }));

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });
  };

  const handleRemoveImage = (imageId) => {
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img.id !== imageId),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 dark:bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Edit Place" : "Add New Place"}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.94 }}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2"
          >
            <X size={18} />
          </motion.button>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Basic Information
              </h3>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="Place name"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe this place"
                />
              </div>
            </div>

            {/* Contact & Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Contact & Location
              </h3>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. 40.7128"
                  />
                </div>
                <div>
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g. -74.0060"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. +1 (555) 123-4567"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. https://example.com"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Additional Details
              </h3>

              <div>
                <label
                  htmlFor="cuisine"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Cuisine Type
                </label>
                <input
                  type="text"
                  id="cuisine"
                  name="cuisine"
                  value={formData.cuisine || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. Italian, Japanese, etc."
                />
              </div>

              <div>
                <label
                  htmlFor="priceLevel"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price Level
                </label>
                <select
                  id="priceLevel"
                  name="priceLevel"
                  value={formData.priceLevel || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select price level</option>
                  <option value="\$">\$ (Budget)</option>
                  <option value="\$\$">\$\$ (Moderate)</option>
                  <option value="\$\$\$">\$\$\$ (Expensive)</option>
                  <option value="\$\$\$\$">\$\$\$\$ (Very Expensive)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Initial Rating (0-5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  id="rating"
                  name="rating"
                  value={formData.rating || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g. 4.5"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOpenNow"
                  name="isOpenNow"
                  checked={formData.isOpenNow || false}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isOpenNow"
                  className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Currently Open?
                </label>
              </div>
            </div>

            {/* Categories & Features */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Categories & Features
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categories
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={() =>
                          handleMultiSelectChange("categoryIds", category.id)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {category.icon} {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subcategories
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {subcategories
                    .filter((sub) =>
                      formData.categoryIds.includes(sub.categoryId)
                    )
                    .map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id={`subcategory-${subcategory.id}`}
                          checked={formData.subcategoryIds.includes(
                            subcategory.id
                          )}
                          onChange={() =>
                            handleMultiSelectChange(
                              "subcategoryIds",
                              subcategory.id
                            )
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`subcategory-${subcategory.id}`}
                          className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {subcategory.name}
                        </label>
                      </div>
                    ))}
                </div>
                {formData.categoryIds.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Select categories to see available subcategories
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Features & Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`feature-${feature.id}`}
                        checked={formData.featureIds.includes(feature.id)}
                        onChange={() =>
                          handleMultiSelectChange("featureIds", feature.id)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`feature-${feature.id}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        {feature.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Operating Hours
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.operatingHours.map((hours, index) => (
                  <div
                    key={hours.day}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      {hours.day}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400">
                          Opening
                        </label>
                        <input
                          type="time"
                          value={hours.openingTime}
                          onChange={(e) =>
                            handleOperatingHoursChange(
                              index,
                              "openingTime",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-1.5 px-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400">
                          Closing
                        </label>
                        <input
                          type="time"
                          value={hours.closingTime}
                          onChange={(e) =>
                            handleOperatingHoursChange(
                              index,
                              "closingTime",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-1.5 px-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Images
              </h3>

              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload images
                  </span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.altText || "Place image"}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        onClick={() => handleRemoveImage(image.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
            className="px-4 py-2 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          >
            <Save size={18} className="inline-block mr-2" />
            {isEditing ? "Update Place" : "Save Place"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}