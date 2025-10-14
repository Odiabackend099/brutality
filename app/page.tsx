import Hero from './components/Hero';
import DemoSection from './components/DemoSection';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const FLW_STARTER = 'https://flutterwave.com/pay/tcasx4xsfmdj';

export default function Page() {
  return (
    <>
      <Hero />
      <DemoSection />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />

      {/* Sticky mobile CTA */}
      <div className="sticky-cta">
        <a href={FLW_STARTER} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
          Start Free Trial
        </a>
      </div>
    </>
  );
}
