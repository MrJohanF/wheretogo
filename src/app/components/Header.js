"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
<>
  
      <div className="h-[72px]" /> 


      <motion.header 
        className="bg-white fixed top-0 left-0 right-0 z-50 shadow-sm"
        initial={{ y: 0, opacity: 0 }}  // Start at position 0 with opacity 0
        animate={{ y: 0, opacity: 1 }}  // Animate to position 0 with opacity 1
        transition={{ duration: 0.5 }}  // Smooth fade in instead of movement
      >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <MapPin className="h-6 w-6 text-indigo-600" />
          </motion.div>
          <span className="font-bold text-xl text-gray-800">Localist</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {['Explore', 'Categories', 'About Us'].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <Link href={`/\${item.toLowerCase().replace(' ', '-')}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
                {item}
              </Link>
            </motion.div>
          ))}
        </nav>
        
        <motion.div 
            className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search places..." 
              className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <motion.button 
            className="p-2 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="h-5 w-5 text-gray-600" />
          </motion.button>
        </motion.div>
        
        {/* Mobile menu button */}
        <motion.button 
          className="md:hidden p-2 rounded-md focus:outline-none"
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <Search className="text-gray-400 h-5 w-5 ml-3 absolute" />
            <input 
              type="text" 
              placeholder="Search places..." 
              className="pl-10 pr-4 py-2 border rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-3">
            {['Explore', 'Categories', 'About Us', 'Profile'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/\${item.toLowerCase().replace(' ', '-')}`} 
                  className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md">
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
    </>
  );
}