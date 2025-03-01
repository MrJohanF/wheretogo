"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  MapPin, 
  Search, 
  Star, 
  Compass, 
  Users, 
  Coffee, 
  MessageSquare, 
  Calendar, 
  ChevronDown, 
  ChevronRight, 
  Heart, 
  Globe,
  Mail,
  Github,
  Linkedin,
  Twitter
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const [activeFaq, setActiveFaq] = useState(null);
  
  const missionRef = useRef(null);
  const featuresRef = useRef(null);
  const teamRef = useRef(null);
  const faqRef = useRef(null);
  
  const isMissionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const isTeamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-100px" });

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Search className="text-indigo-600" size={24} />,
      title: "Búsqueda Inteligente",
      description: "Encuentra exactamente lo que buscas con nuestros filtros avanzados y búsqueda por categorías."
    },
    {
      icon: <Star className="text-yellow-500" size={24} />,
      title: "Reseñas Verificadas",
      description: "Opiniones reales de usuarios que han visitado los lugares para que puedas tomar mejores decisiones."
    },
    {
      icon: <Compass className="text-green-500" size={24} />,
      title: "Descubrimiento Local",
      description: "Descubre joyas ocultas y lugares populares en tu ciudad o durante tus viajes."
    },
    {
      icon: <Calendar className="text-red-500" size={24} />,
      title: "Reservas Fáciles",
      description: "Reserva mesas en restaurantes y entradas para eventos directamente desde la aplicación."
    },
    {
      icon: <Heart className="text-pink-500" size={24} />,
      title: "Favoritos Personalizados",
      description: "Guarda tus lugares favoritos y crea colecciones para diferentes ocasiones."
    },
    {
      icon: <Coffee className="text-amber-600" size={24} />,
      title: "Categorías Diversas",
      description: "Desde restaurantes y cafeterías hasta museos y actividades al aire libre."
    }
  ];

  const team = [
    {
      name: "David Murcia",
      role: "Fundador & CEO",
      bio: "Apasionada por descubrir nuevos lugares y experiencias. Creó WhereToGo para ayudar a otros a explorar lo mejor de cada ciudad.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "davidmurcia@gmail.com",
      linkedin: "https://www.linkedin.com/in/davidmurcia/",
      github: "https://github.com/MURRCIA"
    },
    {
      name: "Johan Fernandez",
      role: "Fundador & CEO",
      bio: "Ingeniero de software con experiencia en startups. Lidera el desarrollo técnico para crear una plataforma intuitiva y potente.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      email: "hjfernandez@ucompensar.edu.co",
      linkedin: "https://www.linkedin.com/in/mrjohanf/",
      github: "https://github.com/MrJohanF"
    }
  ];

  const faqs = [
    {
      question: "¿Cómo funciona WhereToGo?",
      answer: "WhereToGo te permite descubrir lugares interesantes cerca de ti o en la ciudad que planeas visitar. Puedes buscar por categorías, ver reseñas de otros usuarios, guardar tus favoritos y hacer reservas directamente desde la aplicación."
    },
    {
      question: "¿Es gratuita la aplicación?",
      answer: "Sí, WhereToGo es completamente gratuita para los usuarios. Ofrecemos funcionalidades premium opcionales para quienes deseen una experiencia mejorada, pero todas las funciones básicas son accesibles sin costo."
    },
    {
      question: "¿Cómo puedo añadir mi negocio a WhereToGo?",
      answer: "Si eres propietario de un negocio, puedes registrarlo en nuestra plataforma a través de la sección 'Para Negocios' en nuestro sitio web. Después de verificar la información, tu negocio aparecerá en nuestros listados."
    },
    {
      question: "¿Están verificadas las reseñas?",
      answer: "Nos esforzamos por mantener la autenticidad de las reseñas. Solo los usuarios que han visitado un lugar pueden dejar reseñas, y tenemos sistemas para detectar y eliminar contenido fraudulento o inapropiado."
    },
    {
      question: "¿En qué ciudades está disponible WhereToGo?",
      answer: "Actualmente estamos disponibles en las principales ciudades de España, con planes de expansión a otras ciudades europeas en los próximos meses. ¡Estamos creciendo rápidamente!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-sm mb-6">
              Sobre WhereToGo
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed">
              Estamos transformando la forma en que descubres y disfrutas de los mejores lugares en tu ciudad y durante tus viajes.
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/" className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-md">
                Explorar lugares
              </Link>
              <Link href="#contacto" className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-800 transition-colors shadow-md">
                Contactar
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 160">
            <path
              fill="#f8fafc"
              fillOpacity="1"
              d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,128C840,128,960,96,1080,80C1200,64,1320,64,1380,64L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 bg-white" ref={missionRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isMissionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                En WhereToGo, creemos que cada ciudad tiene tesoros por descubrir y experiencias únicas que vivir. Nuestra misión es conectar a las personas con los mejores lugares, desde restaurantes de alta cocina hasta cafeterías acogedoras, desde monumentos históricos hasta rincones secretos.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Queremos ser tu compañero de confianza para explorar lo mejor de cada destino, ya sea en tu propia ciudad o durante tus viajes. Con reseñas auténticas, recomendaciones personalizadas y una comunidad apasionada, te ayudamos a encontrar exactamente lo que buscas.
              </p>
              <div className="flex items-center space-x-4 text-indigo-600">
                <MapPin size={24} />
                <span className="text-xl font-medium">Descubre. Explora. Disfruta.</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isMissionInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                alt="Personas disfrutando en un restaurante"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center text-white mb-2">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="ml-2 font-medium">Experiencias inolvidables</span>
                </div>
                <p className="text-white/90 text-sm">
                  Más de 10,000 lugares esperando ser descubiertos
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-indigo-50" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900">Características Principales</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Diseñamos WhereToGo con funcionalidades que hacen que descubrir y disfrutar de nuevos lugares sea más fácil que nunca
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <Link href="/categories" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
              Explorar todas las categorías
              <ChevronRight size={18} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white" ref={teamRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900">Nuestro Equipo</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Un grupo apasionado de profesionales dedicados a crear la mejor plataforma para descubrir lugares increíbles
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                  
                  <div className="mt-4 flex space-x-3">
                    <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                      <Linkedin size={18} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                    </a>
                    <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-indigo-600 transition-colors">
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-indigo-50" ref={faqRef} id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900">Preguntas Frecuentes</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Respuestas a las dudas más comunes sobre WhereToGo
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {activeFaq === index ? (
                    <ChevronDown size={20} className="text-indigo-600" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-400" />
                  )}
                </button>
                
                {activeFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600">
              ¿No encuentras la respuesta que buscas?
            </p>
            <a href="#contacto" className="mt-2 inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
              Contáctanos directamente
              <ChevronRight size={16} className="ml-1" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white" id="contacto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contacta con Nosotros</h2>
              <p className="text-lg text-gray-600 mb-8">
                Estamos aquí para ayudarte. Si tienes preguntas, sugerencias o quieres colaborar con nosotros, no dudes en ponerte en contacto.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MapPin size={20} className="text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Ubicación</h4>
                    <p className="text-gray-600">Calle Gran Vía 28, 28013 Madrid, España</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Mail size={20} className="text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">info@wheretogo.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Globe size={20} className="text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Redes Sociales</h4>
                    <div className="flex space-x-4 mt-2">
                      <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Twitter size={20} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Linkedin size={20} />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Github size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Envíanos un mensaje</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Asunto de tu mensaje"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-indigo-200">Lugares</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-indigo-200">Usuarios</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-indigo-200">Reseñas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-indigo-200">Ciudades</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Empieza a descubrir lugares increíbles hoy mismo
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Únete a nuestra comunidad de exploradores y encuentra los mejores restaurantes, cafeterías, museos y mucho más en tu ciudad o durante tus viajes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md">
              Explorar ahora
            </Link>
            <Link href="/categories" className="px-8 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Ver categorías
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
