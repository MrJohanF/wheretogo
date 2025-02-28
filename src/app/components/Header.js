"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, MapPin } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-xl text-gray-800">Localist</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/explore" className="text-gray-600 hover:text-indigo-600">Explore</Link>
          <Link href="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
          <Link href="/about" className="text-gray-600 hover:text-indigo-600">About Us</Link>
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search places..." 
              className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <User className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md">
          <div className="flex items-center mb-4">
            <Search className="text-gray-400 h-5 w-5 ml-3 absolute" />
            <input 
              type="text" 
              placeholder="Search places..." 
              className="pl-10 pr-4 py-2 border rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-3">
            <Link href="/explore" className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md">Explore</Link>
            <Link href="/categories" className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md">Categories</Link>
            <Link href="/about" className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md">About Us</Link>
            <Link href="/profile" className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md">Profile</Link>
          </div>
        </div>
      )}
    </header>
  );
}