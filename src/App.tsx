// ============================================================================
// Main App Component - только для чтения гороскопов
// ============================================================================

import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from './components/Navigation';
import { ParticleField } from './components/ParticleField';
import { Hero } from './sections/Hero';
import { ZodiacGrid } from './sections/ZodiacGrid';
import { HoroscopeModal } from './sections/HoroscopeModal';
import { ArchiveSection } from './sections/Archive';
import { Footer } from './sections/Footer';
import { usePublicHoroscope } from './hooks/usePublicHoroscope';
import type { ZodiacSign, WeeklyHoroscope } from './types/horoscope';
import { siteConfig } from './config';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const {
    currentWeek,
    archive,
    isLoading,
    hasData,
  } = usePublicHoroscope();

  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingWeek, setViewingWeek] = useState<WeeklyHoroscope | null>(null);

  useEffect(() => {
    document.title = siteConfig.title || 'Лаборатория Оракулов';
    document.documentElement.lang = siteConfig.language || 'ru';

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleSelectSign = (sign: ZodiacSign) => {
    setSelectedSign(sign);
    setViewingWeek(null);
    setIsModalOpen(true);
  };

  const handleViewWeek = (week: WeeklyHoroscope) => {
    setViewingWeek(week);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedSign(null);
      setViewingWeek(null);
    }, 300);
  };

  const getEntryForSign = (sign: ZodiacSign | null) => {
    if (!sign) return null;
    const week = viewingWeek || currentWeek;
    if (!week) return null;
    return week.entries.find((e) => e.signId === sign.id) || null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Particle field */}
      <ParticleField />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main>
        <Hero
          hasCurrentWeek={hasData}
          currentWeekLabel={currentWeek?.weekLabel || null}
        />
        <ZodiacGrid
          onSelectSign={handleSelectSign}
          hasCurrentWeek={hasData}
        />
        <ArchiveSection
          archive={archive}
          onViewWeek={handleViewWeek}
        />
        <Footer />
      </main>

      {/* Horoscope Modal */}
      <HoroscopeModal
        sign={selectedSign}
        entry={getEntryForSign(selectedSign)}
        weekLabel={viewingWeek?.weekLabel || currentWeek?.weekLabel || ''}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
