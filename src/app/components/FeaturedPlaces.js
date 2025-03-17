"use client";
import { MapPin, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import usePlaceStore from '../store/placeStore';

export default function FeaturedPlaces() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredHearts, setHoveredHearts] = useState({});
  
  const { 
    featuredPlaces,
    isFeaturedLoading,
    error,
    fetchFeaturedPlaces,
    getPrimaryImage
  } = usePlaceStore();
  
  useEffect(() => {
    fetchFeaturedPlaces(4); // Fetch 4 featured places
  }, [fetchFeaturedPlaces]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Loading indicator
  if (isFeaturedLoading) {
    return (
      <section className="py-16 bg-gray-50" ref={ref}>
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Lugares Destacados</h2>
            <p className="mt-2 text-lg text-gray-600">
              Descubre lugares de moda amados por locales y viajeros
            </p>
          </div>
          <button className="hidden md:block px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transform hover:scale-105 active:scale-95 transition-transform duration-150">
            Ver Todos
          </button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {featuredPlaces.map((place) => (
            <div key={place.id} className="place-card">
              <motion.div 
                className="bg-white rounded-xl overflow-hidden shadow-md card-translate"
                variants={item}
                style={{ 
                  transform: "translateZ(0)", 
                  backfaceVisibility: "hidden"
                }}
              >
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={getPrimaryImage(place, 500, 300)}
                      alt={place.name} 
                      className="w-full h-full object-cover card-image"
                    />
                  </div>
                  <button 
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md z-10 heart-button"
                    onMouseEnter={() => setHoveredHearts({...hoveredHearts, [place.id]: true})}
                    onMouseLeave={() => setHoveredHearts({...hoveredHearts, [place.id]: false})}
                  >
                    <Heart 
                      className={`h-5 w-5 \${hoveredHearts[place.id] ? 'text-red-500' : 'text-gray-600'}`} 
                    />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm py-1 px-3 rounded-full text-xs font-medium text-indigo-700">
                    {place.type}
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {place.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{place.address || "Ubicación no disponible"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium text-gray-900">{place.rating || "N/A"}</span>
                      <span className="text-gray-500 ml-1">({place.reviewsCount || 0})</span>
                    </div>
                    <button className="text-sm font-medium text-indigo-600 hover:underline details-button">
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
        
        <div className="mt-8 text-center md:hidden">
          <button className="px-6 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transform hover:scale-105 active:scale-95 transition-transform duration-150">
            View All Places
          </button>
        </div>
      </div>

      {/* Style preserved from original */}
      <style jsx global>{`
        .place-card {
          transform-style: preserve-3d;
          perspective: 1000px;
          will-change: transform;
          transform: translateZ(0);
        }
        .card-translate {
          transition: transform 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67), box-shadow 0.15s ease;
        }
        .place-card:hover .card-translate {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .card-image {
          transition: transform 0.4s ease-out;
        }
        .place-card:hover .card-image {
          transform: scale(1.05);
        }
        .heart-button {
          transition: transform 0.15s ease-out;
        }
        .heart-button:hover {
          transform: scale(1.1);
        }
        .heart-button:active {
          transform: scale(0.9);
        }
        .details-button {
          transition: transform 0.15s ease-out;
        }
        .details-button:hover {
          transform: scale(1.05);
        }
        .details-button:active {
          transform: scale(0.95);
        }
      `}</style>
    </section>
  );
}