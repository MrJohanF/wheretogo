"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Globe,
  Heart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  X,
  Share2,
  Navigation,
  ExternalLink,
  Menu,
  Info,
  MessageCircle,
  Image as ImageIcon,
  Check,
  MapPinned,
  Coffee,
  ThumbsUp,
  CircleCheck,
  CircleDashed,
  Upload,
  Bookmark,
} from "lucide-react";
import Image from "next/image";

// Mock data for a place (in a real app, this would come from an API)
const mockPlace = {
  id: 1,
  name: "La Terraza Restaurant",
  rating: 4.5,
  reviews: [
    {
      id: 1,
      user: "María G.",
      rating: 5,
      date: "2024-02-20",
      comment: "¡Excelente comida y servicio!",
    },
    {
      id: 2,
      user: "Juan P.",
      rating: 4,
      date: "2024-02-18",
      comment: "Muy buen ambiente, pero un poco caro.",
    },
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
    Lunes: "12:00 - 23:00",
    Martes: "12:00 - 23:00",
    Miércoles: "12:00 - 23:00",
    Jueves: "12:00 - 23:00",
    Viernes: "12:00 - 00:00",
    Sábado: "12:00 - 00:00",
    Domingo: "12:00 - 22:00",
  },
  description:
    "Un restaurante con encanto en el corazón de la ciudad, ofreciendo la mejor cocina mediterránea con productos frescos y de temporada.",
};

export default function PlaceDetail() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryView, setGalleryView] = useState("single"); // 'single' or 'grid'
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("info");
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  const infoRef = useRef(null);
  const reviewsRef = useRef(null);
  const photosRef = useRef(null);

  // Simulate successful booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    // Add your booking logic here
    setIsBookingSuccess(true);
    setTimeout(() => {
      setIsBookingSuccess(false);
      setShowBooking(false);
    }, 2000);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? mockPlace.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === mockPlace.images.length - 1 ? 0 : prev + 1
    );
  };

  const scrollToSection = (sectionId) => {
    const sectionRefs = {
      info: infoRef,
      reviews: reviewsRef,
      photos: photosRef,
    };

    const ref = sectionRefs[sectionId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSection(sectionId);
  };

  useEffect(() => {
    // Handle intersection observer for sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe sections
    if (infoRef.current) observer.observe(infoRef.current);
    if (reviewsRef.current) observer.observe(reviewsRef.current);
    if (photosRef.current) observer.observe(photosRef.current);

    return () => {
      if (infoRef.current) observer.unobserve(infoRef.current);
      if (reviewsRef.current) observer.unobserve(reviewsRef.current);
      if (photosRef.current) observer.unobserve(photosRef.current);
    };
  }, []);

  // Calculate average rating and stats
  const avgRating = mockPlace.rating;
  const totalReviews = mockPlace.reviews.length;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image Gallery */}
      <div className="relative h-[60vh] bg-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            key={currentImageIndex}
            src={mockPlace.images[currentImageIndex]}
            alt={mockPlace.name}
            initial={{ opacity: 0.8, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-black/10" />
        </div>

        {/* Navigation and Actions */}
        <div className="absolute top-6 left-0 right-0 px-4 sm:px-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Volver atrás"
            >
              <ArrowLeft size={20} className="text-gray-800" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                className="p-2.5 rounded-full bg-white/90 hover:bg-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Compartir"
              >
                <Share2 size={20} className="text-gray-800" />
              </button>

              {/* Share dropdown menu */}
              <AnimatePresence>
                {isShareMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20"
                  >
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center">
                      <Upload size={16} className="mr-2" />
                      WhatsApp
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center">
                      <Upload size={16} className="mr-2" />
                      Facebook
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center">
                      <Upload size={16} className="mr-2" />
                      Twitter
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center">
                      <Upload size={16} className="mr-2" />
                      Copiar enlace
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-white/50 \${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 hover:bg-white text-gray-800'
              }`}
              aria-label={
                isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
              }
            >
              <Heart size={20} className={isFavorite ? "fill-white" : ""} />
            </button>
          </div>
        </div>

        {/* Gallery Navigation*/}
        <div className="absolute top-0 bottom-24 left-0 right-0 flex items-center justify-between px-4 z-10">
          <button
            onClick={handlePrevImage}
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={handleNextImage}
            className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>

        {/* Image Counter and View All */}
        <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-between items-center z-20">
          <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
            {currentImageIndex + 1} / {mockPlace.images.length}
          </div>

          <button
            onClick={() => {
              setShowGallery(true);
              setGalleryView("single");
            }}
            className="px-4 py-2.5 bg-white/90 hover:bg-white rounded-lg transition-colors text-sm font-medium shadow-md flex items-center"
          >
            <ImageIcon size={16} className="mr-2" />
            Ver todas las fotos
          </button>
        </div>

        {/* Restaurant Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center">
              {mockPlace.openNow ? (
                <span className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center mr-3">
                  <Clock size={12} className="mr-1" />
                  Abierto ahora
                </span>
              ) : (
                <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center mr-3">
                  <Clock size={12} className="mr-1" />
                  Cerrado
                </span>
              )}

              <span className="bg-gray-800/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full mr-3">
                {mockPlace.price}
              </span>

              <span className="bg-gray-800/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center">
                <MapPin size={12} className="mr-1" />
                {mockPlace.distance}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-2 drop-shadow-sm">
              {mockPlace.name}
            </h1>

            <div className="flex items-center mt-2 text-white/90">
              <div className="flex items-center bg-yellow-500/20 backdrop-blur-sm text-yellow-300 px-2.5 py-1 rounded-full">
                <Star size={16} className="text-yellow-300 fill-current" />
                <span className="ml-1 font-medium">{mockPlace.rating}</span>
              </div>
              <span className="mx-2">•</span>
              <span>{mockPlace.reviews.length} reseñas</span>
              <span className="mx-2">•</span>
              <span>{mockPlace.cuisine}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => scrollToSection("info")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap \${
          activeSection === 'info' 
            ? 'border-indigo-600 text-indigo-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
            >
              Información
            </button>
            <button
              onClick={() => scrollToSection("reviews")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap \${
          activeSection === 'reviews' 
            ? 'border-indigo-600 text-indigo-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
            >
              Reseñas ({mockPlace.reviews.length})
            </button>
            <button
              onClick={() => scrollToSection("photos")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap \${
          activeSection === 'photos' 
            ? 'border-indigo-600 text-indigo-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700'
        }`}
            >
              Fotos ({mockPlace.images.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            {/* Info Section */}
            <div id="info" ref={infoRef} className="scroll-mt-16 pb-10">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                    <Info size={20} className="mr-2 text-indigo-600" />
                    Acerca de {mockPlace.name}
                  </h2>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {mockPlace.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin
                          size={20}
                          className="mr-3 text-indigo-600 mt-0.5 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Ubicación
                          </h4>
                          <p className="text-gray-600">{mockPlace.address}</p>
                          <a
                            href={`https://maps.google.com/?q=\${mockPlace.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center mt-1"
                          >
                            <Navigation size={14} className="mr-1" />
                            Cómo llegar
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone
                          size={20}
                          className="mr-3 text-indigo-600 mt-0.5 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Contacto
                          </h4>
                          <p className="text-gray-600">{mockPlace.phone}</p>
                          <a
                            href={`tel:\${mockPlace.phone.replace(/\s/g, '')}`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center mt-1"
                          >
                            <Phone size={14} className="mr-1" />
                            Llamar ahora
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Globe
                          size={20}
                          className="mr-3 text-indigo-600 mt-0.5 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Sitio web
                          </h4>
                          <a
                            href={mockPlace.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 break-all"
                          >
                            {mockPlace.website}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Especialidades
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {mockPlace.popular.map((item, index) => (
                          <span
                            key={index}
                            className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full flex items-center"
                          >
                            <ThumbsUp size={14} className="mr-1.5" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="my-6 border-gray-100" />

                  {/* Schedule */}
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock size={18} className="mr-2 text-indigo-600" />
                    Horario
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(mockPlace.schedule).map(
                      ([day, hours], index) => (
                        <div
                          key={day}
                          className={`flex justify-between py-2 px-3 rounded-lg \${
                          index === new Date().getDay() 
                            ? 'bg-green-50 text-green-800' 
                            : 'hover:bg-gray-50'
                        }`}
                        >
                          <span
                            className={`\${index === new Date().getDay() ? 'font-medium' : ''}`}
                          >
                            {day}
                          </span>
                          <span>{hours}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Map Preview */}
                <div className="h-64 bg-gray-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Replace with actual map component */}
                    <div className="text-center">
                      <MapPinned
                        size={32}
                        className="mx-auto text-indigo-500 mb-2"
                      />
                      <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium px-4 py-2 rounded-lg shadow-sm transition-colors">
                        Ver ubicación en mapa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews" ref={reviewsRef} className="scroll-mt-16 pb-10">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                    <MessageCircle size={20} className="mr-2 text-indigo-600" />
                    Reseñas ({mockPlace.reviews.length})
                  </h2>

                  {/* Rating Summary */}
                  <div className="flex flex-col sm:flex-row gap-6 bg-indigo-50 p-4 rounded-xl mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-indigo-700">
                        {avgRating}
                      </div>
                      <div className="flex items-center justify-center mt-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`\${
                              i < Math.floor(avgRating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                            />
                          ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {totalReviews}{" "}
                        {totalReviews === 1 ? "reseña" : "reseñas"}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Distribución de puntuaciones
                      </h4>
                      {[5, 4, 3, 2, 1].map((rating) => {
                        // Calculate percentage (this would normally be from real data)
                        const count = mockPlace.reviews.filter(
                          (r) => Math.floor(r.rating) === rating
                        ).length;
                        const percentage =
                          totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                        return (
                          <div
                            key={rating}
                            className="flex items-center mb-1.5"
                          >
                            <div className="w-3 mr-2">{rating}</div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full \${
                                  rating >= 4 ? 'bg-green-500' : 
                                  rating === 3 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `\${percentage}%` }}
                              ></div>
                            </div>
                            <div className="w-9 text-right text-xs text-gray-500">
                              {count}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Write Review Button */}
                  <button className="w-full mb-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center">
                    <Star size={16} className="mr-2" />
                    Escribir una reseña
                  </button>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {mockPlace.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold mr-3">
                              {review.user.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {review.user}
                              </h4>
                              <div className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString(
                                  "es-ES",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center bg-gray-50 px-2 py-1 rounded">
                            <Star
                              size={14}
                              className="text-yellow-400 fill-current"
                            />
                            <span className="ml-1 font-medium text-gray-700">
                              {review.rating}
                            </span>
                          </div>
                        </div>

                        <p className="mt-4 text-gray-600 leading-relaxed">
                          {review.comment}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <button className="flex items-center hover:text-indigo-600">
                              <ThumbsUp size={14} className="mr-1" />
                              Útil
                            </button>
                            <span className="mx-2">•</span>
                            <button className="hover:text-indigo-600">
                              Reportar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show More Button - If you have pagination */}
                  {mockPlace.reviews.length > 5 && (
                    <button className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                      Ver más reseñas
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div id="photos" ref={photosRef} className="scroll-mt-16 pb-10">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                    <ImageIcon size={20} className="mr-2 text-indigo-600" />
                    Galería de fotos ({mockPlace.images.length})
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {mockPlace.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square relative rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setShowGallery(true);
                          setGalleryView("single");
                        }}
                      >
                        <img
                          src={image}
                          alt={`\${mockPlace.name} - imagen \${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100">
                            <div className="bg-white/80 backdrop-blur-sm text-gray-800 rounded-full w-8 h-8 flex items-center justify-center">
                              <ImageIcon size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setShowGallery(true);
                      setGalleryView("grid");
                    }}
                    className="mt-6 w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <ImageIcon size={16} className="mr-2" />
                    Ver todas las fotos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Reservar en {mockPlace.name}
                  </h3>

                  <div className="space-y-4 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <Clock size={16} className="mr-3 text-indigo-600" />
                      {mockPlace.openNow ? (
                        <span className="text-green-700 font-medium">
                          Abierto ahora
                        </span>
                      ) : (
                        <span className="text-red-700 font-medium">
                          Cerrado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Coffee size={16} className="mr-3 text-indigo-600" />
                      Cocina {mockPlace.cuisine}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <Star size={16} className="mr-3 text-indigo-600" />
                      {mockPlace.rating} ({mockPlace.reviews.length} reseñas)
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <MapPin size={16} className="mr-3 text-indigo-600" />
                      {mockPlace.distance} de tu ubicación
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBooking(true)}
                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    <Calendar size={18} className="mr-2" />
                    Reservar ahora
                  </button>
                </div>

                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Acciones rápidas
                  </h4>
                  <div className="flex flex-col space-y-2">
                    <a
                      href={`tel:\${mockPlace.phone.replace(/\s/g, '')}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    >
                      <Phone size={14} className="mr-2" />
                      Llamar directamente
                    </a>
                    <a
                      href={`https://maps.google.com/?q=\${mockPlace.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    >
                      <Navigation size={14} className="mr-2" />
                      Cómo llegar
                    </a>
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    >
                      <Bookmark size={14} className="mr-2" />
                      {isFavorite
                        ? "Guardado en favoritos"
                        : "Guardar en favoritos"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Similar Places - You would need to implement this with real data */}
              <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Lugares similares
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start">
                      <div className="h-14 w-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {/* Replace with actual image */}
                        <div className="h-full w-full bg-indigo-100"></div>
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900">
                          Restaurante {i}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star
                            size={12}
                            className="text-yellow-400 fill-current"
                          />
                          <span className="ml-1">4.{i}</span>
                          <span className="mx-1">•</span>
                          <span>{2 * i}0m</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            <div className="bg-black/90 p-4 flex items-center justify-between">
              <div className="text-white font-medium">
                {galleryView === "single" && (
                  <span>
                    {currentImageIndex + 1} de {mockPlace.images.length} fotos
                  </span>
                )}
                {galleryView === "grid" && (
                  <span>Galería de fotos: {mockPlace.name}</span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    setGalleryView(galleryView === "single" ? "grid" : "single")
                  }
                  className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  {galleryView === "single" ? (
                    <div className="flex items-center">
                      <Menu size={18} className="mr-1" />
                      <span className="text-sm">Cuadrícula</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ImageIcon size={18} className="mr-1" />
                      <span className="text-sm">Individual</span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setShowGallery(false)}
                  className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {galleryView === "single" ? (
              <div className="flex-1 flex items-center justify-center relative">
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>

                <motion.img
                  key={currentImageIndex}
                  src={mockPlace.images[currentImageIndex]}
                  alt={mockPlace.name}
                  initial={{ opacity: 0.8, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-full object-contain"
                />

                <button
                  onClick={handleNextImage}
                  className="absolute right-4 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                  {mockPlace.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setGalleryView("single");
                      }}
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer relative \${
                        index === currentImageIndex ? 'ring-4 ring-indigo-500' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`\${mockPlace.name} - foto \${index + 1}`}
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking modal with enhanced UX */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            >
              {isBookingSuccess ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    ¡Reserva confirmada!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Te hemos enviado un email con todos los detalles de tu
                    reserva.
                  </p>
                  <button
                    onClick={() => {
                      setIsBookingSuccess(false);
                      setShowBooking(false);
                    }}
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Aceptar
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-indigo-600 p-6 text-white">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">Reservar mesa</h3>
                      <button
                        onClick={() => setShowBooking(false)}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <p className="mt-1 text-indigo-100">{mockPlace.name}</p>
                  </div>

                  <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha
                          </label>
                          <div className="relative">
                            <Calendar
                              size={16}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="date"
                              required
                              value={bookingData.date}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  date: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hora
                          </label>
                          <div className="relative">
                            <Clock
                              size={16}
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="time"
                              required
                              value={bookingData.time}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  time: e.target.value,
                                })
                              }
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de personas
                        </label>
                        <div className="relative">
                          <Users
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="number"
                            min="1"
                            max="20"
                            required
                            value={bookingData.guests}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                guests: Math.min(
                                  20,
                                  Math.max(1, parseInt(e.target.value))
                                ),
                              })
                            }
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="border-t border-gray-200 my-4 pt-4">
                        <h4 className="font-medium text-gray-800 mb-3">
                          Tus datos
                        </h4>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Tu nombre completo"
                            value={bookingData.name}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              required
                              placeholder="example@email.com"
                              value={bookingData.email}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  email: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="+34 600 000 000"
                              value={bookingData.phone}
                              onChange={(e) =>
                                setBookingData({
                                  ...bookingData,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peticiones especiales (opcional)
                          </label>
                          <textarea
                            value={bookingData.specialRequests}
                            onChange={(e) =>
                              setBookingData({
                                ...bookingData,
                                specialRequests: e.target.value,
                              })
                            }
                            placeholder="Alergias, preferencia de mesa, ocasión especial..."
                            rows={3}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="terms"
                              type="checkbox"
                              required
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="text-gray-600">
                              Acepto los términos y condiciones y la política de
                              privacidad
                            </label>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
                      >
                        <Calendar size={18} className="mr-2" />
                        Confirmar reserva
                      </button>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
