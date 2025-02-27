import { MapPin, Search, ThumbsUp, Smartphone } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Choose Your Destination",
      description: "Select the city or area you want to explore and get ready for personalized recommendations."
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Discover Places",
      description: "Browse through curated lists of restaurants, attractions, photo spots, and hidden gems."
    },
    {
      icon: <ThumbsUp className="h-8 w-8" />,
      title: "Get Personalized Suggestions",
      description: "Tell us what you like, and we'll suggest places that match your preferences and interests."
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Plan Your Visit",
      description: "Save favorites, create itineraries, and access them offline during your adventure."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how Localist helps you find amazing places in just a few simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-5">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M39.5303 6.53033C39.8232 6.23744 39.8232 5.76256 39.5303 5.46967L34.7574 0.696699C34.4645 0.403806 33.9896 0.403806 33.6967 0.696699C33.4038 0.989593 33.4038 1.46447 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM0 6.75H39V5.25H0V6.75Z" fill="#6366F1"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}