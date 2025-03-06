import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";

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
              Descubre las mejores experiencias locales con recomendaciones
              personalizadas de lugares para visitar, comer, comprar y explorar.
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
            <h5 className="font-semibold text-white mb-4">Empresa</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Empleo
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white">
                  Prensa
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4">Soporte</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-white">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-white">
                  Centro de Seguridad
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white">
                  Normas de la Comunidad
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            &copy; {currentYear} Localist. Todos los derechos reservados.
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <a href="mailto:hello@localist.com" className="hover:text-white">
                soporte@localist.com
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <a href="tel:+15551234567" className="hover:text-white">
                (+57) 317 800 0000
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
