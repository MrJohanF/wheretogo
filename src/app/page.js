import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import FeaturedPlaces from './components/FeaturedPlaces';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <CategorySection />
      <FeaturedPlaces />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}