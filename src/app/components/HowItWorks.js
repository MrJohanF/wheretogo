"use client";
import { MapPin, Search, ThumbsUp, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const steps = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Elige tu Destino",
      description: "Selecciona la ciudad o área que quieres explorar y obtén recomendaciones personalizadas."
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Descubre Lugares",
      description: "Explora listas curadas de restaurantes, atracciones, puntos fotográficos y lugares ocultos."
    },
    {
      icon: <ThumbsUp className="h-8 w-8" />,
      title: "Obtén Sugerencias Personalizadas",
      description: "Cuéntanos lo que te gusta y te sugeriremos lugares que coincidan con tus preferencias e intereses."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Planifica tu Visita",
      description: "Guarda tus favoritos, crea itinerarios y accede a ellos sin conexión durante tu aventura."
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden" ref={ref}>
      {/* Background circles for visual interest */}
      <motion.div 
        className="absolute rounded-full w-72 h-72 bg-indigo-50 top-20 -left-20"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      />
      <motion.div 
        className="absolute rounded-full w-96 h-96 bg-purple-50 bottom-10 -right-40"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Cómo Funciona</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre cómo Localist te ayuda a encontrar lugares increíbles en unos simples pasos
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center text-center relative z-10"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.7, delay: 0.2 * index }}
            >
              <motion.div 
                className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-5"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 + index * 0.2 }}
                  style={{ transformOrigin: 'left' }}
                >
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M39.5303 6.53033C39.8232 6.23744 39.8232 5.76256 39.5303 5.46967L34.7574 0.696699C34.4645 0.403806 33.9896 0.403806 33.6967 0.696699C33.4038 0.989593 33.4038 1.46447 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM0 6.75H39V5.25H0V6.75Z" fill="#6366F1"/>
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          <motion.button 
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Empezar Ahora
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}