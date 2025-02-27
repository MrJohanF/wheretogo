import Link from 'next/link';
import { MapPin, Compass } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Discover the Best Local Experiences
            </h1>
            <p className="text-lg md:text-xl mb-8 text-indigo-100">
              Personalized recommendations for places to visit, eat, shop, and more—all curated by locals who know best.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-8 flex items-center">
              <MapPin className="h-5 w-5 text-indigo-200 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Where are you going?" 
                className="bg-transparent border-none outline-none text-white placeholder-indigo-200 w-full"
              />
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium flex items-center">
                <Compass className="h-4 w-4 mr-2" />
                Explore
              </button>
            </div>
            
            <div className="flex items-center text-sm">
              <span className="mr-4 flex items-center">
                <span className="bg-white h-2 w-2 rounded-full mr-2"></span>
                100K+ Users
              </span>
              <span className="mr-4 flex items-center">
                <span className="bg-white h-2 w-2 rounded-full mr-2"></span>
                50K+ Places
              </span>
              <span className="flex items-center">
                <span className="bg-white h-2 w-2 rounded-full mr-2"></span>
                120+ Cities
              </span>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-10">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="City viewpoint" 
                  className="w-full h-72 object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white rounded-2xl shadow-xl overflow-hidden transform -rotate-3 w-56 h-56">
                <img 
                  src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Venice canals" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}