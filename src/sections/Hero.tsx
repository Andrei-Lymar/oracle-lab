// ============================================================================
// Hero Section
// ============================================================================

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FlaskConical, Sparkles, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  hasCurrentWeek: boolean;
  currentWeekLabel: string | null;
}

export function Hero({ hasCurrentWeek, currentWeekLabel }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    const badge = badgeRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!section || !title || !subtitle || !badge || !scrollIndicator) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Badge animation
      tl.fromTo(
        badge,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      // Title character animation
      const chars = title.querySelectorAll('.title-char');
      tl.fromTo(
        chars,
        { opacity: 0, y: 80, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.05,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // Subtitle animation
      tl.fromTo(
        subtitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );

      // Scroll indicator
      tl.fromTo(
        scrollIndicator,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        '-=0.3'
      );

      // Parallax on scroll
      gsap.to(title, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const titleText = 'ЛАБОРАТОРИЯ';
  const titleText2 = 'ОРАКУЛОВ';

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8"
        >
          <FlaskConical className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white/80">Научно обоснованные предсказания</span>
        </div>

        {/* Main Title */}
        <h1
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4"
          style={{ perspective: '1000px' }}
        >
          <div className="overflow-hidden">
            {titleText.split('').map((char, i) => (
              <span
                key={`t1-${i}`}
                className="title-char inline-block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="overflow-hidden mt-2">
            {titleText2.split('').map((char, i) => (
              <span
                key={`t2-${i}`}
                className="title-char inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {char}
              </span>
            ))}
          </div>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-xl sm:text-2xl text-white/60 max-w-2xl mx-auto mb-8"
        >
          Гороскопы, основанные на научных открытиях недели. 
          Где астрономия встречается с юмором.
        </p>

        {/* Current Week Status */}
        {hasCurrentWeek && currentWeekLabel ? (
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/30">
            <Sparkles className="w-5 h-5 text-green-400" />
            <div className="text-left">
              <span className="text-sm text-green-400/80 block">Актуальный гороскоп</span>
              <span className="text-lg font-semibold text-green-400">{currentWeekLabel}</span>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400">Гороскоп на этой неделе появится совсем скоро</span>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-sm text-white/40">Листайте вниз</span>
        <ChevronDown className="w-6 h-6 text-white/40 animate-bounce" />
      </div>
    </section>
  );
}
