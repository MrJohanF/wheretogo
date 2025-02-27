import { 
    Utensils, Camera, Coffee, ShoppingBag, 
    Mountain, Landmark, Palmtree, Ticket 
  } from 'lucide-react';
  
  export default function CategorySection() {
    const categories = [
      { icon: <Utensils />, name: "Restaurants" },
      { icon: <Coffee />, name: "Cafés" },
      { icon: <ShoppingBag />, name: "Local Shops" },
      { icon: <Camera />, name: "Photo Spots" },
      { icon: <Mountain />, name: "Nature" },
      { icon: <Landmark />, name: "Landmarks" },
      { icon: <Palmtree />, name: "Hidden Gems" },
      { icon: <Ticket />, name: "Activities" },
    ];
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for with our curated categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full mb-3">
                  {category.icon}
                </div>
                <span className="text-gray-800 font-medium text-sm">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }