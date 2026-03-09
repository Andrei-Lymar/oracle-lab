// ============================================================================
// Zodiac Signs Grid Section
// ============================================================================

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ZodiacSign } from '@/types/horoscope';
import { zodiacSigns, getElementColor } from '@/types/horoscope';

gsap.registerPlugin(ScrollTrigger);

interface ZodiacGridProps {
  onSelectSign: (sign: ZodiacSign) => void;
  hasCurrentWeek: boolean;
}

export function ZodiacGrid({ onSelectSign, hasCurrentWeek }: ZodiacGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const grid = gridRef.current;

    if (!section || !title || !grid) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        title.querySelectorAll('.title-char'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Grid cards animation
      const cards = grid.querySelectorAll('.zodiac-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: {
            each: 0.08,
            from: 'random',
          },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const titleText = 'ЗНАКИ ЗОДИАКА';

  return (
    <section
      ref={sectionRef}
      id="zodiac"
      className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8 xl:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            {titleText.split('').map((char, i) => (
              <span
                key={i}
                className="title-char inline-block"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto">
            Выберите свой знак, чтобы узнать научный гороскоп на эту неделю
          </p>
          {!hasCurrentWeek && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400">
              <span className="text-sm">Гороскоп на этой неделе появится совсем скоро</span>
            </div>
          )}
        </div>

        {/* Zodiac Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {zodiacSigns.map((sign) => (
            <ZodiacCard
              key={sign.id}
              sign={sign}
              isHovered={hoveredSign === sign.id}
              onHover={() => setHoveredSign(sign.id)}
              onLeave={() => setHoveredSign(null)}
              onClick={() => onSelectSign(sign)}
              disabled={!hasCurrentWeek}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Zodiac Card Component
// ============================================================================

interface ZodiacCardProps {
  sign: ZodiacSign;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  disabled: boolean;
}

function ZodiacCard({ sign, isHovered, onHover, onLeave, onClick, disabled }: ZodiacCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const elementColor = getElementColor(sign.element);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current || disabled) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(cardRef.current, {
      rotateX: -rotateX,
      rotateY: -rotateY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    onLeave();
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={`
        zodiac-card relative group
        aspect-square rounded-2xl
        flex flex-col items-center justify-center
        border transition-all duration-300
        perspective-1000
        ${disabled 
          ? 'border-white/10 bg-white/5 cursor-not-allowed opacity-60' 
          : 'border-white/20 bg-white/5 cursor-pointer hover:border-white/40 hover:bg-white/10'
        }
      `}
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: isHovered && !disabled ? `0 0 30px ${elementColor}30` : 'none',
      }}
    >
      {/* Element glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${elementColor}20 0%, transparent 70%)`,
        }}
      />

      {/* Symbol */}
      <span
        className="text-5xl sm:text-6xl mb-3 transition-transform duration-300 group-hover:scale-110"
        style={{ color: elementColor }}
      >
        {sign.symbol}
      </span>

      {/* Name */}
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
        {sign.name}
      </h3>

      {/* Date range */}
      <p className="text-xs sm:text-sm text-white/50 text-center px-2">
        {sign.dateRange}
      </p>

      {/* Element indicator */}
      <div
        className="absolute top-3 right-3 w-2 h-2 rounded-full"
        style={{ backgroundColor: elementColor }}
      />

      {/* Hover border glow */}
      {!disabled && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px ${elementColor}30`,
          }}
        />
      )}
    </button>
  );
}
