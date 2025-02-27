import Image from 'next/image';
import { ArrowDown, CheckCircle } from 'lucide-react';

export default function CtaSection() {
  const features = [
    "Personalized recommendations based on your interests",
    "Discover hidden local gems not found on typical tourist sites",
    "Create sharable travel itineraries with friends",
    "Access all recommendations offline while traveling"
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Download the App and Start Exploring Today
            </h2>
            <p className="text-lg md:text-xl mb-8 text-indigo-100">
              Get access to thousands of curated recommendations right in your pocket.
            </p>
            
            <ul className="space-y-3 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-3 text-indigo-200" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-xl flex items-center justify-center">
                <span className="mr-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M17.5432 12.0074C17.5314 9.32352 19.7551 8.01463 19.8426 7.96281C18.6217 6.1234 16.7012 5.86931 15.998 5.84335C14.4239 5.67889 12.9035 6.79478 12.103 6.79478C11.2853 6.79478 10.0466 5.86162 8.72328 5.89142C6.97231 5.92036 5.34923 6.94802 4.4382 8.47623C2.56775 11.58 3.94618 16.1417 5.73602 18.7797C6.63243 20.0762 7.68473 21.5261 9.0679 21.4683C10.4166 21.4057 10.9361 20.6069 12.5559 20.6069C14.1593 20.6069 14.6443 21.4683 16.0638 21.4301C17.5253 21.4057 18.4354 20.1231 19.2991 18.8146C20.3307 17.3059 20.7592 15.8271 20.7725 15.746C20.742 15.7347 17.5566 14.4423 17.5432 12.0074Z"/>
                    <path d="M15.1934 4.1293C15.9258 3.24569 16.4268 2.02518 16.2914 0.789062C15.2558 0.827756 13.9793 1.47851 13.2178 2.33614C12.5425 3.09879 11.9341 4.37495 12.0879 5.55345C13.2475 5.63125 14.4318 5.00139 15.1934 4.1293Z"/>
                  </svg>
                </span>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              
              <button className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-xl flex items-center justify-center">
                <span className="mr-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M17.5221 9.18466L13.9413 6.31826L17.5221 2.73737L17.5221 9.18466Z"/>
                    <path d="M3.0791 2.82379C3.0791 2.24998 3.41468 1.7709 3.97316 1.52061L11.3002 5.97127L3.97316 10.422C3.41468 10.1717 3.0791 9.69263 3.0791 9.11882L3.0791 2.82379Z"/>
                    <path d="M3.0791 14.8446C3.0791 14.2708 3.41468 13.7917 3.97316 13.5414L11.3002 17.9921L3.97316 22.4428C3.41468 22.1925 3.0791 21.7134 3.0791 21.1396L3.0791 14.8446Z"/>
                    <path d="M17.5221 21.2257V14.7784L13.9413 11.912L17.5221 8.33112V21.2257Z"/>
                    <path d="M11.3002 11.912L17.5221 9.18466L17.5221 8.33112L11.3002 5.97127V11.912Z"/>
                    <path d="M11.3002 17.9921V11.912L17.5221 14.7784V21.2257L11.3002 17.9921Z"/>
                  </svg>
                </span>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-10">
            <div className="relative">
              <img 
                src="/app-mockup.png" 
                alt="App mockup" 
                className="max-w-full rounded-3xl shadow-2xl"
                onError={(e) => {
                  // Fallback if image is not available
                  e.target.src = "https://placehold.co/300x600/4f46e5/ffffff?text=Localist+App";
                }}
              />
              <div className="absolute -bottom-6 -right-6 bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                <div className="text-sm font-semibold">Starting exploring now!</div>
                <ArrowDown className="mt-2 h-5 w-5 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}