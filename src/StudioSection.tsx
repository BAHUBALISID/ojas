import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StudioSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const cardCRef = useRef<HTMLDivElement>(null);
  const cardDRef = useRef<HTMLDivElement>(null);
  const cardERef = useRef<HTMLDivElement>(null);
  const cardFRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cardA = cardARef.current;
    const cardB = cardBRef.current;
    const cardC = cardCRef.current;
    const cardD = cardDRef.current;
    const cardE = cardERef.current;
    const cardF = cardFRef.current;

    if (!section || !cardA || !cardB || !cardC || !cardD || !cardE || !cardF) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl
        // Top row
        .fromTo(cardA, { x: '-60vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(cardC, { x: '60vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
        .fromTo(cardB, { y: '-40vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0)
        // Banner
        .fromTo(cardD, { scaleX: 0.2, opacity: 0 }, { scaleX: 1, opacity: 1, ease: 'none' }, 0.08)
        // Bottom row
        .fromTo(cardE, { y: '40vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.12)
        .fromTo(cardF, { x: '30vw', y: '30vh', opacity: 0 }, { x: 0, y: 0, opacity: 1, ease: 'none' }, 0.12);

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl
        .fromTo(cardA, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(cardC, { x: 0, opacity: 1 }, { x: '18vw', opacity: 0, ease: 'power2.in' }, 0.7)
        .fromTo(cardB, { y: 0, opacity: 1 }, { y: '-14vh', opacity: 0, ease: 'power2.in' }, 0.72)
        .fromTo(cardD, { y: 0, opacity: 1 }, { y: '12vh', opacity: 0, ease: 'power2.in' }, 0.72)
        .fromTo(cardE, { y: 0, opacity: 1 }, { y: '14vh', opacity: 0, ease: 'power2.in' }, 0.74)
        .fromTo(cardF, { y: 0, opacity: 1 }, { y: '14vh', opacity: 0, ease: 'power2.in' }, 0.74);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="section-pinned bg-charcoal flex items-center justify-center relative z-40"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-lavender/5" />

      {/* Mosaic grid */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-[8vw]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4">
          {/* Top-left photo card (A) */}
          <div
            ref={cardARef}
            className="sm:col-span-1 lg:col-span-4 rounded-2xl overflow-hidden h-[200px] lg:h-[30vh] relative group"
          >
            <img
              src="/team-01.jpg"
              alt="Team working"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
          </div>

          {/* Top-center text card (B) */}
          <div
            ref={cardBRef}
            className="sm:col-span-1 lg:col-span-3 glass-card rounded-2xl p-5 lg:p-6 h-[200px] lg:h-[30vh] flex flex-col justify-center"
          >
            <h3 className="font-display font-semibold text-xl lg:text-2xl text-offwhite mb-3">
              Small team. Senior hands.
            </h3>
            <p className="text-offwhite/70 text-sm lg:text-base">
              Designers who code. Engineers who care about brand.
            </p>
          </div>

          {/* Top-right photo card (C) */}
          <div
            ref={cardCRef}
            className="sm:col-span-2 lg:col-span-5 rounded-2xl overflow-hidden h-[200px] lg:h-[30vh] relative group"
          >
            <img
              src="/team-02.jpg"
              alt="Design process"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
          </div>

          {/* Center banner card (D) */}
          <div
            ref={cardDRef}
            className="sm:col-span-2 lg:col-span-12 glass-card rounded-2xl p-6 lg:p-8 h-[100px] lg:h-[18vh] flex items-center justify-center"
            style={{ transformOrigin: 'center' }}
          >
            <p className="font-display font-semibold text-xl sm:text-2xl lg:text-[clamp(24px,2.5vw,40px)] text-offwhite text-center">
              Fast feedback. Clear milestones. No surprises.
            </p>
          </div>

          {/* Bottom-left photo card (E) */}
          <div
            ref={cardERef}
            className="sm:col-span-1 lg:col-span-5 rounded-2xl overflow-hidden h-[150px] lg:h-[18vh] relative group"
          >
            <img
              src="/team-03.jpg"
              alt="Team photo"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
          </div>

          {/* Bottom-right text card (F) */}
          <div
            ref={cardFRef}
            className="sm:col-span-1 lg:col-span-7 glass-card rounded-2xl p-5 lg:p-6 h-[150px] lg:h-[18vh] flex flex-col justify-center"
          >
            <h3 className="font-display font-semibold text-lg lg:text-xl text-offwhite mb-2">
              Remote-first. Studio-sharp.
            </h3>
            <p className="text-offwhite/70 text-sm lg:text-base">
              We collaborate across time zones—and ship like we're in the same room.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioSection;
