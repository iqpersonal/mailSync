import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Features />
      <Pricing />
    </main>
  );
}
