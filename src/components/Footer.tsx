import { Linkedin, Twitter, Instagram, Github, ArrowUpRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  const navLinks = [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Studio', href: '#studio' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    if (href === '#') return;
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative z-[80] bg-charcoal border-t border-white/5">
      <div className="px-6 lg:px-[8vw] py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
          {/* Left - Brand */}
          <div className="lg:w-1/3">
            <a
              href="#"
              className="font-display font-bold text-2xl lg:text-3xl text-offwhite tracking-tight inline-block mb-4"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Ojas
            </a>
            <p className="text-offwhite/60 text-sm lg:text-base max-w-xs">
              Creative agency and software studio. We build brands and the systems that scale them.
            </p>
          </div>

          {/* Center - Navigation */}
          <div className="lg:w-1/3">
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-offwhite/40 mb-4">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-offwhite/70 hover:text-offwhite transition-colors text-left flex items-center gap-1 group"
                >
                  {link.label}
                  <ArrowUpRight 
                    size={14} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* Right - Social */}
          <div className="lg:w-1/3">
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-offwhite/40 mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-offwhite/60 hover:text-offwhite hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 lg:mt-16 pt-6 lg:pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-offwhite/40 text-sm">
            © {currentYear} Ojas Advertisement. All rights reserved.
          </p>
          <div className="flex gap-6 items-center">
            <button className="text-offwhite/40 hover:text-offwhite/70 text-sm transition-colors">
              Privacy Policy
            </button>
            <button className="text-offwhite/40 hover:text-offwhite/70 text-sm transition-colors">
              Terms of Service
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="text-offwhite/40 hover:text-saffron text-sm transition-colors flex items-center gap-1"
            >
              <Lock size={12} />
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
