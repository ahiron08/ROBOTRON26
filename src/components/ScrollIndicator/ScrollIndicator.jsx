import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollIndicator.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollIndicator
 * ----------------------------------------------------------------------
 * Bottom-center call-to-scroll marker: a framed chevron with a travelling
 * light. Fades out once the user scrolls away from the top of the hero and
 * fades back in when they return.
 */
export default function ScrollIndicator() {
  const ref = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 60,
      onToggle: (self) => setGone(self.isActive),
    });
    return () => st.destroy?.();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className={`scroll-ind ${gone ? 'is-gone' : ''}`}
      onClick={() => window.scrollTo({ top: window.innerHeight })}
      aria-label="Scroll to explore"
    >
      <span className="si-frame" aria-hidden="true">
        <i className="si-top" />
        <i className="si-bottom" />
        <span className="si-caret">↓</span>
        <span className="si-light" />
      </span>
      <span className="si-label">SCROLL&nbsp;TO&nbsp;EXPLORE</span>
    </button>
  );
}