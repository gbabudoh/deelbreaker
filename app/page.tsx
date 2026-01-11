import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import StatsSection from './components/StatsSection';
import FeatureShowcase from './components/FeatureShowcase';

export default function Home() {
  return (
    <main className="pb-20 lg:pb-0">
      <Header />
      <div className="pt-14 lg:pt-16">
        <HeroBanner />
        <StatsSection />
        <FeatureShowcase />
      </div>
    </main>
  );
}
