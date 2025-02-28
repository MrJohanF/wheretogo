"use client";
import { Star, Quote } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const testimonials = [
    // Your testimonial data remains unchanged
    {
      name: "Sarah Johnson",
      location: "Nueva York, NY",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      text: "¡Localist cambió completamente la forma en que exploro nuevas ciudades! Descubrí una increíble panadería local en París que no estaba en ninguno de los sitios turísticos habituales.",
      rating: 5
    },
    {
      name: "Michael Chen", 
      location: "San Francisco, CA",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "¡Las recomendaciones de lugares para fotos fueron perfectas! Conseguí tomas increíbles para mi Instagram que hicieron que todos mis amigos preguntaran dónde encontré estas joyas escondidas.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      location: "Chicago, IL", 
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      text: "Como amante de la comida, aprecio que Localist me ayudara a encontrar restaurantes locales auténticos que no hubiera descubierto de otra manera. ¡Las recomendaciones personalizadas fueron excelentes!",
      rating: 4
    }
  ];

  // Optimized animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-indigo-50 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Lo Que Dicen Nuestros Usuarios</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Únete a miles de viajeros que han descubierto lugares extraordinarios con Localist
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transform-gpu"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ y: -8 }}
              // Fix: Proper hover transition configuration
              transition ={{
                type: "spring",
                stiffness: 400,
                damping: 17,
                // Make hover animations independent from initial animations
                hover: { type: "tween", duration: 0.2, ease: "easeOut" }
              }}
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden",
                perspective: 1000,
                transformStyle: "preserve-3d"
              }}
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-indigo-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-2 -left-1 h-6 w-6 text-indigo-200 transform rotate-180" />
                <p className="text-gray-700 pl-5">{testimonial.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="hidden md:block absolute -top-10 left-10 w-20 h-20 rounded-full bg-indigo-100 opacity-50 z-0 animate-float-slow" />
        <div className="hidden md:block absolute bottom-20 right-10 w-32 h-32 rounded-full bg-purple-100 opacity-50 z-0 animate-float-medium" />
      </div>
    </section>
  );
}