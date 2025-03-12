"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  PlusCircle,
  CheckCircle,
  AlertTriangle,
  Coffee,
  Upload,
  Check,
  Compass,
  ChevronDown,
  Loader,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useAdminStore from "@/app/admin/store/adminStore";
// Import Cloudinary service
import {
  uploadImageToCloudinary,
  getOptimizedImageUrl,
  deleteImageFromCloudinary,
} from "@/app/services/cloudinary";

// Import all Lucide icons for dynamic rendering
import * as LucideIcons from "lucide-react";

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function PlaceFormPage({ params }) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false,
  });

  const resolvedParams = use(params);
  const isEditing = resolvedParams?.id && resolvedParams.id !== "add";

  // Use the store for data fetching and state management
  const {
    categories: { data: categories },
    subcategories: { data: subcategories },
    features: { data: features },
    places: { isLoading: storeLoading, error: storeError },
    fetchCategories,
    fetchSubcategories,
    fetchFeatures,
    fetchPlaceById,
    savePlace,
    clearSelectedPlace,
  } = useAdminStore();

  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  // Track image upload states
  const [uploadingImages, setUploadingImages] = useState([]);

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

  // Dynamic icon component that renders the correct Lucide icon based on name
  const DynamicIcon = ({ name, ...props }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.Tag; // Default to Tag if icon not found
    return <IconComponent {...props} />;
  };

  // In your useEffect where you set form data after fetching a place
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Use store actions to load data
        await Promise.all([
          fetchCategories(),
          fetchSubcategories(),
          fetchFeatures(),
        ]);

        if (isEditing) {
          const placeData = await fetchPlaceById(resolvedParams.id);
          if (placeData) {
            setFormData({
              ...placeData,
              // Transform object relationships to simple IDs
              categoryIds:
                placeData.categories?.map((c) =>
                  typeof c === "object" ? c.categoryId || c.id : c
                ) || [],
              subcategoryIds:
                placeData.subcategories?.map((s) =>
                  typeof s === "object" ? s.subcategoryId || s.id : s
                ) || [],
              featureIds:
                placeData.features?.map((f) =>
                  typeof f === "object" ? f.featureId || f.id : f
                ) || [],
              // Handle popularItems if they come as objects
              popularItems:
                placeData.popularItems?.map((item) =>
                  typeof item === "object" ? item.name : item
                ) || [],
              // Make sure images have proper structure
              images: (placeData.images || []).map((img) => ({
                id:
                  img.id ||
                  `img-${Date.now()}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                url: img.url,
                altText: img.altText || "Place image",
                isFeatured: img.isFeatured || false,
                publicId: img.publicId || extractPublicIdFromUrl(img.url),
              })),
            });
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setFormStatus({
          ...formStatus,
          error: error.message || "Error loading data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Clean up selected place when unmounting
    return () => {
      clearSelectedPlace();
    };
  }, [
    isEditing,
    resolvedParams.id,
    fetchCategories,
    fetchSubcategories,
    fetchFeatures,
    fetchPlaceById,
    clearSelectedPlace,
  ]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any temporary image URLs when component unmounts
      formData.images.forEach((img) => {
        if (img.isTemp && img.url) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [formData.images]);

  // Extract public ID from Cloudinary URL
  const extractPublicIdFromUrl = (url) => {
    if (!url || !url.includes("cloudinary.com")) return null;

    try {
      // URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/image_id.jpg
      const uploadIndex = url.indexOf("/upload/");
      if (uploadIndex === -1) return null;

      // Get everything after /upload/
      let afterUpload = url.substring(uploadIndex + 8); // +8 because '/upload/' is 8 chars

      // Remove version number if present (v1234567890/)
      afterUpload = afterUpload.replace(/^v\d+\//, "");

      // Remove file extension (if present)
      const extIndex = afterUpload.lastIndexOf(".");
      if (extIndex !== -1) {
        afterUpload = afterUpload.substring(0, extIndex);
      }

      return afterUpload;
    } catch (e) {
      console.error("Error extracting public ID from URL:", e);
      return null;
    }
  };

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

  // Handle setting featured image
  const handleSetFeaturedImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img) => ({
        ...img,
        isFeatured: img.id === imageId,
      })),
    }));
  };

  // Enhanced image handling with local preview only
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    processNewImages(files);
  };

  // Process images for local preview only, no upload
  const processNewImages = (files) => {
    if (!files.length) return;

    // Create temporary objects for UI preview only
    const tempImages = files.map((file, index) => ({
      id: `temp-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      file, // Store the actual file for later upload
      altText: file.name || "Image",
      isTemp: true, // Flag to indicate this is a temporary local file
      isFeatured: formData.images.length === 0, // Make first image featured by default
    }));

    // Add temporary images to state to show preview
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...tempImages],
    }));
  };

  // Handle removing an image - updated to fix reselection issue
  const handleRemoveImage = async (imageId) => {
    // Find the image to remove
    const imageToRemove = formData.images.find((img) => img.id === imageId);

    // Remove from form data
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));

    // Clean up object URL if it's a temp image
    if (imageToRemove && imageToRemove.isTemp && imageToRemove.url) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // Only delete from Cloudinary if it's not a temporary/local image
    if (imageToRemove && imageToRemove.publicId && !imageToRemove.isTemp) {
      try {
        const deleted = await deleteImageFromCloudinary(imageToRemove.publicId);
        if (deleted) {
          toast.success("Imagen eliminada correctamente");
        } else {
          toast.error("Error al eliminar imagen del servidor");
        }
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        toast.error("Error al eliminar imagen: " + error.message);
      }
    }

    // Reset file input value and change key to allow reselecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileInputKey(Date.now()); // This is crucial for allowing reselection
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      processNewImages(files);
    }
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

  // Updated submit handler that uploads images when form is saved
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validation checks
      if (!formData.name || !formData.address) {
        setFormStatus({
          isSubmitting: false,
          error: "Nombre y dirección son campos obligatorios",
          success: false,
        });
        return;
      }

      setFormStatus({
        isSubmitting: true,
        error: null,
        success: false,
      });

      setIsLoading(true);

      // Separate temporary images from already-uploaded images
      const tempImages = formData.images.filter(
        (img) => img.isTemp && img.file
      );
      const permanentImages = formData.images.filter((img) => !img.isTemp);

      // Track uploading state for UI
      setUploadingImages(tempImages.map((img) => img.id));

      // Upload all temporary images to Cloudinary now
      const uploadedImages = [];
      for (const image of tempImages) {
        try {
          // Now we upload to Cloudinary
          const result = await uploadImageToCloudinary(image.file);

          uploadedImages.push({
            id: image.id,
            url: result.url,
            altText: image.altText || image.file.name,
            isFeatured: image.isFeatured || false,
            publicId: result.publicId,
            width: result.width,
            height: result.height,
            format: result.format,
          });

          // Remove from uploading tracking
          setUploadingImages((prev) => prev.filter((id) => id !== image.id));

          // Clean up object URL
          URL.revokeObjectURL(image.url);
        } catch (error) {
          console.error(`Error uploading image ${image.file.name}:`, error);
          setUploadingImages((prev) => prev.filter((id) => id !== image.id));
          toast.error(
            `Error al subir ${image.file.name}: ${
              error.message || "Error desconocido"
            }`
          );
          // Skip this image in submission
        }
      }

      // Combine permanent images with newly uploaded ones
      const allImages = [...permanentImages, ...uploadedImages];

      // Format data for API
      const placeData = {
        id: isEditing ? resolvedParams.id : undefined, // Include ID if editing
        // Basic place information
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

        // Convert our ids arrays to match your backend's expected format
        categories: formData.categoryIds || [],
        subcategories: formData.subcategoryIds || [],
        features: formData.featureIds || [],

        // Only include successfully uploaded images
        images: allImages.map((img) => ({
          url: img.url,
          altText: img.altText || "Place image",
          isFeatured: img.isFeatured || false,
          publicId: img.publicId || null,
          width: img.width || null,
          height: img.height || null,
          format: img.format || null,
        })),

        operatingHours: formData.operatingHours,
        popularItems: formData.popularItems || [],
      };

      // Use store action to save place
      const result = await savePlace(placeData, isEditing);

      if (result.success) {
        setFormStatus({
          isSubmitting: false,
          error: null,
          success: true,
        });

        // Toast notification
        toast.success(
          isEditing
            ? "El lugar ha sido actualizado exitosamente"
            : "El lugar ha sido añadido exitosamente"
        );

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/admin/places");
        }, 1500);
      } else {
        throw new Error(result.error || "Error saving place");
      }
    } catch (error) {
      console.error(
        isEditing ? "Error al actualizar lugar:" : "Error al guardar lugar:",
        error
      );

      setFormStatus({
        isSubmitting: false,
        error: error.message,
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Clean up any temporary image URLs before navigating away
    formData.images.forEach((img) => {
      if (img.isTemp && img.url) {
        URL.revokeObjectURL(img.url);
      }
    });
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
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <motion.button
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            onClick={handleCancel}
            className="mr-4 p-2 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <motion.div
            initial={{ x: prefersReducedMotion ? 0 : -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <MapPin className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
              {isEditing ? "Editar Lugar" : "Agregar Nuevo Lugar"}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {isEditing
                ? "Actualiza la información de este lugar en WhereToGo"
                : "Completa los detalles para agregar un nuevo lugar a la plataforma WhereToGo"}
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 flex flex-col items-center justify-center"
          >
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 border-purple-200 dark:border-t-purple-400 dark:border-gray-700 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Coffee className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {isEditing
                ? "Cargando información del lugar"
                : "Preparando formulario"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Por favor espere mientras se cargan los datos...
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: prefersReducedMotion ? 0 : 0.1,
                },
              },
            }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Additional error handling for store errors */}
            <AnimatePresence>
              {(storeError || formStatus.error) && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <div className="flex">
                    <motion.div
                      initial={{ rotate: prefersReducedMotion ? 0 : 90 }}
                      animate={{ rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-3" />
                    </motion.div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                        Error
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        {storeError || formStatus.error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {formStatus.success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30 rounded-xl p-6 text-center"
                >
                  <motion.div
                    className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center mb-4 mx-auto"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2,
                    }}
                  >
                    <CheckCircle className="h-8 w-8 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                    ¡{isEditing ? "Lugar Actualizado" : "Lugar Agregado"}{" "}
                    Exitosamente!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    {isEditing
                      ? "Los cambios han sido guardados correctamente."
                      : "El nuevo lugar ha sido añadido a la plataforma."}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-3">
                    Redirigiendo a la lista de lugares...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Basic Info & Contact */}
              <motion.div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <motion.div
                  variants={slideIn}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <Info className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Información Básica
                    </h3>
                  </div>
                  <div className="px-5 py-5 space-y-5">
                    <motion.div variants={itemFadeIn}>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        placeholder="Nombre del lugar"
                      />
                    </motion.div>

                    <motion.div variants={itemFadeIn}>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Descripción
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        placeholder="Describe este lugar detalladamente para ayudar a los usuarios a conocerlo mejor"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Una buena descripción mejora la visibilidad del lugar en
                        las búsquedas
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Contact and Location */}
                <motion.div
                  variants={slideIn}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Contacto y Ubicación
                    </h3>
                  </div>
                  <div className="px-5 py-5 space-y-5">
                    <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-6">
                      <motion.div
                        variants={itemFadeIn}
                        className="sm:col-span-6"
                      >
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Dirección <span className="text-red-500">*</span>
                        </label>
                        <div className="relative rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                            className="block w-full pl-12 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-purple-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="Dirección completa del lugar"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        variants={itemFadeIn}
                        className="sm:col-span-3"
                      >
                        <label
                          htmlFor="latitude"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Latitud
                        </label>
                        <div className="relative rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Compass className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.000001"
                            id="latitude"
                            name="latitude"
                            value={formData.latitude || ""}
                            onChange={handleInputChange}
                            className="block w-full pl-12 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="ej. 40.7128"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        variants={itemFadeIn}
                        className="sm:col-span-3"
                      >
                        <label
                          htmlFor="longitude"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Longitud
                        </label>
                        <div className="relative rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Compass className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.000001"
                            id="longitude"
                            name="longitude"
                            value={formData.longitude || ""}
                            onChange={handleInputChange}
                            className="block w-full pl-12 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="ej. -74.0060"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        variants={itemFadeIn}
                        className="sm:col-span-3"
                      >
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Teléfono
                        </label>
                        <div className="relative rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleInputChange}
                            className="block w-full pl-12 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="ej. +1 (555) 123-4567"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        variants={itemFadeIn}
                        className="sm:col-span-3"
                      >
                        <label
                          htmlFor="website"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Sitio Web
                        </label>
                        <div className="relative rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website || ""}
                            onChange={handleInputChange}
                            className="block w-full pl-12 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:outline-none dark:bg-gray-700 dark:text-white"
                            placeholder="ej. https://ejemplo.com"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Operating Hours */}
                <motion.div
                  variants={slideIn}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Horario de Operación
                    </h3>
                  </div>
                  <div className="px-5 py-5">
                    <motion.p
                      variants={itemFadeIn}
                      className="text-sm text-gray-500 dark:text-gray-400 mb-4"
                    >
                      Establece los horarios de apertura y cierre para cada día
                      de la semana
                    </motion.p>

                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="isOpenNow"
                        name="isOpenNow"
                        checked={formData.isOpenNow || false}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label
                        htmlFor="isOpenNow"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        ¿Actualmente abierto?
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {formData.operatingHours.map((hours, index) => (
                        <motion.div
                          key={hours.day}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          className="bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-100/80 dark:bg-gray-700/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {hours.day}
                            </h4>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
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
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
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
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Image Upload */}
                <motion.div
                  variants={slideIn}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Imágenes
                    </h3>
                  </div>
                  <div className="px-5 py-5 space-y-5">
                    <motion.div
                      variants={itemFadeIn}
                      whileHover={{ scale: prefersReducedMotion ? 1 : 1.01 }}
                    >
                      <div
                        className={`cursor-pointer border-2 border-dashed rounded-lg transition-colors ${
                          isDraggingOver
                            ? "border-purple-400 bg-purple-50 dark:border-purple-500/50 dark:bg-purple-900/20"
                            : "border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/20"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center justify-center py-6 px-4">
                          <Upload
                            className={`h-10 w-10 mb-3 ${
                              isDraggingOver
                                ? "text-purple-500 dark:text-purple-400"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          />
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {isDraggingOver
                                ? "Suelta para cargar"
                                : "Arrastra y suelta imágenes aquí o haz clic para explorar"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              PNG, JPG, GIF hasta 10MB
                            </p>
                          </div>
                          <input
                            id="image-upload"
                            key={fileInputKey}
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Display uploading status during form submission */}
                    {uploadingImages.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                      >
                        <div className="flex items-center">
                          <Loader className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-spin mr-3" />
                          <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Subiendo {uploadingImages.length}{" "}
                              {uploadingImages.length === 1
                                ? "imagen"
                                : "imágenes"}
                              ...
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                              Por favor espera mientras se completa la carga
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {formData.images.length > 0 && (
                      <motion.div variants={itemFadeIn}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Imágenes Seleccionadas ({formData.images.length})
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Haz clic en una imagen para establecerla como
                            destacada
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {formData.images.map((image, index) => (
                            <motion.div
                              key={image.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="relative group"
                            >
                              <div
                                className={`aspect-square rounded-lg overflow-hidden shadow-sm border-2 transition-all ${
                                  image.isFeatured
                                    ? "border-purple-400 dark:border-purple-600 ring-2 ring-purple-300 dark:ring-purple-500/30"
                                    : "border-gray-200 dark:border-gray-700 group-hover:border-purple-200 dark:group-hover:border-purple-700/50"
                                } ${
                                  image.hasError
                                    ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/10"
                                    : ""
                                } ${
                                  image.isTemp
                                    ? "border-amber-300 dark:border-amber-600/50"
                                    : ""
                                }`}
                                onClick={() =>
                                  !image.hasError &&
                                  handleSetFeaturedImage(image.id)
                                }
                              >
                                {/* Show indicator for temporary local images */}
                                {image.isTemp && (
                                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-bl-md">
                                    Local
                                  </div>
                                )}

                                <img
                                  src={image.url}
                                  alt={image.altText || "Imagen del lugar"}
                                  className={`h-full w-full object-cover ${
                                    image.hasError ? "opacity-50" : ""
                                  }`}
                                />

                                {image.isFeatured && !image.hasError && (
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center p-2">
                                    <span className="text-xs font-medium text-white bg-purple-600 px-2 py-0.5 rounded-full">
                                      Imagen Principal
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <motion.button
                                  whileHover={{
                                    scale: prefersReducedMotion ? 1 : 1.1,
                                  }}
                                  whileTap={{
                                    scale: prefersReducedMotion ? 1 : 0.9,
                                  }}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(image.id);
                                  }}
                                  className="bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                  <X size={14} />
                                </motion.button>
                              </div>

                              {/* Show information about upload status */}
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="truncate">
                                  {image.isTemp
                                    ? "Se subirá al guardar el formulario"
                                    : image.format && image.width
                                    ? `${image.width}x${
                                        image.height
                                      } ${image.format.toUpperCase()}`
                                    : "Imagen guardada"}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Column - Additional Details, Categories & Popular Items */}
              <motion.div className="space-y-6">
                {/* Additional Details */}
                <motion.div
                  variants={slideIn}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <Info className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Detalles Adicionales
                    </h3>
                  </div>
                  <div className="px-5 py-5 space-y-5">
                    <motion.div variants={itemFadeIn}>
                      <label
                        htmlFor="cuisine"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Tipo de Cocina / Especialidad
                      </label>
                      <input
                        type="text"
                        id="cuisine"
                        name="cuisine"
                        value={formData.cuisine || ""}
                        onChange={handleInputChange}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                        placeholder="ej. Italiana, Japonesa, etc."
                      />
                    </motion.div>

                    <motion.div variants={itemFadeIn}>
                      <label
                        htmlFor="priceLevel"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Nivel de Precio
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="priceLevel"
                          name="priceLevel"
                          value={formData.priceLevel || ""}
                          onChange={handleInputChange}
                          className="block w-full pl-12 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white appearance-none"
                        >
                          <option value="">Seleccionar nivel de precio</option>
                          <option value="$">$ (Económico)</option>
                          <option value="$$">$$ (Moderado)</option>
                          <option value="$$$">$$$ (Costoso)</option>
                          <option value="$$$$">$$$$ (Muy Costoso)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemFadeIn}>
                      <label
                        htmlFor="rating"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Calificación Inicial (0-5)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                          className="block w-full pl-12 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                          placeholder="ej. 4.5"
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Categories */}
                <motion.div
                  variants={slideIn}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <LayoutList className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Categorías
                    </h3>
                  </div>
                  <div className="px-5 py-5">
                    <motion.div variants={itemFadeIn} className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Selecciona las categorías aplicables
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categories.map((category, index) => (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCategorySelect(category.id)}
                            className={`cursor-pointer flex items-center p-3 rounded-lg transition-colors ${
                              formData.categoryIds.includes(category.id)
                                ? "border-2 dark:bg-opacity-15"
                                : "border border-gray-200 dark:border-gray-700"
                            }`}
                            style={{
                              borderColor: formData.categoryIds.includes(
                                category.id
                              )
                                ? category.color
                                : undefined,
                              backgroundColor: formData.categoryIds.includes(
                                category.id
                              )
                                ? `${category.color}15`
                                : undefined,
                            }}
                          >
                            <div className="flex items-center">
                              <div
                                className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${
                                  formData.categoryIds.includes(category.id)
                                    ? "bg-white dark:bg-gray-800"
                                    : "bg-gray-100 dark:bg-gray-700"
                                }`}
                                style={{
                                  border: formData.categoryIds.includes(
                                    category.id
                                  )
                                    ? `2px solid ${category.color}`
                                    : undefined,
                                }}
                              >
                                {category.icon && (
                                  <DynamicIcon
                                    name={category.icon}
                                    size={18}
                                    style={{ color: category.color }}
                                  />
                                )}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {category.name}
                                </p>
                              </div>
                            </div>

                            <div className="ml-auto">
                              <div
                                className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                  formData.categoryIds.includes(category.id)
                                    ? `bg-${category.color}-500 border-transparent`
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                                style={{
                                  backgroundColor:
                                    formData.categoryIds.includes(category.id)
                                      ? category.color
                                      : undefined,
                                }}
                              >
                                {formData.categoryIds.includes(category.id) && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  variants={slideIn}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <LayoutList className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Características
                    </h3>
                  </div>
                  <div className="px-5 py-5">
                    <motion.div variants={itemFadeIn}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selecciona las características y comodidades
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                          <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleMultiSelectChange("featureIds", feature.id)
                            }
                            className={`cursor-pointer flex items-center p-3 rounded-lg transition-all ${
                              formData.featureIds.includes(feature.id)
                                ? "border-2 border-purple-400 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-600"
                                : "border border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/20"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              <div
                                className={`h-5 w-5 rounded border flex items-center justify-center ${
                                  formData.featureIds.includes(feature.id)
                                    ? "bg-purple-500 border-transparent"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                              >
                                {formData.featureIds.includes(feature.id) && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                            </div>
                            <label
                              htmlFor={`feature-${feature.id}`}
                              className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                              {feature.name}
                            </label>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Popular Items */}
                <motion.div
                  variants={slideIn}
                  className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <LayoutList className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                      Artículos Populares
                    </h3>
                  </div>
                  <div className="px-5 py-5 space-y-4">
                    <motion.div variants={itemFadeIn}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Agregar artículos populares o destacados
                      </label>

                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newPopularItem}
                          onChange={(e) => setNewPopularItem(e.target.value)}
                          placeholder="Ej: Spaghetti Carbonara"
                          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addPopularItem();
                            }
                          }}
                        />
                        <motion.button
                          whileHover={{
                            scale: prefersReducedMotion ? 1 : 1.03,
                          }}
                          whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}
                          type="button"
                          onClick={addPopularItem}
                          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-sm flex items-center"
                        >
                          <PlusCircle size={16} className="mr-1.5" />
                          Agregar
                        </motion.button>
                      </div>

                      <div className="mt-3 space-y-2">
                        {formData.popularItems.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 p-3 rounded-lg group hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                          >
                            <span className="text-gray-800 dark:text-gray-200 font-medium">
                              {typeof item === "object" ? item.name : item}
                            </span>
                            <motion.button
                              whileHover={{
                                scale: prefersReducedMotion ? 1 : 1.1,
                              }}
                              whileTap={{
                                scale: prefersReducedMotion ? 1 : 0.9,
                              }}
                              type="button"
                              onClick={() => removePopularItem(index)}
                              className="text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-200 opacity-60 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={16} />
                            </motion.button>
                          </motion.div>
                        ))}

                        {formData.popularItems.length === 0 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 text-center">
                            No se han agregado artículos populares
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Form Actions */}
            <motion.div
              variants={slideIn}
              className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 py-5 px-6 flex justify-between items-center"
            >
              <motion.button
                whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 font-medium"
              >
                Cancelar
              </motion.button>

              <motion.button
                whileHover={{
                  scale: formStatus.isSubmitting
                    ? 1.0
                    : prefersReducedMotion
                    ? 1
                    : 1.02,
                }}
                whileTap={{
                  scale: formStatus.isSubmitting
                    ? 1.0
                    : prefersReducedMotion
                    ? 1
                    : 0.98,
                }}
                type="submit"
                disabled={formStatus.isSubmitting}
                className={`px-5 py-2.5 text-white rounded-lg shadow-sm font-medium flex items-center ${
                  formStatus.isSubmitting
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                }`}
              >
                {formStatus.isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    {uploadingImages.length > 0
                      ? `Subiendo imágenes (${uploadingImages.length})...`
                      : "Guardando..."}
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    {isEditing ? "Actualizar Lugar" : "Guardar Lugar"}
                    {formData.images.filter((img) => img.isTemp).length > 0 && (
                      <span className="ml-1 text-xs bg-white/20 rounded-full px-2 py-0.5">
                        {formData.images.filter((img) => img.isTemp).length}{" "}
                        imágenes
                      </span>
                    )}
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
}
