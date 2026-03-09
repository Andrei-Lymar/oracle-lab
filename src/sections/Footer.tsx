// ============================================================================
// Footer Section
// ============================================================================

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FlaskConical, Lock } from 'lucide-react';

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const marqueeContent = marquee.querySelector('.marquee-content');
    if (marqueeContent) {
      gsap.to(marqueeContent, {
        x: '-50%',
        duration: 30,
        ease: 'none',
        repeat: -1,
      });
    }
  }, []);

  const marqueeText = 'НАУКА • АСТРОНОМИЯ • ЮМОР • ГОРОСКОП • ОТКРЫТИЯ • ';

  return (
    <footer ref={footerRef} className="relative border-t border-white/10">
      {/* Marquee */}
      <div
        ref={marqueeRef}
        className="py-6 overflow-hidden border-b border-white/10"
      >
        <div className="marquee-content flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-4xl sm:text-5xl font-bold text-white/10 mx-4"
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Лаборатория Оракулов</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Гороскопы, основанные на научных открытиях недели. 
                Где астрономия встречается с юмором, а физики шутят.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
                Навигация
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#hero"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Главная
                  </a>
                </li>
                <li>
                  <a
                    href="#zodiac"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Знаки зодиака
                  </a>
                </li>
                <li>
                  <a
                    href="#archive"
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    Архив
                  </a>
                </li>
              </ul>
            </div>

            {/* Admin Link */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
                Для администратора
              </h4>
              <a
                href="/admin.html"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/60 hover:text-white"
              >
                <Lock className="w-4 h-4" />
                <span className="text-sm">Вход в админку</span>
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Лаборатория Оракулов. Все права защищены.
            </p>
            <p className="text-xs text-white/30 italic">
              Научное примечание: данный сайт не прошел рецензирование 
              и основан на сомнительной корреляции между астрономией и нейронными связями автора.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
