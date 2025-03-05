"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Search,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Calendar,
  ChevronDown,
  Edit,
  Trash2,
  X,
  ImageIcon,
  Save,
  Link,
  Phone,
  Menu,
  ArrowUpDown,
  Filter,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ViewPlaceModal from "@/app/components/ViewPlaceModal";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

export default function PlacesManagement() {
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceLevel, setSelectedPriceLevel] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const router = useRouter();

  // Modal states
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [isEditingPlace, setIsEditingPlace] = useState(false);
  const [isViewingPlace, setIsViewingPlace] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
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
  });

  useEffect(() => {
    // Fetch places, categories, subcategories, and features
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // These would be actual API calls in your implementation
        const placesData = await fetchPlaces();
        const categoriesData = await fetchCategories();
        const subcategoriesData = await fetchSubcategories();
        const featuresData = await fetchFeatures();

        setPlaces(placesData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setFeatures(featuresData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // For demo purposes - replace with real API calls
  const fetchPlaces = () =>
    Promise.resolve([
      {
        id: 1,
        name: "Café Deluxe",
        description: "Un acogedor café con increíbles pasteles",
        rating: 4.5,
        priceLevel: "$",
        address: "Calle Principal 123",
        categories: [{ id: 2, name: "Cafeterías" }],
        images: [{ id: 1, url: "/images/cafe.avif" }],
      },
      {
        id: 2,
        name: "Restaurante Costero",
        description: "Mariscos frescos con vista al mar",
        rating: 4.8,
        priceLevel: "$$$",
        address: "Bulevar de la Playa 456",
        categories: [{ id: 1, name: "Restaurantes" }],
        images: [{ id: 2, url: "/images/restaurante.avif" }],
      },
    ]);

  const fetchCategories = () =>
    Promise.resolve([
      { id: 1, name: "Restaurantes", icon: "🍽️" },
      { id: 2, name: "Cafeterías", icon: "☕" },
      { id: 3, name: "Bares", icon: "🍸" },
    ]);

  const fetchSubcategories = () =>
    Promise.resolve([
      { id: 1, name: "Italiano", categoryId: 1 },
      { id: 2, name: "Japonés", categoryId: 1 },
      { id: 3, name: "Cafetería", categoryId: 2 },
      { id: 4, name: "Panadería", categoryId: 2 },
      { id: 5, name: "Bar de Cócteles", categoryId: 3 },
    ]);

  const fetchFeatures = () =>
    Promise.resolve([
      { id: 1, name: "Wi-Fi" },
      { id: 2, name: "Asientos al Aire Libre" },
      { id: 3, name: "Estacionamiento" },
      { id: 4, name: "Admite Mascotas" },
    ]);

  const handleAddPlace = () => {
    router.push(`/admin/places/edit/add`);
  };

  const handleEditPlace = (place) => {
    router.push(`/admin/places/edit/${place.id}`);
  };

  const handleViewPlace = (place) => {
    setSelectedPlaceId(place.id);
    // Similar to edit but for view only
    setFormData({
      name: place.name,
      description: place.description || "",
      rating: place.rating || null,
      priceLevel: place.priceLevel || "",
      address: place.address || "",
      phone: place.phone || "",
      website: place.website || "",
      cuisine: place.cuisine || "",
      isOpenNow: place.isOpenNow || false,
      latitude: place.latitude || null,
      longitude: place.longitude || null,
      categoryIds: place.categories?.map((c) => c.id) || [],
      subcategoryIds: [], // You'd populate this from your actual data
      featureIds: [], // You'd populate this from your actual data
      images: place.images || [],
      operatingHours: place.operatingHours || [],
    });
    setIsViewingPlace(true);
  };

  const handleDeletePrompt = (placeId) => {
    setSelectedPlaceId(placeId);
    setIsConfirmingDelete(true);
  };

  const handleDeletePlace = async () => {
    // Actual API call to delete place
    try {
      // await deletePlace(selectedPlaceId);

      // Update local state
      setPlaces(places.filter((place) => place.id !== selectedPlaceId));
      setIsConfirmingDelete(false);
      setSelectedPlaceId(null);

      // Show success message
    } catch (error) {
      console.error("Error al eliminar lugar:", error);
      // Show error message
    }
  };

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

  const handleSavePlace = async () => {
    try {
      // Validate form data
      if (!formData.name || !formData.address) {
        // Show validation error
        return;
      }

      // Create or update place
      if (isAddingPlace) {
        // API call to create place
        // const newPlace = await createPlace(formData);
        // setPlaces([...places, newPlace]);
        console.log("Creando lugar con datos:", formData);
      } else {
        // API call to update place
        // const updatedPlace = await updatePlace(selectedPlaceId, formData);
        // setPlaces(places.map(place => place.id === selectedPlaceId ? updatedPlace : place));
        console.log("Actualizando lugar con datos:", formData);
      }

      // Close modal and reset
      setIsAddingPlace(false);
      setIsEditingPlace(false);
      setSelectedPlaceId(null);

      // Show success message
    } catch (error) {
      console.error("Error al guardar lugar:", error);
      // Show error message
    }
  };

  // Filter and sort places
  const filteredPlaces = places
    .filter((place) => {
      // Search query filter
      const matchesSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (place.description &&
          place.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 ||
        place.categories.some((category) =>
          selectedCategories.includes(category.id)
        );

      // Price level filter
      const matchesPrice =
        !selectedPriceLevel || place.priceLevel === selectedPriceLevel;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      // Sort by selected field
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "rating") {
        comparison = (a.rating || 0) - (b.rating || 0);
      }

      // Apply sort direction
      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Lugares
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Agregar, editar y gestionar todos los lugares en tu plataforma
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddPlace}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Agregar Nuevo Lugar
          </motion.button>
        </div>
      </div>

      {/* Filters and Search */}
      <motion.div 
        variants={slideIn}
        className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -mt-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar lugares..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="relative">
          <select
            value={selectedPriceLevel}
            onChange={(e) => setSelectedPriceLevel(e.target.value)}
            className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
          >
            <option value="">Nivel de Precio (Todos)</option>
            <option value="$">$ (Económico)</option>
            <option value="$$">$$ (Moderado)</option>
            <option value="$$$">$$$ (Costoso)</option>
            <option value="$$$$">$$$$ (Muy Costoso)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -mt-2 h-4 w-4 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-4 pr-10 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white appearance-none"
          >
            <option value="name">Ordenar por Nombre</option>
            <option value="rating">Ordenar por Calificación</option>
            <option value="createdAt">Ordenar por Fecha de Agregado</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -mt-2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
            className="flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowUpDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Filtros
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Category filter chips */}
      <motion.div 
        variants={slideIn}
        className="mt-4 flex flex-wrap gap-2"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategories((prev) =>
                prev.includes(category.id)
                  ? prev.filter((id) => id !== category.id)
                  : [...prev, category.id]
              );
            }}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              selectedCategories.includes(category.id)
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            <span className="mr-1.5">{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Places Table */}
      <motion.div 
        variants={slideIn}
        className="mt-6 overflow-x-auto"
      >
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Lugar
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Categorías
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Calificación
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Precio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Dirección
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Cargando lugares...
                    </td>
                  </tr>
                ) : filteredPlaces.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No se encontraron lugares. Intenta ajustar tu búsqueda o filtros.
                    </td>
                  </tr>
                ) : (
                  filteredPlaces.map((place, index) => (
                    <motion.tr
                      key={place.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {place.categories && place.categories.length > 0 ? (
                              <div className="h-10 w-10 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                <span className="text-lg">
                                  {categories.find(cat => cat.id === place.categories[0].id)?.icon || "🏠"}
                                </span>
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-lg">🏠</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {place.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {place.description || "Sin descripción disponible"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {place.categories.map((category) => (
                            <span
                              key={`place-${place.id}-cat-${category.id}`}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {place.rating?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {place.priceLevel || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="truncate max-w-[200px]">
                            {place.address}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewPlace(place)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          >
                            <Eye size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditPlace(place)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                          >
                            <Edit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeletePrompt(place.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* View Place Modal */}
      <ViewPlaceModal
        isOpen={isViewingPlace}
        onClose={() => setIsViewingPlace(false)}
        onEdit={() => {
          setIsViewingPlace(false);
          handleEditPlace(places.find((p) => p.id === selectedPlaceId));
        }}
        place={formData}
        categories={categories}
        features={features}
      />

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 dark:bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl ring-1 ring-gray-200 dark:ring-gray-700"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100/80 text-red-600 ring-4 ring-red-600/20 sm:mx-0 sm:h-10 sm:w-10">
                <Trash2 className="stroke-[2.5]" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Eliminar Lugar
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ¿Estás seguro de que quieres eliminar este lugar? Esta acción
                    no se puede deshacer y todos los datos asociados se eliminarán
                    permanentemente.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDeletePlace}
                className="inline-flex w-full justify-center rounded-lg border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
              >
                Eliminar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="mt-3 inline-flex w-full justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Pagination */}
      <motion.div 
        variants={slideIn}
        className="mt-6 flex items-center justify-between"
      >
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Mostrando <span className="font-medium">1</span> a{" "}
          <span className="font-medium">{filteredPlaces.length}</span> de{" "}
          <span className="font-medium">{places.length}</span> lugares
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 opacity-50 cursor-not-allowed"
          >
            Anterior
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            1
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 opacity-50 cursor-not-allowed"
          >
            Siguiente
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}