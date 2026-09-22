import React from 'react';
import Section from '../../components/Section/Section';
import './Events.css';

const EVENTS = [
  {
    code: 'EV·01',
    title: 'ROBOWARS',
    desc: 'Robowars is part of the ROBOTRON event lineup from the previous edition. 2026 details are pending.',
    meta: 'PAST EDITION // ROBOTRON',
    icon: 'wars',
  },
  {
    code: 'EV·02',
    title: 'ROBOSOCCER',
    desc: 'Robosoccer features on the previous ROBOTRON page. The 2026 format and rules are not yet confirmed.',
    meta: 'PAST EDITION // ROBOTRON',
    icon: 'soccer',
  },
  {
    code: 'EV·03',
    title: 'ALGOMAZE',
    desc: 'Algomaze is an established ROBOTRON event. Details of the challenge for 2026 are still pending.',
    meta: 'PAST EDITION // ROBOTRON',
    icon: 'maze',
  },
  {
    code: 'EV·04',
    title: 'ROBODRIFT',
    desc: 'Robodrift completes the previous edition’s lineup. 2026 rules and event details are not yet confirmed.',
    meta: 'PAST EDITION // ROBOTRON',
    icon: 'drift',
  },
];

export default function Events() {
  return (
    <Section id="events" className="events" grid>
      <div className="container">
        <div className="events-head" data-reveal>
          <span className="kicker">PAST EVENTS // 0x02</span>
          <h2 className="section-title">ROBOTRON <span className="hl">competitions</span></h2>
        </div>

        <div className="events-grid">
          {EVENTS.map((e) => (
            <article key={e.code} className="event" data-reveal>
              <div className="event-art" data-cursor="view" tabIndex={-1} role="img" aria-label={e.title}>
                <span className="event-icon">{e.icon}</span>
              </div>
              <div className="event-body">
                <span className="event-code">{e.code}</span>
                <h3 className="event-title">{e.title}</h3>
                <p className="event-desc">{e.desc}</p>
                <span className="event-meta">{e.meta.toUpperCase()}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}