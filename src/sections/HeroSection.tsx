import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const microLabelRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subhead = subheadRef.current;
    const cta = ctaRef.current;
    const microLabel = microLabelRef.current;
    const image = imageRef.current;

    if (!section || !headline || !subhead || !cta || !microLabel || !image) return;

    const ctx = gsap.context(() => {
      // Initial load animation
      const loadTl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      loadTl
        .fromTo(microLabel, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo(headline, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
        .fromTo(subhead, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
        .fromTo(cta, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6)
        .fromTo(image, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.9 }, 0.2);

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements when scrolling back to top
            gsap.set([microLabel, headline, subhead, cta], { opacity: 1, x: 0, y: 0 });
            gsap.set(image, { opacity: 1, x: 0, rotateY: 0 });
          },
        },
      });

      // ENTRANCE (0-30%): Hold at settle state (already animated by load)
      // SETTLE (30-70%): Static
      // EXIT (70-100%): Elements exit
      scrollTl
        .fromTo(
          headline,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          [subhead, cta],
          { x: 0, opacity: 1 },
          { x: '-12vw', opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(
          microLabel,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.75
        )
        .fromTo(
          image,
          { x: 0, rotateY: 0, opacity: 1 },
          { x: '18vw', rotateY: 18, opacity: 0, ease: 'power2.in' },
          0.7
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToWork = () => {
    const workSection = document.querySelector('#work');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStudio = () => {
    const studioSection = document.querySelector('#studio');
    if (studioSection) {
      studioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-pinned bg-charcoal flex items-center relative z-10"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-lavender/10" />

      {/* Content container */}
      <div className="relative z-10 w-full px-6 lg:px-0 lg:pl-[8vw]">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left content */}
          <div className="w-full lg:w-[40vw] text-center lg:text-left pt-20 lg:pt-0">
            {/* Micro label */}
            <span
              ref={microLabelRef}
              className="font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-6 block"
            >
              Creative Agency + Software Studio
            </span>

            {/* Headline */}
            <h1
              ref={headlineRef}
              className="font-display font-bold text-[clamp(48px,10vw,120px)] leading-[0.9] tracking-[-0.03em] text-offwhite mb-6"
            >
              OJAS
            </h1>

            {/* Subheadline */}
            <p
              ref={subheadRef}
              className="text-lg lg:text-xl text-offwhite/80 max-w-md mx-auto lg:mx-0 mb-8"
            >
              Campaigns that resonate. Products that ship.
            </p>

            {/* CTA buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={scrollToWork} className="btn-primary flex items-center justify-center gap-2">
                View selected work
                <ArrowRight size={18} />
              </button>
              <button
                onClick={scrollToStudio}
                className="text-offwhite/70 hover:text-offwhite transition-colors flex items-center justify-center gap-1"
              >
                Meet the studio
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Right content - 3D Image */}
          <div
            ref={imageRef}
            className="w-full lg:w-[56vw] h-[50vh] lg:h-[100vh] mt-12 lg:mt-0 relative"
            style={{ perspective: '1000px' }}
          >
            <div className="absolute inset-0 flex items-center justify-center lg:justify-end">
              <img
                src="/hero-cubes.jpg"
                alt="3D Cubes"
                className="w-full h-full object-contain lg:object-cover animate-float-slow"
              />
            </div>
            {/* Decorative light rays */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-lavender/20 rounded-full blur-[100px] animate-pulse-glow" />
              <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-saffron/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
