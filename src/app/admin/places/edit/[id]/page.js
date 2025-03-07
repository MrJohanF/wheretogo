"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ImageIcon,
  Save,
  ArrowLeft,
  X,
  MapPin,
  Phone,
  Globe,
  DollarSign,
  Star,
  Info,
  Clock,
  LayoutList,
} from "lucide-react";
import { toast } from 'react-hot-toast';

// Import all Lucide icons for dynamic rendering
import * as LucideIcons from "lucide-react";

import { motion } from "framer-motion";
import { use } from "react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } },
};

const itemFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function PlaceFormPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const isEditing = resolvedParams?.id && resolvedParams.id !== "add";

  const [isLoading, setIsLoading] = useState(true);
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
      { day: "Lunes", openingTime: "09:00", closingTime: "17:00" },
      { day: "Martes", openingTime: "09:00", closingTime: "17:00" },
      { day: "Miércoles", openingTime: "09:00", closingTime: "17:00" },
      { day: "Jueves", openingTime: "09:00", closingTime: "17:00" },
      { day: "Viernes", openingTime: "09:00", closingTime: "17:00" },
      { day: "Sábado", openingTime: "10:00", closingTime: "15:00" },
      { day: "Domingo", openingTime: "10:00", closingTime: "15:00" },
    ],
    popularItems: [],
  });

  // Add UI for managing popular items
  const [newPopularItem, setNewPopularItem] = useState("");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [features, setFeatures] = useState([]);

  // Mock data
  const mockPlaces = {
    1: {
      id: 1,
      name: "Café Deluxe",
      description: "Un acogedor café con increíbles pasteles",
      rating: 4.5,
      priceLevel: "$",
      address: "123 Main St",
      phone: "+1 (555) 123-4567",
      website: "https://example.com",
      cuisine: "Francesa",
      isOpenNow: true,
      latitude: 40.7128,
      longitude: -74.006,
      categories: [{ id: 2, name: "Cafeterías" }],
      subcategories: [{ id: 3, name: "Cafetería" }],
      features: [
        { id: 1, name: "Wi-Fi" },
        { id: 2, name: "Asientos al aire libre" },
      ],
      images: [{ id: 1, url: "/images/cafe.avif" }],
      operatingHours: [
        { day: "Lunes", openingTime: "09:00", closingTime: "17:00" },
        { day: "Martes", openingTime: "09:00", closingTime: "17:00" },
        { day: "Miércoles", openingTime: "09:00", closingTime: "17:00" },
        { day: "Jueves", openingTime: "09:00", closingTime: "17:00" },
        { day: "Viernes", openingTime: "09:00", closingTime: "17:00" },
        { day: "Sábado", openingTime: "10:00", closingTime: "15:00" },
        { day: "Domingo", openingTime: "10:00", closingTime: "15:00" },
      ],
    },
    2: {
      id: 2,
      name: "Restaurante Junto al Mar",
      description: "Mariscos frescos con vistas al océano",
      rating: 4.8,
      priceLevel: "$$$",
      address: "456 Beach Blvd",
      phone: "+1 (555) 987-6543",
      website: "https://seaside.example.com",
      cuisine: "Mariscos",
      isOpenNow: true,
      latitude: 40.758,
      longitude: -73.9855,
      categories: [{ id: 1, name: "Restaurantes" }],
      subcategories: [{ id: 1, name: "Italiano" }],
      features: [
        { id: 2, name: "Asientos al aire libre" },
        { id: 3, name: "Estacionamiento" },
      ],
      images: [{ id: 2, url: "/images/restaurante.avif" }],
      operatingHours: [
        { day: "Lunes", openingTime: "11:00", closingTime: "22:00" },
        { day: "Martes", openingTime: "11:00", closingTime: "22:00" },
        { day: "Miércoles", openingTime: "11:00", closingTime: "22:00" },
        { day: "Jueves", openingTime: "11:00", closingTime: "22:00" },
        { day: "Viernes", openingTime: "11:00", closingTime: "23:00" },
        { day: "Sábado", openingTime: "11:00", closingTime: "23:00" },
        { day: "Domingo", openingTime: "11:00", closingTime: "22:00" },
      ],
    },
  };

  // Dynamic icon component that renders the correct Lucide icon based on name
  const DynamicIcon = ({ name, ...props }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.Tag; // Default to Tag if icon not found
    return <IconComponent {...props} />;
  };

  // fetchCategories function with API call
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.categories)) {
        throw new Error("Invalid categories response format");
      }

      return data.categories;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return []; // Return empty array as fallback
    }
  };

  // Fetch all subcategories from API
  const fetchSubcategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/subcategories`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching subcategories: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.subcategories)) {
        throw new Error("Invalid subcategories response format");
      }

      return data.subcategories;
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      return []; // Return empty array as fallback
    }
  };

  // Fetch features from API
  const fetchFeatures = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/features`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching features: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.features)) {
        throw new Error("Invalid features response format");
      }

      return data.features;
    } catch (error) {
      console.error("Failed to fetch features:", error);
      return []; // Return empty array as fallback
    }
  };

  const fetchPlace = (id) => Promise.resolve(mockPlaces[id] || null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch data from all three APIs in parallel for better performance
        const [categoriesData, subcategoriesData, featuresData] =
          await Promise.all([
            fetchCategories(),
            fetchSubcategories(),
            fetchFeatures(),
          ]);

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setFeatures(featuresData);

        if (isEditing) {
          const placeData = await fetchPlace(resolvedParams.id);
          if (placeData) {
            setFormData({
              ...placeData,
              categoryIds: placeData.categories?.map((c) => c.id) || [],
              subcategoryIds: placeData.subcategories?.map((s) => s.id) || [],
              featureIds: placeData.features?.map((f) => f.id) || [],
            });
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isEditing, resolvedParams.id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelectChange = (fieldName, id) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].includes(id)
        ? prev[fieldName].filter((existingId) => existingId !== id)
        : [...prev[fieldName], id],
    }));
  };

  const handleOperatingHoursChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((hour, i) =>
        i === index ? { ...hour, [field]: value } : hour
      ),
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      file,
      altText: file.name,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleRemoveImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const addPopularItem = () => {
    if (newPopularItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        popularItems: [...prev.popularItems, newPopularItem.trim()],
      }));
      setNewPopularItem("");
    }
  };

  const removePopularItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      popularItems: prev.popularItems.filter((_, i) => i !== index),
    }));
  };

  // Updated handleSubmit function to post new places to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.name || !formData.address) {
        toast.error("Nombre y dirección son campos obligatorios");
        return;
      }
      
      setIsLoading(true);
      
      // Format the data according to API expectations
      const placeData = {
        name: formData.name,
        description: formData.description || "",
        rating: parseFloat(formData.rating) || null,
        priceLevel: formData.priceLevel || "",
        address: formData.address,
        phone: formData.phone || "",
        website: formData.website || "",
        cuisine: formData.cuisine || "",
        isOpenNow: Boolean(formData.isOpenNow),
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        
        // Include all IDs from categories, subcategories, and features
        categoryIds: formData.categoryIds || [],
        subcategoryIds: formData.subcategoryIds || [],
        featureIds: formData.featureIds || [],
        
        // Format images to match the expected structure
        images: formData.images.map(img => ({
          url: img.url,
          altText: img.altText || img.name || "Place image",
          isFeatured: img.isFeatured || false
        })),
        
        operatingHours: formData.operatingHours,
        popularItems: formData.popularItems || []
      };
      
      console.log("Sending data to API:", placeData);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/places/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(placeData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Lugar creado exitosamente:", result);
      
      toast.success("El lugar ha sido añadido exitosamente");
      router.push('/admin/places');
      
    } catch (error) {
      console.error("Error al guardar lugar:", error);
      toast.error("Error al guardar lugar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/places");
  };

  // Simple category selection handler
  const handleCategorySelect = (categoryId) => {
    // Just toggle the category selection
    handleMultiSelectChange("categoryIds", categoryId);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="flex items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancel}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </motion.button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Editar Lugar" : "Agregar Nuevo Lugar"}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {isEditing
              ? "Actualiza la información de este lugar"
              : "Completa los detalles para agregar un nuevo lugar a tu plataforma"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-12"
        >
          <div className="animate-pulse text-gray-500 dark:text-gray-400">
            Cargando...
          </div>
        </motion.div>
      ) : (
        <motion.form
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Información Básica */}
          <motion.div
            variants={slideIn}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                <Info className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                Información Básica
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <motion.div variants={itemFadeIn}>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del lugar"
                />
              </motion.div>

              <motion.div variants={itemFadeIn}>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe este lugar"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Contacto y Ubicación */}
          <motion.div
            variants={slideIn}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                Contacto y Ubicación
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                <motion.div variants={itemFadeIn} className="sm:col-span-6">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Dirección <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      placeholder="Dirección del lugar"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemFadeIn} className="sm:col-span-3">
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    placeholder="ej. 40.7128"
                  />
                </motion.div>

                <motion.div variants={itemFadeIn} className="sm:col-span-3">
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    placeholder="ej. -74.0060"
                  />
                </motion.div>

                <motion.div variants={itemFadeIn} className="sm:col-span-3">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Teléfono
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      placeholder="ej. +1 (555) 123-4567"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemFadeIn} className="sm:col-span-3">
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Sitio Web
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website || ""}
                      onChange={handleInputChange}
                      className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      placeholder="ej. https://ejemplo.com"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Detalles Adicionales */}
          <motion.div
            variants={slideIn}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                Detalles Adicionales
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                <motion.div variants={itemFadeIn} className="sm:col-span-2">
                  <label
                    htmlFor="cuisine"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Tipo de Cocina
                  </label>
                  <input
                    type="text"
                    id="cuisine"
                    name="cuisine"
                    value={formData.cuisine || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                    placeholder="ej. Italiana, Japonesa, etc."
                  />
                </motion.div>

                <motion.div variants={itemFadeIn} className="sm:col-span-2">
                  <label
                    htmlFor="priceLevel"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nivel de Precio
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="priceLevel"
                      name="priceLevel"
                      value={formData.priceLevel || ""}
                      onChange={handleInputChange}
                      className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white appearance-none"
                    >
                      <option value="">Seleccionar nivel de precio</option>
                      <option value="$">$ (Económico)</option>
                      <option value="$$">$$ (Moderado)</option>
                      <option value="$$$">$$$ (Costoso)</option>
                      <option value="$$$$">$$$$ (Muy Costoso)</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={itemFadeIn} className="sm:col-span-2">
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Calificación Inicial (0-5)
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Star className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      id="rating"
                      name="rating"
                      value={formData.rating || ""}
                      onChange={handleInputChange}
                      className="block w-full pl-10 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      placeholder="ej. 4.5"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemFadeIn} className="sm:col-span-6">
                  <div className="flex items-center mt-2">
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
                      ¿Actualmente Abierto?
                    </label>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Categorías y Características */}
          <motion.div
            variants={slideIn}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                <LayoutList className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                Categorías y Características
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              {/* Categorías */}
              <motion.div variants={itemFadeIn}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categorías
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`cursor-pointer flex items-center p-3 rounded-md border ${
                        formData.categoryIds.includes(category.id)
                          ? "dark:bg-opacity-15"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      style={{
                        borderColor: formData.categoryIds.includes(category.id)
                          ? category.color
                          : undefined,
                        backgroundColor: formData.categoryIds.includes(
                          category.id
                        )
                          ? `${category.color}15`
                          : undefined,
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={formData.categoryIds.includes(category.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex items-center"
                      >
                        {category.icon && (
                          <span
                            className="mr-2"
                            style={{ color: category.color }}
                          >
                            <DynamicIcon name={category.icon} size={16} />
                          </span>
                        )}
                        {category.name}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Subcategorías */}
              <motion.div variants={itemFadeIn}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subcategorías
                </label>

                {formData.categoryIds.length === 0 ? (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-md p-3">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Selecciona categorías para ver las subcategorías
                      disponibles
                    </p>
                  </div>
                ) : subcategories.filter((sub) =>
                    formData.categoryIds.includes(sub.categoryId)
                  ).length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No hay subcategorías disponibles para las categorías
                      seleccionadas
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {subcategories
                      .filter((sub) =>
                        formData.categoryIds.includes(sub.categoryId)
                      )
                      .map((subcategory, index) => {
                        // Find parent category for color
                        const parentCategory =
                          categories.find(
                            (c) => c.id === subcategory.categoryId
                          ) || subcategory.category; // Use embedded category if available
                        const categoryColor =
                          parentCategory?.color || "#6366f1";

                        return (
                          <motion.div
                            key={subcategory.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleMultiSelectChange(
                                "subcategoryIds",
                                subcategory.id
                              )
                            }
                            className="cursor-pointer flex items-center p-3 rounded-md border"
                            style={{
                              borderColor: formData.subcategoryIds.includes(
                                subcategory.id
                              )
                                ? categoryColor
                                : "rgb(229, 231, 235)",
                              backgroundColor: formData.subcategoryIds.includes(
                                subcategory.id
                              )
                                ? `${categoryColor}15`
                                : undefined,
                            }}
                          >
                            <input
                              type="checkbox"
                              id={`subcategory-${subcategory.id}`}
                              checked={formData.subcategoryIds.includes(
                                subcategory.id
                              )}
                              onChange={() => {}}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`subcategory-${subcategory.id}`}
                              className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              {subcategory.name}
                            </label>
                          </motion.div>
                        );
                      })}
                  </div>
                )}
              </motion.div>

              {/* Características y Comodidades */}
              <motion.div variants={itemFadeIn}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Características y Comodidades
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleMultiSelectChange("featureIds", feature.id)
                      }
                      className={`cursor-pointer flex items-center p-3 rounded-md border ${
          formData.featureIds.includes(feature.id) 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-600' 
            : 'border-gray-200 dark:border-gray-700'
        }`}
                    >
                      <input
                        type="checkbox"
                        id={`feature-${feature.id}`}
                        checked={formData.featureIds.includes(feature.id)}
                        onChange={() => {}}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`feature-${feature.id}`}
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {feature.name}
                      </label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Operating Hours */}
          <motion.div
            variants={slideIn}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                Horario de Operación
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <motion.p
                variants={itemFadeIn}
                className="text-sm text-gray-500 dark:text-gray-400 mb-4"
              >
                Establece los horarios de apertura y cierre para cada día de la
                semana
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {formData.operatingHours.map((hours, index) => (
                  <motion.div
                    key={hours.day}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                  >
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {hours.day}
                      </h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400">
                          Hora de Apertura
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
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400">
                          Hora de Cierre
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
                          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Popular Items */}
          <motion.div
            variants={slideIn}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                <LayoutList className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                Artículos Populares
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <motion.div variants={itemFadeIn}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agregar artículos populares de este lugar
                </label>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newPopularItem}
                    onChange={(e) => setNewPopularItem(e.target.value)}
                    placeholder="Ej: Spaghetti Carbonara"
                    className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={addPopularItem}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                  >
                    Agregar
                  </motion.button>
                </div>

                {formData.popularItems.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Artículos agregados:
                    </p>
                    <div className="space-y-2">
                      {formData.popularItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md"
                        >
                          <span className="text-gray-800 dark:text-gray-200">
                            {item}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removePopularItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            variants={slideIn}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
          >
            <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                Imágenes
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
              <motion.div variants={itemFadeIn} whileHover={{ scale: 1.02 }}>
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
                  className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center h-32"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Haz clic para subir imágenes
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, GIF hasta 10MB
                  </span>
                </label>
              </motion.div>

              {formData.images.length > 0 && (
                <motion.div variants={itemFadeIn}>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Imágenes Subidas ({formData.images.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {formData.images.map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative group"
                      >
                        <div className="aspect-square rounded-md overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                          <img
                            src={image.url}
                            alt={image.altText || "Imagen del lugar"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            variants={slideIn}
            className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
            >
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-5 py-2 bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-sm font-medium flex items-center"
            >
              <Save size={18} className="mr-2" />
              {isEditing ? "Actualizar Lugar" : "Guardar Lugar"}
            </motion.button>
          </motion.div>
        </motion.form>
      )}
    </motion.div>
  );
}
