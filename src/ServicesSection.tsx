import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Palette, Code, Megaphone, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Megaphone,
    title: 'Campaign & Creative',
    description: 'Brand strategy • Art direction • Social content • Paid media creative',
    color: 'saffron',
  },
  {
    icon: Code,
    title: 'Design & Engineering',
    description: 'UI/UX design • Frontend (React/TS) • Backend • QA & DevOps',
    color: 'lavender',
  },
  {
    icon: Palette,
    title: 'Brand Identity',
    description: 'Logo design • Visual systems • Brand guidelines • Messaging',
    color: 'saffron',
  },
  {
    icon: Layers,
    title: 'Product Strategy',
    description: 'User research • Roadmapping • Prototyping • Growth planning',
    color: 'lavender',
  },
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !heading) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        heading,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      cards.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 40, rotateX: 10, opacity: 0 },
          {
            y: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-30 bg-lavender py-20 lg:py-32 overflow-hidden"
    >
      {/* Wireframe watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px]">
          <path d="M100 100 L500 100 L500 500 L100 500 Z" stroke="currentColor" strokeWidth="1" fill="none" className="text-offwhite" />
          <path d="M150 150 L450 150 L450 450 L150 450 Z" stroke="currentColor" strokeWidth="1" fill="none" className="text-offwhite" />
          <path d="M200 200 L400 200 L400 400 L200 400 Z" stroke="currentColor" strokeWidth="1" fill="none" className="text-offwhite" />
          <line x1="100" y1="100" x2="500" y2="500" stroke="currentColor" strokeWidth="0.5" className="text-offwhite" />
          <line x1="500" y1="100" x2="100" y2="500" stroke="currentColor" strokeWidth="0.5" className="text-offwhite" />
        </svg>
      </div>

      <div className="relative z-10 px-6 lg:px-[8vw]">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12 lg:mb-20">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[clamp(34px,3.6vw,56px)] text-offwhite mb-4 lg:mb-6">
            Strategy, design, and code—under one roof.
          </h2>
          <p className="text-offwhite/80 text-base lg:text-lg max-w-2xl mx-auto">
            We run discovery sprints, build brands, and ship production apps with clean architecture.
          </p>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="glass-card rounded-2xl p-6 lg:p-8 hover:border-offwhite/20 transition-all duration-300 group"
              style={{ perspective: '1000px' }}
            >
              <div className="flex items-start justify-between mb-4">
                <service.icon
                  size={28}
                  className={`text-${service.color} flex-shrink-0`}
                  style={{ color: service.color === 'saffron' ? '#F2C94C' : '#9B94D4' }}
                />
                <div
                  className={`w-10 h-10 rounded-lg border border-${service.color}/30 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity`}
                  style={{ borderColor: service.color === 'saffron' ? 'rgba(242, 201, 76, 0.3)' : 'rgba(155, 148, 212, 0.3)' }}
                >
                  <div
                    className={`w-2 h-2 rounded-full bg-${service.color}`}
                    style={{ backgroundColor: service.color === 'saffron' ? '#F2C94C' : '#9B94D4' }}
                  />
                </div>
              </div>
              <h3 className="font-display font-semibold text-xl lg:text-2xl text-offwhite mb-2">
                {service.title}
              </h3>
              <p className="text-offwhite/70 text-sm lg:text-base">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 lg:mt-16">
          <button className="inline-flex items-center gap-2 text-offwhite/80 hover:text-offwhite transition-colors font-mono text-sm uppercase tracking-[0.14em]">
            <Download size={16} />
            Download capabilities (PDF)
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
