import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
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

  return (
    <section className="py-20 bg-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered extraordinary places with Localist
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover" 
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}