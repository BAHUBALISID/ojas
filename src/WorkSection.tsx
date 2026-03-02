import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WorkSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statementCardRef = useRef<HTMLDivElement>(null);
  const statementTextRef = useRef<HTMLHeadingElement>(null);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const metaCardRef = useRef<HTMLDivElement>(null);
  const ctaCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const statementCard = statementCardRef.current;
    const statementText = statementTextRef.current;
    const thumbnail = thumbnailRef.current;
    const metaCard = metaCardRef.current;
    const ctaCard = ctaCardRef.current;

    if (!section || !statementCard || !statementText || !thumbnail || !metaCard || !ctaCard) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl
        .fromTo(
          statementCard,
          { x: '-60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          statementText,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.05
        )
        .fromTo(
          thumbnail,
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          [metaCard, ctaCard],
          { y: '30vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.1
        );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl
        .fromTo(
          statementCard,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          statementText,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(
          thumbnail,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          [metaCard, ctaCard],
          { y: 0, opacity: 1 },
          { y: '16vh', opacity: 0, ease: 'power2.in' },
          0.72
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-pinned bg-charcoal flex items-center justify-center relative z-20"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tl from-charcoal via-charcoal to-lavender/5" />

      {/* Floating 3D cubes decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 border border-lavender/20 rounded-lg animate-float opacity-30" />
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 border border-saffron/20 rounded-lg animate-float-slow opacity-20" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content grid */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-[10vw]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Large statement card */}
          <div
            ref={statementCardRef}
            className="lg:col-span-7 glass-card rounded-2xl p-6 lg:p-10 min-h-[280px] lg:min-h-[44vh] flex items-center"
          >
            <h2
              ref={statementTextRef}
              className="font-display font-semibold text-2xl sm:text-3xl lg:text-[clamp(28px,3vw,44px)] leading-tight text-offwhite"
            >
              Campaigns built for attention—and engineered to convert.
            </h2>
          </div>

          {/* Project thumbnail card */}
          <div
            ref={thumbnailRef}
            className="lg:col-span-5 rounded-2xl overflow-hidden min-h-[280px] lg:min-h-[44vh] relative group"
          >
            <img
              src="/work-portrait.jpg"
              alt="Aura Rebrand Project"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
          </div>

          {/* Project meta card */}
          <div
            ref={metaCardRef}
            className="lg:col-span-4 glass-card rounded-2xl p-6 lg:p-8 min-h-[120px] lg:min-h-[16vh] flex flex-col justify-center"
          >
            <h3 className="font-display font-semibold text-xl lg:text-2xl text-offwhite mb-2">
              AURA REBRAND
            </h3>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60">
              Identity / Web / Launch
            </p>
          </div>

          {/* CTA card */}
          <div
            ref={ctaCardRef}
            className="lg:col-span-8 glass-card rounded-2xl p-6 lg:p-8 min-h-[120px] lg:min-h-[16vh] flex items-center justify-between group cursor-pointer hover:border-saffron/30 transition-colors"
          >
            <span className="font-display font-semibold text-lg lg:text-xl text-offwhite">
              Explore all work
            </span>
            <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight size={20} className="text-charcoal" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
