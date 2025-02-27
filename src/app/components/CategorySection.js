"use client";
import { 
  Utensils, Camera, Coffee, ShoppingBag, 
  Mountain, Landmark, Palmtree, Ticket 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CategorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const categories = [
    { icon: <Utensils />, name: "Restaurants" },
    { icon: <Coffee />, name: "Cafés" },
    { icon: <ShoppingBag />, name: "Local Shops" },
    { icon: <Camera />, name: "Photo Spots" },
    { icon: <Mountain />, name: "Nature" },
    { icon: <Landmark />, name: "Landmarks" },
    { icon: <Palmtree />, name: "Hidden Gems" },
    { icon: <Ticket />, name: "Activities" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-16 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you're looking for with our curated categories
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {categories.map((category, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-50 
                         cursor-pointer transition-colors transition-shadow duration-200 
                         hover:bg-indigo-50 hover:shadow-md will-change-transform"
              variants={item}
              style={{ transform: "translateZ(0)" }} // Enable hardware acceleration
              whileHover={{ scale: 1.05 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 17,
                mass: 0.5  // Lower mass for smoother animation
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-3">
                {category.icon}
              </div>
              <span className="text-gray-800 font-medium text-sm">{category.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}