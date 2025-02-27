"use client";
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, NY",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
      text: "Localist completely changed how I explore new cities! I discovered the most amazing local bakery in Paris that wasn't on any of the usual tourist sites.",
      rating: 5
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "The photo spot recommendations were perfect! I got incredible shots for my Instagram that made all my friends ask where I found these hidden gems.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      location: "Chicago, IL",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      text: "As a foodie, I appreciate that Localist helped me find authentic local restaurants that I wouldn't have discovered otherwise. The personalized recommendations were spot on!",
      rating: 4
    }
  ];

  // Simpler animation variants
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
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered extraordinary places with Localist
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md transition-all"
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: index * 0.2 }} // Stagger the animations
              whileHover={{ 
                y: -8,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <div className="flex items-center mb-4">
                <motion.img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-indigo-100" 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
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
                    className={`h-4 w-4 \${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
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
        
        {/* Add subtle floating animations to background elements */}
        <motion.div 
          className="hidden md:block absolute -top-10 left-10 w-20 h-20 rounded-full bg-indigo-100 opacity-50 z-0"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="hidden md:block absolute bottom-20 right-10 w-32 h-32 rounded-full bg-purple-100 opacity-50 z-0"
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.5, 0.7, 0.5] 
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        />
      </div>
    </section>
  );
}