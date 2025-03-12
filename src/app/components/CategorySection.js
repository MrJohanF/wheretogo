// app/components/CategorySection.js

"use client";
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useCategoryStore from '../store/categoryStore';

export default function CategorySection() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Get categories from the store
  const { categories, isLoading, error, fetchCategories } = useCategoryStore();
  
  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryClick = (categoryId) => {
    router.push(`/categories/${categoryId}`);
  };

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
          <h2 className="text-3xl font-bold text-gray-900">Explorar por Categoría</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra exactamente lo que buscas con nuestras categorías seleccionadas
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Error al cargar categorías: {error}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6"
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            {categories.slice(0, 8).map((category) => (
              <motion.div 
                key={category.id}
                className="flex flex-col items-center p-4 rounded-xl bg-gray-50 
                           cursor-pointer transition-shadow duration-200 
                           hover:bg-indigo-50 hover:shadow-md will-change-transform"
                variants={item}
                style={{ transform: "translateZ(0)" }}
                whileHover={{ scale: 1.05 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 17,
                  mass: 0.5
                }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-3"
                     style={{ 
                       backgroundColor: `${category.color}40`, 
                       color: category.color 
                     }}>
                  {category.icon}
                </div>
                <span className="text-gray-800 font-medium text-sm text-center">{category.name}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}