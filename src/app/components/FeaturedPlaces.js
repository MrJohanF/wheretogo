"use client";
import { MapPin, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function FeaturedPlaces() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  // Track hover state for heart icons
  const [hoveredHearts, setHoveredHearts] = useState({});
  
  const places = [
    {
      id: 1,
      name: "Seaside Café & Bistro",
      type: "Café",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Venice Beach, CA",
      rating: 4.8,
      reviews: 354
    },
    {
      id: 2,
      name: "Vintage Market Square",
      type: "Shopping",
      image: "https://images.unsplash.com/photo-1516559828984-fb3b99548b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Portland, OR",
      rating: 4.7,
      reviews: 283
    },
    {
      id: 3,
      name: "Skyline Observation Deck",
      type: "Photo Spot",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Seattle, WA",
      rating: 4.9,
      reviews: 467
    },
    {
      id: 4,
      name: "Hidden Forest Trail",
      type: "Nature",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Asheville, NC",
      rating: 4.8,
      reviews: 215
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.5
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-16 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Places</h2>
            <p className="mt-2 text-lg text-gray-600">
              Discover trending spots loved by locals and travelers alike
            </p>
          </div>
          <motion.button 
            className="hidden md:block px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
          </motion.button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {places.map((place) => (
            <motion.div 
              key={place.id} 
              className="bg-white rounded-xl overflow-hidden shadow-md"
              variants={item}
              whileHover={{ 
                y: -10,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative overflow-hidden">
                <motion.img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-full h-48 object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.button 
                  className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md z-10"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredHearts({...hoveredHearts, [place.id]: true})}
                  onMouseLeave={() => setHoveredHearts({...hoveredHearts, [place.id]: false})}
                >
                  <Heart 
                    className={`h-5 w-5 \${hoveredHearts[place.id] ? 'text-red-500' : 'text-gray-600'}`} 
                  />
                </motion.button>
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
                  <span>{place.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium text-gray-900">{place.rating}</span>
                    <span className="text-gray-500 ml-1">({place.reviews})</span>
                  </div>
                  <motion.button 
                    className="text-sm font-medium text-indigo-600 hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-8 text-center md:hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button 
            className="px-6 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Places
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}