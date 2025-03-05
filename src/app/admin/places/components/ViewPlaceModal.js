import { motion } from "framer-motion";
import {
  X,
  Star,
  DollarSign,
  MapPin,
  Phone,
  Link,
  Clock,
  Menu,
  Image as ImageIcon,
  Edit,
} from "lucide-react";

export default function ViewPlaceModal({
  isOpen,
  onClose,
  onEdit,
  place,
  categories,
  features,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 dark:bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 w-full max-w-3xl max-h-[90vh] overflow-hidden"
      >
        <div className="relative">
          {/* Header Image */}
          <div className="h-48 bg-gray-200 dark:bg-gray-700">
            {place.images && place.images.length > 0 ? (
              <img
                src={place.images[0].url}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.94 }}
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full p-2"
          >
            <X size={18} />
          </motion.button>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(90vh-192px)]">
          {/* Basic Info */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {place.name}
            </h2>

            <div className="flex items-center text-gray-700 dark:text-gray-300 space-x-4">
              {place.rating && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500 mr-1" />
                  <span>{place.rating.toFixed(1)}</span>
                </div>
              )}

              {place.priceLevel && (
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
                  <span>{place.priceLevel}</span>
                </div>
              )}
            </div>

            {place.categories && (
              <div className="flex flex-wrap gap-1 mt-2">
                {categories
                  .filter((cat) => place.categoryIds.includes(cat.id))
                  .map((category) => (
                    <span
                      key={`view-cat-${category.id}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {category.icon} {category.name}
                    </span>
                  ))}
              </div>
            )}

            {place.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                {place.description}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-8 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-start">
              <MapPin className="flex-shrink-0 h-5 w-5 text-gray-500 mt-0.5" />
              <span className="ml-3 text-gray-700 dark:text-gray-300">
                {place.address}
              </span>
            </div>

            {place.phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="ml-3 text-gray-700 dark:text-gray-300">
                  {place.phone}
                </span>
              </div>
            )}

            {place.website && (
              <div className="flex items-center">
                <Link className="h-5 w-5 text-gray-500" />
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {place.website}
                </a>
              </div>
            )}
          </div>

          {/* Hours & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
            {/* Operating Hours */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                <Clock className="inline-block mr-2 h-5 w-5" />
                Operating Hours
              </h3>
              <div className="space-y-2">
                {place.operatingHours.map((hour) => (
                  <div key={hour.day} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {hour.day}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {hour.openingTime} - {hour.closingTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                <Menu className="inline-block mr-2 h-5 w-5" />
                Features & Amenities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {features
                  .filter((f) => place.featureIds.includes(f.id))
                  .map((feature) => (
                    <div key={feature.id} className="flex items-center">
                      <div className="h-2 w-2 bg-indigo-500 rounded-full mr-2"></div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature.name}
                      </span>
                    </div>
                  ))}

                {place.featureIds.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 col-span-2">
                    No features specified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Gallery */}
          {place.images.length > 0 && (
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                <ImageIcon className="inline-block mr-2 h-5 w-5" />
                Photos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {place.images.map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={image.altText || place.name}
                    className="h-24 w-full object-cover rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 flex items-center"
          >
            <Edit size={18} className="mr-2" />
            Edit Place
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 