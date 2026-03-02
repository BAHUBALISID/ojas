import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CaseStudySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const statementCardRef = useRef<HTMLDivElement>(null);
  const statementTextRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageCard = imageCardRef.current;
    const statementCard = statementCardRef.current;
    const statementText = statementTextRef.current;
    const cta = ctaRef.current;

    if (!section || !imageCard || !statementCard || !statementText || !cta) return;

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
          imageCard,
          { x: '-60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          statementCard,
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          statementText,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.1
        )
        .fromTo(
          cta,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.15
        );

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl
        .fromTo(
          imageCard,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          statementCard,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          statementText,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(
          cta,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.74
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-charcoal flex items-center justify-center relative z-50"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-charcoal via-charcoal to-saffron/5" />

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-[10vw]">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left image card */}
          <div
            ref={imageCardRef}
            className="w-full lg:w-[38vw] h-[300px] lg:h-[64vh] rounded-2xl overflow-hidden relative group"
          >
            <img
              src="/case-study.jpg"
              alt="Case Study"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
            
            {/* Floating badge */}
            <div className="absolute top-4 left-4 glass-card px-3 py-1.5 rounded-full">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-saffron">
                Featured Case Study
              </span>
            </div>
          </div>

          {/* Right statement card */}
          <div
            ref={statementCardRef}
            className="w-full lg:w-[38vw] h-auto lg:h-[64vh] glass-card rounded-2xl p-6 lg:p-10 flex flex-col justify-center"
          >
            <h2
              ref={statementTextRef}
              className="font-display font-semibold text-2xl sm:text-3xl lg:text-[clamp(28px,2.8vw,44px)] leading-tight text-offwhite mb-6 lg:mb-8"
            >
              Systems that stay fast—even when complexity grows.
            </h2>
            
            <p className="text-offwhite/70 text-base lg:text-lg mb-8 lg:mb-10">
              We architected a scalable platform handling 10M+ monthly users, 
              maintaining sub-100ms response times through intelligent caching 
              and microservices optimization.
            </p>

            <button
              ref={ctaRef}
              className="inline-flex items-center gap-2 text-saffron hover:text-offwhite transition-colors group/link"
            >
              <span className="font-mono text-sm uppercase tracking-[0.14em]">
                Read the case study
              </span>
              <ArrowRight 
                size={18} 
                className="transition-transform duration-300 group-hover/link:translate-x-1" 
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
