// ============================================================================
// Archive Section
// ============================================================================

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { WeeklyHoroscope } from '@/types/horoscope';
import { getZodiacSignById } from '@/types/horoscope';
import { Archive, ChevronDown, Calendar, Eye } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ArchiveProps {
  archive: WeeklyHoroscope[];
  onViewWeek: (week: WeeklyHoroscope) => void;
}

export function ArchiveSection({ archive, onViewWeek }: ArchiveProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const list = listRef.current;

    if (!section || !title || !list) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        title.querySelectorAll('.title-word'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // List items animation
      const items = list.querySelectorAll('.archive-item');
      gsap.fromTo(
        items,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: list,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [archive]);

  const toggleWeek = (weekId: string) => {
    setExpandedWeek(expandedWeek === weekId ? null : weekId);
  };

  if (archive.length === 0) {
    return (
      <section
        ref={sectionRef}
        id="archive"
        className="relative py-24 px-4 sm:px-6 lg:px-8 xl:px-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div ref={titleRef} className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
              <Archive className="w-8 h-8 text-white/60" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="title-word inline-block">Архив</span>{' '}
              <span className="title-word inline-block text-white/60">гороскопов</span>
            </h2>
            <p className="title-word text-lg text-white/50">
              Здесь будут храниться гороскопы прошлых недель
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="archive"
      className="relative py-24 px-4 sm:px-6 lg:px-8 xl:px-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <Archive className="w-8 h-8 text-white/60" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="title-word inline-block">Архив</span>{' '}
            <span className="title-word inline-block text-white/60">гороскопов</span>
          </h2>
          <p className="title-word text-lg text-white/50">
            {archive.length} {archive.length === 1 ? 'неделя' : archive.length < 5 ? 'недели' : 'недель'} в архиве
          </p>
        </div>

        {/* Archive List */}
        <div ref={listRef} className="space-y-4">
          {archive.map((week, index) => (
            <div
              key={week.weekId}
              className="archive-item rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
            >
              {/* Week Header */}
              <button
                onClick={() => toggleWeek(week.weekId)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                    <span className="text-sm font-semibold text-white/80">
                      #{archive.length - index}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">
                      {week.weekLabel}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <Calendar className="w-4 h-4" />
                      <span>{week.dateFrom} — {week.dateTo}</span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-white/60 transition-transform duration-300 ${
                    expandedWeek === week.weekId ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expanded Content */}
              {expandedWeek === week.weekId && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {week.entries.map((entry) => {
                      const sign = getZodiacSignById(entry.signId);
                      if (!sign) return null;
                      return (
                        <div
                          key={entry.signId}
                          className="flex items-center gap-2 p-3 rounded-xl bg-white/5"
                        >
                          <span className="text-xl">{sign.symbol}</span>
                          <span className="text-sm text-white/80">{sign.name}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => onViewWeek(week)}
                    className="mt-4 w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Просмотреть гороскопы</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
