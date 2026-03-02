import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

gsap.registerPlugin(ScrollTrigger);

const budgetOptions = [
  'Under $10K',
  '$10K - $25K',
  '$25K - $50K',
  '$50K - $100K',
  '$100K+',
];

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const formCard = formCardRef.current;

    if (!section || !leftCol || !formCard) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftCol,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: leftCol,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        formCard,
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.1,
          scrollTrigger: {
            trigger: formCard,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-[70] bg-charcoal py-20 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-lavender/10 via-charcoal to-charcoal" />

      <div className="relative z-10 px-6 lg:px-[8vw]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-6xl mx-auto">
          {/* Left column - Text */}
          <div ref={leftColRef} className="w-full lg:w-2/5">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[clamp(34px,3.6vw,56px)] text-offwhite mb-4 lg:mb-6">
              Tell us what you're building.
            </h2>
            <p className="text-offwhite/70 text-base lg:text-lg mb-6 lg:mb-8">
              We reply within 2 business days. If it's urgent, ping us on the channels below.
            </p>
            
            <div className="flex items-center gap-3 text-offwhite/80">
              <Mail size={20} className="text-saffron" />
              <a 
                href="mailto:hello@ojas.studio" 
                className="hover:text-saffron transition-colors"
              >
                hello@ojas.studio
              </a>
            </div>
          </div>

          {/* Right column - Form */}
          <div
            ref={formCardRef}
            className="w-full lg:w-3/5 glass-card rounded-2xl p-6 lg:p-10"
          >
            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-saffron/20 flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-saffron" />
                </div>
                <h3 className="font-display font-semibold text-2xl text-offwhite mb-2">
                  Message sent!
                </h3>
                <p className="text-offwhite/70">
                  We'll be in touch within 2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                      Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      required
                      className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      required
                      className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                      Company
                    </label>
                    <Input
                      type="text"
                      placeholder="Company name"
                      className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                      Budget Range
                    </label>
                    <Select>
                      <SelectTrigger className="bg-charcoal/50 border-white/10 text-offwhite focus:ring-saffron/20">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent className="bg-charcoal border-white/10">
                        {budgetOptions.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="text-offwhite hover:bg-white/10 focus:bg-white/10"
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-[0.14em] text-offwhite/60 mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your project..."
                    rows={4}
                    required
                    className="bg-charcoal/50 border-white/10 text-offwhite placeholder:text-offwhite/40 focus:border-saffron focus:ring-saffron/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send inquiry
                      <Send size={16} />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
