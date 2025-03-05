"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ImageIcon,
  Save,
  ArrowLeft,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

export default function PlaceFormPage({ params }) {
  const router = useRouter();
  const isEditing = params?.id ? true : false;
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rating: null,
    priceLevel: "",
    address: "",
    phone: "",
    website: "",
    cuisine: "",
    isOpenNow: false,
    latitude: null,
    longitude: null,
    categoryIds: [],
    subcategoryIds: [],
    featureIds: [],
    images: [],
    operatingHours: [
      { day: "Monday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Tuesday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Wednesday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Thursday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Friday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Saturday", openingTime: "10:00", closingTime: "15:00" },
      { day: "Sunday", openingTime: "10:00", closingTime: "15:00" },
    ],
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    // Load categories, subcategories, and features
    const loadData = async () => {
      try {
        // These would be your actual API calls
        const categoriesData = await fetchCategories();
        const subcategoriesData = await fetchSubcategories();
        const featuresData = await fetchFeatures();
        
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setFeatures(featuresData);
        
        // If editing, load the place data
        if (isEditing) {
          const placeData = await fetchPlace(params.id);
          setFormData(placeData);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [isEditing, params]);

  // Mock fetch functions - replace with your API calls
  const fetchCategories = () => Promise.resolve([
    { id: 1, name: "Restaurants", icon: "🍽️" },
    { id: 2, name: "Cafes", icon: "☕" },
    { id: 3, name: "Bars", icon: "🍸" },
  ]);
  
  const fetchSubcategories = () => Promise.resolve([
    { id: 1, name: "Italian", categoryId: 1 },
    { id: 2, name: "Japanese", categoryId: 1 },
    { id: 3, name: "Coffee Shop", categoryId: 2 },
    { id: 4, name: "Bakery", categoryId: 2 },
    { id: 5, name: "Cocktail Bar", categoryId: 3 },
  ]);
  
  const fetchFeatures = () => Promise.resolve([
    { id: 1, name: "Wi-Fi" },
    { id: 2, name: "Outdoor Seating" },
    { id: 3, name: "Parking" },
    { id: 4, name: "Pet-Friendly" },
  ]);
  
  const fetchPlace = (id) => Promise.resolve({
    id: 1,
    name: "Café Deluxe",
    description: "A cozy café with amazing pastries",
    rating: 4.5,
    priceLevel: "\$",
    address: "123 Main St",
    phone: "+1 (555) 123-4567",
    website: "https://example.com",
    cuisine: "French",
    isOpenNow: true,
    latitude: 40.7128,
    longitude: -74.0060,
    categoryIds: [2],
    subcategoryIds: [3, 4],
    featureIds: [1, 2],
    images: [{ id: 1, url: "/images/cafe.avif" }],
    operatingHours: [
      { day: "Monday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Tuesday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Wednesday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Thursday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Friday", openingTime: "09:00", closingTime: "17:00" },
      { day: "Saturday", openingTime: "10:00", closingTime: "15:00" },
      { day: "Sunday", openingTime: "10:00", closingTime: "15:00" },
    ],
  });

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
    const newImages = files.map((file, index) => ({
      id: `temp-\${Date.now()}-\${index}`,
      url: URL.createObjectURL(file),
      file: file,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.name || !formData.address) {
        // Show validation error
        return;
      }
      
      // Submit the form data
      if (isEditing) {
        // Update existing place
        // await updatePlace(params.id, formData);
        console.log("Updating place:", formData);
      } else {
        // Create new place
        // await createPlace(formData);
        console.log("Creating new place:", formData);
      }
      
      // Navigate back to places list
      router.push('/admin/places');
    } catch (error) {
      console.error("Error saving place:", error);
      // Show error message
    }
  };

  const handleCancel = () => {
    router.push('/admin/places');
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="flex items-center mb-8">
        <button 
          onClick={handleCancel}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Place" : "Add New Place"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isEditing 
              ? "Update the information for this place" 
              : "Fill in the details to add a new place to your platform"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                placeholder="Describe this place"
              />
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
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
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                placeholder="e.g. https://example.com"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Categories & Features
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-\${category.id}`}
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() =>
                        handleMultiSelectChange("categoryIds", category.id)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`category-\${category.id}`}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
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
                        id={`subcategory-\${subcategory.id}`}
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
                        htmlFor={`subcategory-\${subcategory.id}`}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-\${feature.id}`}
                      checked={formData.featureIds.includes(feature.id)}
                      onChange={() =>
                        handleMultiSelectChange("featureIds", feature.id)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`feature-\${feature.id}`}
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
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Operating Hours
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-1.5 px-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
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
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-1.5 px-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {formData.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt={image.altText || "Place image"}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
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

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <Save size={18} className="inline-block mr-2" />
            {isEditing ? "Update Place" : "Save Place"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}