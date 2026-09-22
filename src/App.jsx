import React from 'react';
import useSmoothScroll from './hooks/useSmoothScroll';
import useReducedMotion from './hooks/useReducedMotion';
import useIsDesktop from './hooks/useIsDesktop';
import { ParallaxProvider } from './components/ParallaxLayer/index';
import Navbar from './components/Navbar/Navbar';
import CustomCursor from './components/CustomCursor/CustomCursor';
import Hero from './components/Hero/Hero';
import About from './sections/About/About';
import Events from './sections/Events/Events';
import Timeline from './sections/Timeline/Timeline';
import Sponsors from './sections/Sponsors/Sponsors';
import Team from './sections/Team/Team';
import Contact from './sections/Contact/Contact';
import './App.css';

export default function App() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  useSmoothScroll(); // instantiates Lenis + ties it to ScrollTrigger

  return (
    <ParallaxProvider reduced={reduced} isDesktop={isDesktop} enabled>
      <Navbar />
      <CustomCursor />

      <main id="content">
        <Hero />
        <About />
        <Events />
        <Timeline />
        <Sponsors />
        <Team />
        <Contact />
      </main>

      <footer className="app-footer">
        <p className="footer-glitch" aria-hidden="true">ROBOTRON_2026</p>
        <p>© 2026 ROBOTRON — N.E.R.D.S., NIT SILCHAR&nbsp;//&nbsp;ASSAM,&nbsp;INDIA</p>
      </footer>
    </ParallaxProvider>
  );
}