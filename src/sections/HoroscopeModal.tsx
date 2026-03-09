// ============================================================================
// Horoscope Modal
// ============================================================================

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ZodiacSign, HoroscopeEntry } from '@/types/horoscope';
import { getElementColor } from '@/types/horoscope';
import { X, FlaskConical, Sparkles, Calendar } from 'lucide-react';

interface HoroscopeModalProps {
  sign: ZodiacSign | null;
  entry: HoroscopeEntry | null;
  weekLabel: string;
  isOpen: boolean;
  onClose: () => void;
}

export function HoroscopeModal({ sign, entry, weekLabel, isOpen, onClose }: HoroscopeModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Animate in
      const tl = gsap.timeline();
      
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      tl.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.2'
      );

      if (contentRef.current) {
        tl.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
          '-=0.3'
        );
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 30,
      duration: 0.3,
      ease: 'power2.in',
    });

    tl.to(
      overlayRef.current,
      { opacity: 0, duration: 0.2 },
      '-=0.1'
    );
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  if (!isOpen || !sign) return null;

  const elementColor = getElementColor(sign.element);
  const hasScienceNews = entry?.horoscopeText?.includes('Наука недели');
  
  // Extract science news and horoscope text
  let scienceNews = '';
  let horoscopeText = entry?.horoscopeText || '';
  
  if (hasScienceNews) {
    const match = horoscopeText.match(/Наука недели[:\s]+(.+?)(?=\n\s*Гороскоп[:\s]|$)/is);
    if (match) {
      scienceNews = match[1].trim();
      horoscopeText = horoscopeText.replace(/Наука недели[:\s]+.+?(?=\n\s*Гороскоп[:\s]|$)/is, '').trim();
      horoscopeText = horoscopeText.replace(/^Гороскоп[:\s]+/, '').trim();
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      style={{ opacity: 0 }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/20 bg-black/95"
        style={{ opacity: 0 }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header with gradient */}
        <div
          className="relative px-8 py-10 text-center"
          style={{
            background: `linear-gradient(135deg, ${elementColor}30 0%, transparent 60%)`,
          }}
        >
          {/* Symbol */}
          <div
            className="text-7xl sm:text-8xl mb-4"
            style={{ color: elementColor }}
          >
            {sign.symbol}
          </div>

          {/* Name */}
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {sign.name}
          </h2>

          {/* Date range */}
          <p className="text-white/60 mb-4">{sign.dateRange}</p>

          {/* Week label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
            <Calendar className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80">{weekLabel}</span>
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="px-8 pb-8 overflow-y-auto max-h-[50vh] custom-scrollbar"
        >
          {entry ? (
            <>
              {/* Science News Section */}
              {scienceNews && (
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <FlaskConical className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-400">
                      Наука недели
                    </h3>
                  </div>
                  <p className="text-white/80 leading-relaxed">{scienceNews}</p>
                </div>
              )}

              {/* Horoscope Section */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" style={{ color: elementColor }} />
                  <h3 className="text-lg font-semibold" style={{ color: elementColor }}>
                    Гороскоп
                  </h3>
                </div>
                <p className="text-white/90 leading-relaxed whitespace-pre-line">
                  {horoscopeText}
                </p>
              </div>

              {/* Scientific note */}
              <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-400/80 italic">
                  Научное примечание: данный гороскоп основан на сомнительной корреляции 
                  между астрономией и нейронными связями автора. Но если совпало — 
                  значит, физики где-то шутят.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60">
                Гороскоп для этого знака пока не загружен.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
