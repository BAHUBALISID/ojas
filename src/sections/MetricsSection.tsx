import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: 120, suffix: '+', label: 'Campaigns shipped' },
  { value: 40, suffix: '+', label: 'Products launched' },
  { value: 6, suffix: '', label: 'Years of craft' },
];

const testimonials = [
  {
    quote: "Ojas turned our brief into a brand and a product in 10 weeks.",
    author: "Aisha K.",
    role: "CMO",
    avatar: "/avatar-01.jpg",
  },
  {
    quote: "They design like artists and build like engineers.",
    author: "Rohan S.",
    role: "Product Lead",
    avatar: "/avatar-02.jpg",
  },
];

const MetricsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const testimonialCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [counts, setCounts] = useState(metrics.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    const metricsEl = metricsRef.current;
    const testimonialCards = testimonialCardsRef.current.filter(Boolean);

    if (!section || !metricsEl) return;

    const ctx = gsap.context(() => {
      // Metrics count-up animation
      ScrollTrigger.create({
        trigger: metricsEl,
        start: 'top 80%',
        onEnter: () => {
          metrics.forEach((metric, index) => {
            gsap.to(
              { value: 0 },
              {
                value: metric.value,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: function () {
                  setCounts((prev) => {
                    const newCounts = [...prev];
                    newCounts[index] = Math.round(this.targets()[0].value);
                    return newCounts;
                  });
                },
              }
            );
          });
        },
        once: true,
      });

      // Labels animation
      gsap.fromTo(
        metricsEl.querySelectorAll('.metric-label'),
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: metricsEl,
            start: 'top 80%',
          },
        }
      );

      // Testimonial cards animation
      testimonialCards.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 30, rotateZ: -1, opacity: 0 },
          {
            y: 0,
            rotateZ: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.15,
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
      className="relative z-[60] bg-charcoal py-20 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal to-lavender/5" />

      <div className="relative z-10 px-6 lg:px-[8vw]">
        {/* Metrics */}
        <div
          ref={metricsRef}
          className="grid grid-cols-3 gap-4 lg:gap-8 mb-16 lg:mb-24"
        >
          {metrics.map((metric, index) => (
            <div key={metric.label} className="text-center">
              <div className="font-display font-bold text-3xl sm:text-4xl lg:text-[clamp(40px,5vw,72px)] text-saffron mb-2">
                {counts[index]}{metric.suffix}
              </div>
              <div className="metric-label font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Press logos */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12 mb-16 lg:mb-24 opacity-40">
          {['TechCrunch', 'Forbes', 'Wired', 'The Verge', 'Product Hunt'].map((logo) => (
            <span
              key={logo}
              className="font-display font-semibold text-lg lg:text-xl text-offwhite/70"
            >
              {logo}
            </span>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              ref={(el) => { testimonialCardsRef.current[index] = el; }}
              className="glass-card rounded-2xl p-6 lg:p-8"
            >
              <Quote size={24} className="text-saffron/50 mb-4" />
              <p className="text-offwhite text-base lg:text-lg mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-display font-semibold text-offwhite text-sm lg:text-base">
                    {testimonial.author}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
