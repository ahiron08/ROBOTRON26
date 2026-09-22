import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';
import Magnetic from '../Magnetic/Magnetic';
import './Navbar.css';

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  ['HOME', '#hero'],
  ['EVENTS', '#events'],
  ['ABOUT', '#about'],
  ['TEAM', '#team'],
  ['CONTACT', '#contact'],
];

export default function Navbar() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  // Shrink + darken on scroll (desktop).
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 40,
      end: 200,
      onUpdate: (self) => {
        const k = self.progress;
        ref.current?.setAttribute('data-scrolled', k > 0.5 ? 'true' : 'false');
        gsap.to(ref.current, {
          '--nav-h': `${76 - 20 * k}px`,
          backgroundColor: `rgba(5,4,10,${0.05 + 0.65 * k})`,
          duration: 0.1,
          overwrite: true,
        });
      },
    });
    return () => st.destroy?.();
  }, []);

  return (
    <header ref={ref} className={`nav ${open ? 'is-open' : ''}`} data-scrolled="false">
      <div className="nav-inner">
        {/* Left — logo / brand */}
        <a href="#hero" className="nav-brand" onClick={() => setOpen(false)} aria-label="ROBOTRON home">
          <span className="nav-brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="nav-brand-name">ROBOTRON</span>
          <span className="nav-brand-year">/26</span>
        </a>

        {/* Center — links */}
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <Magnetic key={label} as="a" href={href} className="nav-link" onClick={() => setOpen(false)}>
              {label}
            </Magnetic>
          ))}
        </nav>

        {/* Right — status */}
        <div className="nav-meta">
          <span className="nav-status">
            <i className="nav-status-dot" />
            NIT&nbsp;SILCHAR
          </span>
          <span className="nav-meta-rule" aria-hidden="true">//</span>
          <span className="nav-meta-year">ED.&nbsp;2026</span>
        </div>

        {/* Mobile toggle */}
        <button
          className="nav-burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile ${open ? 'nav-mobile--open' : ''}`}>
        {LINKS.map(([label, href], i) => (
          <a key={label} href={href} className="nav-mobile-link" onClick={() => setOpen(false)}>
            <span className="nav-mobile-idx">0{i + 1}</span>
            <span>{label.toUpperCase()}</span>
            <span className="nav-mobile-arrow" aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    </header>
  );
}