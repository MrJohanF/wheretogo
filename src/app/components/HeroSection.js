"use client";
import Link from 'next/link';
import { MapPin, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20 md:py-28 overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(3px)',
          mixBlendMode: 'overlay'
        }}
      />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Descubre las Mejores Experiencias Locales
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-8 text-indigo-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Recomendaciones personalizadas de lugares para visitar, comer, comprar y más, todo seleccionado por locales que conocen mejor.
            </motion.p>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-8 flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <MapPin className="h-5 w-5 text-indigo-200 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="¿A dónde vas?" 
                className="bg-transparent border-none outline-none text-white placeholder-indigo-200 w-full"
              />
              <motion.button 
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Compass className="h-4 w-4 mr-2" />
                Explorar
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {['100K+ Usuarios', '50K+ Lugares', '120+ Ciudades'].map((stat, index) => (
                <motion.span 
                  key={stat}
                  className="mr-4 flex items-center last:mr-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.2 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="bg-white h-2 w-2 rounded-full mr-2"></span>
                  {stat}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 md:pl-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div 
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform rotate-2"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.03, rotate: 3, transition: { duration: 0.3 } }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Mirador de la ciudad" 
                  className="w-full h-72 object-cover"
                />
              </motion.div>
              <motion.div 
                className="absolute -bottom-10 -left-10 bg-white rounded-2xl shadow-xl overflow-hidden transform -rotate-3 w-56 h-56"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                whileHover={{ scale: 1.05, rotate: -5, transition: { duration: 0.3 } }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Canales de Venecia" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}