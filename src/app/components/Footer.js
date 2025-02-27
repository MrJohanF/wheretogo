import Link from 'next/link';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-indigo-400" />
              <span className="font-bold text-xl text-white">Localist</span>
            </div>
            <p className="mb-4 text-sm">
              Discover the best local experiences with personalized recommendations for places to visit, eat, shop, and explore.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-white mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/press" className="hover:text-white">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-white mb-4">Support</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/safety" className="hover:text-white">Safety Center</Link></li>
              <li><Link href="/community" className="hover:text-white">Community Guidelines</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-white mb-4">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            &copy; {currentYear} Localist. All rights reserved.
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <a href="mailto:hello@localist.com" className="hover:text-white">hello@localist.com</a>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <a href="tel:+15551234567" className="hover:text-white">(555) 123-4567</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}