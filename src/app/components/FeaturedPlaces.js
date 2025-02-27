import { MapPin, Star, Heart } from 'lucide-react';

export default function FeaturedPlaces() {
  const places = [
    {
      id: 1,
      name: "Seaside Café & Bistro",
      type: "Café",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Venice Beach, CA",
      rating: 4.8,
      reviews: 354
    },
    {
      id: 2,
      name: "Vintage Market Square",
      type: "Shopping",
      image: "https://images.unsplash.com/photo-1516559828984-fb3b99548b21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Portland, OR",
      rating: 4.7,
      reviews: 283
    },
    {
      id: 3,
      name: "Skyline Observation Deck",
      type: "Photo Spot",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Seattle, WA",
      rating: 4.9,
      reviews: 467
    },
    {
      id: 4,
      name: "Hidden Forest Trail",
      type: "Nature",
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      location: "Asheville, NC",
      rating: 4.8,
      reviews: 215
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Places</h2>
            <p className="mt-2 text-lg text-gray-600">
              Discover trending spots loved by locals and travelers alike
            </p>
          </div>
          <button className="hidden md:block px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map(place => (
            <div key={place.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              <div className="relative">
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-full h-48 object-cover"
                />
                <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md">
                  <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                </button>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm py-1 px-3 rounded-full text-xs font-medium text-indigo-700">
                  {place.type}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{place.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{place.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium text-gray-900">{place.rating}</span>
                    <span className="text-gray-500 ml-1">({place.reviews})</span>
                  </div>
                  <button className="text-sm font-medium text-indigo-600 hover:underline">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <button className="px-6 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition">
            View All Places
          </button>
        </div>
      </div>
    </section>
  );
}
