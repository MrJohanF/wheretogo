'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Star, MapPin, Clock, Phone, Globe, Heart,
  ChevronLeft, ChevronRight, Calendar, Users, X
} from 'lucide-react';

// Mock data for a place (in a real app, this would come from an API)
const mockPlace = {
  id: 1,
  name: "La Terraza Restaurant",
  rating: 4.5,
  reviews: [
    { id: 1, user: "María G.", rating: 5, date: "2024-02-20", comment: "¡Excelente comida y servicio!" },
    { id: 2, user: "Juan P.", rating: 4, date: "2024-02-18", comment: "Muy buen ambiente, pero un poco caro." },
    // Add more reviews...
  ],
  images: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    // Add more images...
  ],
  price: "$$",
  distance: "1.2km",
  openNow: true,
  address: "Calle Principal 123",
  phone: "+34 912 345 678",
  website: "https://example.com",
  cuisine: "Mediterránea",
  popular: ["Paella", "Sangría", "Tapas"],
  schedule: {
    "Lunes": "12:00 - 23:00",
    "Martes": "12:00 - 23:00",
    "Miércoles": "12:00 - 23:00",
    "Jueves": "12:00 - 23:00",
    "Viernes": "12:00 - 00:00",
    "Sábado": "12:00 - 00:00",
    "Domingo": "12:00 - 22:00"
  },
  description: "Un restaurante con encanto en el corazón de la ciudad, ofreciendo la mejor cocina mediterránea con productos frescos y de temporada."
};

export default function PlaceDetail() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    guests: 2,
    name: '',
    email: '',
    phone: ''
  });
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? mockPlace.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === mockPlace.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    // Add your booking logic here
    setShowBooking(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with main image and gallery */}
      <div className="relative h-[50vh] bg-gray-900">
        <img
          src={mockPlace.images[currentImageIndex]}
          alt={mockPlace.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Navigation buttons */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <Heart
              size={24}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-800'}
            />
          </button>
        </div>

        {/* Gallery navigation */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
          <button
            onClick={handlePrevImage}
            className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <button
            onClick={handleNextImage}
            className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>
        </div>

        {/* View all photos button */}
        <button
          onClick={() => setShowGallery(true)}
          className="absolute bottom-6 right-6 px-4 py-2 bg-white/90 hover:bg-white rounded-lg transition-colors text-sm font-medium"
        >
          Ver todas las fotos
        </button>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900">{mockPlace.name}</h1>
            
            <div className="flex items-center mt-2">
              <Star size={20} className="text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-900">{mockPlace.rating}</span>
              <span className="mx-2">•</span>
              <span className="text-gray-600">{mockPlace.reviews.length} reseñas</span>
              <span className="mx-2">•</span>
              <span className="text-gray-600">{mockPlace.cuisine}</span>
            </div>

            <p className="mt-4 text-gray-600">{mockPlace.description}</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center text-gray-600">
                <MapPin size={20} className="mr-2" />
                {mockPlace.address}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={20} className="mr-2" />
                {mockPlace.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <Globe size={20} className="mr-2" />
                <a href={mockPlace.website} className="text-indigo-600 hover:underline">
                  {mockPlace.website}
                </a>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={20} className="mr-2" />
                {mockPlace.openNow ? (
                  <span className="text-green-600">Abierto ahora</span>
                ) : (
                  <span className="text-red-600">Cerrado</span>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Horario</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {Object.entries(mockPlace.schedule).map(([day, hours]) => (
                  <div key={day} className="flex justify-between py-2">
                    <span className="text-gray-600">{day}</span>
                    <span className="text-gray-900">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reseñas</h2>
              <div className="space-y-6">
                {mockPlace.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{review.user}</span>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-600">{review.rating}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                    <span className="mt-2 text-sm text-gray-500 block">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Hacer reserva
                </h3>
                <button
                  onClick={() => setShowBooking(true)}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Reservar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full screen gallery */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <div className="relative w-full h-full flex items-center">
              <button
                onClick={handlePrevImage}
                className="absolute left-4 p-2 text-white hover:text-gray-300"
              >
                <ChevronLeft size={32} />
              </button>
              <img
                src={mockPlace.images[currentImageIndex]}
                alt={mockPlace.name}
                className="w-full h-full object-contain"
              />
              <button
                onClick={handleNextImage}
                className="absolute right-4 p-2 text-white hover:text-gray-300"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Reservar mesa
                </h3>
                <button
                  onClick={() => setShowBooking(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    required
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de personas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={bookingData.guests}
                    onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Confirmar reserva
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 