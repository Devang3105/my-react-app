import { useState, useEffect, useRef } from "react";

// ─── Color tokens ───────────────────────────────────────────────
const C = {
  navy: "#0a0e1a",
  navyDeep: "#060910",
  navyMid: "#0f1628",
  navyLight: "#162040",
  gold: "#d4a017",
  goldBright: "#f0be3a",
  goldDim: "#9b7510",
  white: "#f5f0e8",
  whiteDim: "#c8c0b0",
  slate: "#8892a4",
  glass: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(212,160,23,0.25)",
  glassBorderHover: "rgba(212,160,23,0.6)",
};

// ─── Utility ────────────────────────────────────────────────────
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

function AnimSection({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 0.7s ease, transform 0.7s ease",
      ...style,
    }}>{children}</div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body, #root {
    background: #060910;
    color: #f5f0e8;
    font-family: 'Barlow', sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
  }

  .display { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: 0.02em; }
  .subhead { font-family: 'Rajdhani', sans-serif; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }

  /* Nav */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(6,9,16,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(212,160,23,0.15);
    padding: 0 2rem;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 1.2rem; color: #d4a017; letter-spacing: 0.1em; text-transform: uppercase; }
  .nav-links { display: flex; gap: 2rem; }
  .nav-links a { color: #c8c0b0; text-decoration: none; font-size: 0.85rem; letter-spacing: 0.06em; text-transform: uppercase; font-family: 'Rajdhani', sans-serif; font-weight: 600; transition: color 0.2s; }
  .nav-links a:hover { color: #d4a017; }
  .nav-cta { background: #d4a017; color: #060910; border: none; padding: 0.45rem 1.2rem; border-radius: 4px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; }
  .nav-cta:hover { background: #f0be3a; }

  /* Hero */
  .hero {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,160,23,0.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 20% 50%, rgba(20,50,120,0.4) 0%, transparent 60%),
      linear-gradient(180deg, #060910 0%, #0a0e1a 40%, #0f1628 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 8rem 2rem 4rem; position: relative; overflow: hidden;
  }

  /* Stadium SVG backdrop */
  .hero-stadium {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 55%;
    opacity: 0.18;
    pointer-events: none;
  }

  /* Floodlight rays */
  .ray {
    position: absolute;
    width: 2px;
    background: linear-gradient(to bottom, rgba(240,190,58,0.6), transparent);
    transform-origin: top center;
    pointer-events: none;
  }

  .badge-tournament {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(212,160,23,0.12);
    border: 1px solid rgba(212,160,23,0.4);
    border-radius: 100px;
    padding: 0.35rem 1rem;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 600; font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: #d4a017; margin-bottom: 1.5rem;
  }

  .hero-title {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
    font-size: clamp(2.6rem, 7vw, 6rem);
    line-height: 1.0; text-transform: uppercase; letter-spacing: 0.02em;
    color: #f5f0e8;
    text-shadow: 0 0 80px rgba(212,160,23,0.3);
    margin-bottom: 0.5rem; position: relative; z-index: 1;
  }
  .hero-title span { color: #d4a017; }

  .hero-tagline {
    font-family: 'Rajdhani', sans-serif; font-weight: 600;
    font-size: clamp(1rem, 2.5vw, 1.4rem);
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #8892a4; margin-bottom: 2.5rem; position: relative; z-index: 1;
  }

  .btn-primary {
    background: linear-gradient(135deg, #d4a017, #f0be3a);
    color: #060910; border: none;
    padding: 0.9rem 2.5rem;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 1rem; letter-spacing: 0.12em; text-transform: uppercase;
    border-radius: 4px; cursor: pointer; position: relative; z-index: 1;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 30px rgba(212,160,23,0.3);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(212,160,23,0.45); }

  .btn-outline {
    background: transparent; color: #d4a017;
    border: 1px solid rgba(212,160,23,0.5);
    padding: 0.9rem 2rem;
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 1rem; letter-spacing: 0.1em; text-transform: uppercase;
    border-radius: 4px; cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .btn-outline:hover { background: rgba(212,160,23,0.08); border-color: #d4a017; }

  /* Countdown */
  .countdown { display: flex; gap: 1rem; justify-content: center; margin: 2.5rem 0; position: relative; z-index: 1; }
  .cd-block {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(212,160,23,0.2);
    border-radius: 8px; padding: 1rem 1.5rem; min-width: 80px; text-align: center;
    backdrop-filter: blur(4px);
  }
  .cd-num { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 2.2rem; color: #d4a017; line-height: 1; }
  .cd-label { font-family: 'Rajdhani', sans-serif; font-size: 0.7rem; letter-spacing: 0.12em; color: #8892a4; text-transform: uppercase; margin-top: 4px; }

  /* Section wrapper */
  .section { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
  .section-full { padding: 5rem 2rem; }
  .section-bg { background: #0f1628; }
  .section-bg2 { background: #0a0e1a; }

  .section-label {
    font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 0.75rem; letter-spacing: 0.2em; color: #d4a017;
    text-transform: uppercase; margin-bottom: 0.5rem;
  }
  .section-title {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
    font-size: clamp(1.8rem, 4vw, 3rem); text-transform: uppercase;
    color: #f5f0e8; letter-spacing: 0.02em; line-height: 1.1;
    margin-bottom: 1rem;
  }
  .section-title span { color: #d4a017; }
  .section-sub { color: #8892a4; font-size: 1rem; max-width: 520px; line-height: 1.7; }

  /* Gold divider */
  .divider { width: 60px; height: 3px; background: linear-gradient(90deg, #d4a017, #f0be3a); border-radius: 2px; margin: 1rem 0 2rem; }

  /* Glass card */
  .glass-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212,160,23,0.18);
    border-radius: 12px;
    backdrop-filter: blur(8px);
    transition: border-color 0.3s, transform 0.3s;
  }
  .glass-card:hover { border-color: rgba(212,160,23,0.5); transform: translateY(-3px); }

  /* Details grid */
  .details-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
  .detail-item {
    padding: 1.25rem 1.5rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .detail-icon {
    width: 44px; height: 44px; border-radius: 10px;
    background: rgba(212,160,23,0.1);
    border: 1px solid rgba(212,160,23,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem; flex-shrink: 0;
  }
  .detail-label { font-family: 'Rajdhani', sans-serif; font-size: 0.72rem; letter-spacing: 0.12em; color: #8892a4; text-transform: uppercase; }
  .detail-val { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 1rem; color: #f5f0e8; margin-top: 2px; }

  /* Prize cards */
  .prizes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
  .prize-card {
    padding: 2rem 1.5rem; text-align: center;
    border-radius: 12px; cursor: default;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(212,160,23,0.18);
    transition: all 0.35s;
    position: relative; overflow: hidden;
  }
  .prize-card::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(212,160,23,0.12), transparent 70%);
    opacity: 0; transition: opacity 0.35s;
  }
  .prize-card:hover::before { opacity: 1; }
  .prize-card:hover { transform: translateY(-6px); border-color: #d4a017; box-shadow: 0 12px 40px rgba(212,160,23,0.2); }
  .prize-icon { font-size: 2.8rem; margin-bottom: 1rem; }
  .prize-name { font-family: 'Rajdhani', sans-serif; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.85rem; color: #8892a4; margin-bottom: 0.4rem; }
  .prize-amount { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 2rem; color: #d4a017; }

  /* Registration form */
  .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: #8892a4; }
  .form-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(212,160,23,0.2);
    border-radius: 6px; padding: 0.75rem 1rem;
    color: #f5f0e8; font-family: 'Barlow', sans-serif; font-size: 0.95rem;
    outline: none; transition: border-color 0.2s;
    width: 100%;
  }
  .form-input:focus { border-color: #d4a017; background: rgba(212,160,23,0.05); }
  .form-input::placeholder { color: #8892a4; }
  .form-input.error { border-color: #e24b4a; }
  .form-error { font-size: 0.75rem; color: #e24b4a; margin-top: 2px; }

  /* Team slots */
  .slots-bar-bg { background: rgba(255,255,255,0.08); border-radius: 100px; height: 8px; overflow: hidden; margin: 0.5rem 0 1rem; }
  .slots-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #d4a017, #f0be3a); transition: width 1s ease; }

  /* FAQ */
  .faq-item { border-bottom: 1px solid rgba(212,160,23,0.12); }
  .faq-q {
    width: 100%; background: none; border: none; color: #f5f0e8;
    text-align: left; padding: 1.2rem 0;
    font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 1.05rem;
    cursor: pointer; display: flex; justify-content: space-between; align-items: center;
    transition: color 0.2s;
  }
  .faq-q:hover { color: #d4a017; }
  .faq-a { overflow: hidden; color: #8892a4; font-size: 0.95rem; line-height: 1.7; padding-bottom: 1rem; }

  /* Gallery */
  .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
  .gallery-item {
    aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; cursor: pointer;
    position: relative; background: #162040;
    border: 1px solid rgba(212,160,23,0.1);
  }
  .gallery-item:hover .gallery-overlay { opacity: 1; }
  .gallery-overlay {
    position: absolute; inset: 0; background: rgba(212,160,23,0.2);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s;
    font-size: 2rem;
  }

  /* Sponsors */
  .sponsor-row { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; align-items: center; }
  .sponsor-logo {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(212,160,23,0.15);
    border-radius: 8px; padding: 1rem 2rem;
    font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
    font-size: 1.1rem; color: #8892a4; letter-spacing: 0.08em;
    transition: all 0.2s;
  }
  .sponsor-logo:hover { border-color: rgba(212,160,23,0.5); color: #d4a017; }

  /* Contact */
  .contact-card { padding: 2rem; }
  .contact-row { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 0; border-bottom: 1px solid rgba(212,160,23,0.1); }
  .contact-row:last-child { border-bottom: none; }
  .contact-icon { font-size: 1.4rem; width: 40px; text-align: center; }
  .contact-text { color: #c8c0b0; font-size: 0.95rem; }
  .contact-text strong { color: #f5f0e8; }

  .social-links { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
  .social-btn {
    width: 44px; height: 44px; border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(212,160,23,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; cursor: pointer; transition: all 0.2s;
    text-decoration: none; color: #8892a4;
  }
  .social-btn:hover { background: rgba(212,160,23,0.1); border-color: #d4a017; color: #d4a017; }

  /* Footer */
  footer {
    background: #060910;
    border-top: 1px solid rgba(212,160,23,0.12);
    padding: 3rem 2rem 1.5rem;
  }
  .footer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
  .footer-title { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; color: #d4a017; margin-bottom: 1rem; }
  .footer-links { list-style: none; }
  .footer-links li { margin-bottom: 0.5rem; }
  .footer-links a { color: #8892a4; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
  .footer-links a:hover { color: #d4a017; }
  .footer-bottom { max-width: 1200px; margin: 2rem auto 0; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
  .footer-copy { color: #8892a4; font-size: 0.82rem; }

  /* Rules table */
  .rules-table { width: 100%; border-collapse: collapse; }
  .rules-table th {
    background: rgba(212,160,23,0.12);
    color: #d4a017; font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.75rem 1rem; text-align: left;
  }
  .rules-table td { padding: 0.75rem 1rem; color: #c8c0b0; font-size: 0.9rem; border-bottom: 1px solid rgba(212,160,23,0.08); vertical-align: top; }
  .rules-table tr:last-child td { border-bottom: none; }

  /* Success overlay */
  .success-overlay {
    text-align: center; padding: 3rem 2rem;
  }
  .success-icon { font-size: 4rem; margin-bottom: 1rem; }
  .success-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 2rem; color: #d4a017; text-transform: uppercase; }
  .success-sub { color: #8892a4; margin-top: 0.5rem; }

  /* Responsive */
  @media (max-width: 768px) {
    .nav-links { display: none; }
    .countdown { gap: 0.6rem; }
    .cd-block { padding: 0.75rem 1rem; min-width: 60px; }
    .cd-num { font-size: 1.8rem; }
    .form-grid { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; }
  }

  @media (max-width: 480px) {
    .hero { padding: 7rem 1rem 3rem; }
    .section { padding: 3rem 1rem; }
    .hero-title { font-size: 2.2rem; }
  }
`;

// ─── Gallery photos (SVG placeholders styled like cricket photos) ─
const galleryItems = [
  { icon: "🏏", label: "Opening Ceremony 2024", color: "#1a2a4a" },
  { icon: "🏆", label: "Champions Celebration", color: "#1a3a2a" },
  { icon: "⚾", label: "Final Match Action", color: "#2a1a3a" },
  { icon: "👥", label: "Team Huddle", color: "#3a2a1a" },
  { icon: "🎯", label: "Bowling in Action", color: "#1a3a3a" },
  { icon: "🥇", label: "Prize Distribution", color: "#2a1a1a" },
  { icon: "📸", label: "Crowd Energy", color: "#1a2a3a" },
];

const faqs = [
  {
    q: "How do I register my team?",
    a: "Fill the registration form on this page with your team details, player list, and upload your team logo. After submitting, pay the entry fee via QR code and upload the payment screenshot. You'll receive a WhatsApp confirmation within 24 hours.",
  },
  {
    q: "What is the entry fee per team?",
    a: "The entry fee is ₹1,000 per team. This covers all match expenses, tournament kits, and prize pool contributions. Payment via UPI/bank transfer. No refunds after confirmation.",
  },
  {
    q: "What is the refund policy?",
    a: "No refund is provided. In case of event cancellation by organizers, full refund is issued.",
  },
  {
    q: "What are the match rules?",
    a: "Each match is 6 overs per side with a squad of 8 players. Standard box cricket rules apply: no LBW, Finals are 8 overs. Full rules sheet shared post-registration.",
  },
  {
    q: "How to contact the organizers?",
    a: "Call or WhatsApp: +91 6355 058 026. Email: mishranaitik213@gmail.com. WhatsApp group link shared after successful registration. Organizers available 9 AM – 9 PM daily.",
  },
];

const rules = [
  ["Team Size", "Maximum 8 players per squad"],
  ["Overs", "League matches — 6 overs per innings | Final — 8 overs per innings"],
  ["No Ball", "No ball as per CricHeroes rule... run is given"],
  ["Boundaries", "Wall hit and then wall = 4 runs | Direct wall = 6 runs"],
  ["Bowling", "1 bowler can bowl 2 overs in 6-over match; 2 bowlers can bowl 2 overs each in 8-over match"],
  ["Disputes", "Umpire decision is final and binding"],
  ["Dress Code", "Can wear any favourite jersey"],
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function App() {
  const [faqOpen, setFaqOpen] = useState(null);
  const countdown = useCountdown("2026-06-25T15:59:59");

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{styles}</style>

      {/* ── NAV ── */}
      <nav>
        <div className="nav-logo">⚡ Rakshak Group</div>
        <div className="nav-links">
          {[["Details", "details"], ["Prizes", "prizes"], ["Register", "register"], ["Gallery", "gallery"], ["FAQ", "faq"], ["Contact", "contact"]].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
          ))}
        </div>
        <button className="nav-cta" onClick={() => scrollTo("register")}>Register Now</button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        {/* Stadium backdrop SVG */}
        <svg className="hero-stadium" viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
          <ellipse cx="600" cy="380" rx="550" ry="100" fill="rgba(20,80,30,0.4)" />
          <ellipse cx="600" cy="370" rx="400" ry="70" fill="rgba(30,100,40,0.3)" />
          <rect x="565" y="250" width="70" height="160" rx="4" fill="rgba(180,160,100,0.3)" />
          <path d="M0,300 Q50,150 120,100 L120,400 L0,400 Z" fill="rgba(20,30,60,0.6)" />
          <path d="M20,300 Q70,160 130,110" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none"/>
          <path d="M40,310 Q80,170 135,120" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none"/>
          <path d="M1200,300 Q1150,150 1080,100 L1080,400 L1200,400 Z" fill="rgba(20,30,60,0.6)" />
          <line x1="80" y1="0" x2="90" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
          <rect x="60" y="0" width="60" height="20" rx="4" fill="rgba(255,220,60,0.5)"/>
          <line x1="1120" y1="0" x2="1110" y2="220" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
          <rect x="1080" y="0" width="60" height="20" rx="4" fill="rgba(255,220,60,0.5)"/>
          <line x1="320" y1="20" x2="330" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
          <rect x="305" y="10" width="50" height="16" rx="3" fill="rgba(255,220,60,0.4)"/>
          <line x1="880" y1="20" x2="870" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
          <rect x="845" y="10" width="50" height="16" rx="3" fill="rgba(255,220,60,0.4)"/>
          {Array.from({length: 60}, (_, i) => (
            <circle key={i} cx={20 + (i % 15) * 8} cy={110 + Math.floor(i/15)*20 + (i%3)*5} r="3" fill="rgba(255,255,255,0.15)" />
          ))}
          {Array.from({length: 60}, (_, i) => (
            <circle key={`r${i}`} cx={1080 + (i % 15) * 8} cy={110 + Math.floor(i/15)*20 + (i%3)*5} r="3" fill="rgba(255,255,255,0.15)" />
          ))}
          <ellipse cx="540" cy="335" rx="10" ry="14" fill="rgba(255,255,255,0.2)"/>
          <line x1="540" y1="349" x2="535" y2="380" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
          <line x1="540" y1="349" x2="545" y2="380" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
          <line x1="540" y1="360" x2="520" y2="375" stroke="rgba(255,255,255,0.25)" strokeWidth="3"/>
          <line x1="595" y1="300" x2="595" y2="370" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <line x1="605" y1="300" x2="605" y2="370" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <line x1="615" y1="300" x2="615" y2="370" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <line x1="590" y1="300" x2="620" y2="300" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
        </svg>

        {/* Floodlight rays */}
        <div style={{ position: "absolute", top: 0, left: "8%", width: 2, height: "60%", background: "linear-gradient(to bottom, rgba(240,190,58,0.25), transparent)", transform: "rotate(15deg)", transformOrigin: "top" }} />
        <div style={{ position: "absolute", top: 0, left: "10%", width: 1, height: "55%", background: "linear-gradient(to bottom, rgba(240,190,58,0.15), transparent)", transform: "rotate(25deg)", transformOrigin: "top" }} />
        <div style={{ position: "absolute", top: 0, right: "8%", width: 2, height: "60%", background: "linear-gradient(to bottom, rgba(240,190,58,0.25), transparent)", transform: "rotate(-15deg)", transformOrigin: "top" }} />
        <div style={{ position: "absolute", top: 0, right: "10%", width: 1, height: "55%", background: "linear-gradient(to bottom, rgba(240,190,58,0.15), transparent)", transform: "rotate(-25deg)", transformOrigin: "top" }} />

        <div className="badge-tournament">
          <span>🏏</span>
          <span>Official Tournament 2026</span>
        </div>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", margin: "1.5rem 0" }}>
          <img
            src="/rakshak-logo.png"
            alt="Rakshak Group Logo"
            style={{
              width: "130px", height: "130px", objectFit: "contain",
              borderRadius: "50%", background: "rgba(255,255,255,0.05)",
              padding: "8px", boxShadow: "0 8px 25px rgba(212,160,23,0.25)",
            }}
          />
        </div>

        <h1 className="hero-title">
          Rakshak Group<br />
          <span>Box Cricket</span><br />
          Tournament 2026
        </h1>

        <p className="hero-tagline">Battle for Glory. Play with Passion.</p>

        <div>
          <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.75rem", letterSpacing: "0.15em", color: C.slate, textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Registration closes in
          </p>
          <div className="countdown">
            {[["d", "Days"], ["h", "Hours"], ["m", "Minutes"], ["s", "Seconds"]].map(([k, lbl]) => (
              <div className="cd-block" key={k}>
                <div className="cd-num">{String(countdown[k]).padStart(2, "0")}</div>
                <div className="cd-label">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-primary" onClick={() => scrollTo("register")}>Register Your Team Now</button>
          <button className="btn-outline" onClick={() => scrollTo("details")}>View Details</button>
        </div>
      </section>

      {/* ── TOURNAMENT DETAILS ── */}
      <div className="section-full section-bg" id="details">
        <div className="section">
          <AnimSection>
            <p className="section-label">Tournament Info</p>
            <h2 className="section-title">Tournament <span>Details</span></h2>
            <div className="divider" />
          </AnimSection>

          <AnimSection style={{ transitionDelay: "0.1s" }}>
            <div className="details-grid">
              {[
                ["📅", "Date", "September 14–21, 2026"],
                ["📍", "Venue", "Rakshak Arena, Surat"],
                ["💰", "Entry Fee", "₹1,000 per team"],
                ["🎯", "Overs", "8 overs per side (final)"],
                ["👥", "Team Size", "8 players"],
                ["⚡", "Format", "League + Finals"],
                ["🕙", "Match Time", "Evening slots"],
              ].map(([icon, lbl, val]) => (
                <div className="glass-card detail-item" key={lbl}>
                  <div className="detail-icon">{icon}</div>
                  <div>
                    <div className="detail-label">{lbl}</div>
                    <div className="detail-val">{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimSection>

          {/* Rules & Regulations */}
          <AnimSection style={{ marginTop: "3rem", transitionDelay: "0.2s" }}>
            <p className="section-label" style={{ marginTop: "2rem" }}>Rules & Regulations</p>
            <h3 className="section-title" style={{ fontSize: "1.6rem" }}>Match <span>Rules</span></h3>
            <div className="divider" />
            <div className="glass-card" style={{ overflowX: "auto" }}>
              <table className="rules-table">
                <thead>
                  <tr>
                    <th style={{ width: 180 }}>Category</th>
                    <th>Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map(([cat, rule]) => (
                    <tr key={cat}>
                      <td style={{ color: C.gold, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>{cat}</td>
                      <td>{rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimSection>
        </div>
      </div>

      {/* ── PRIZES ── */}
      <div className="section-full section-bg2" id="prizes">
        <div className="section">
          <AnimSection style={{ textAlign: "center" }}>
            <p className="section-label">Awards & Rewards</p>
            <h2 className="section-title">Prize <span>Pool</span></h2>
            <div className="divider" style={{ margin: "1rem auto 2rem" }} />
            <p className="section-sub" style={{ margin: "0 auto 3rem" }}>Prize pool of ₹1,500</p>
          </AnimSection>
          <AnimSection style={{ transitionDelay: "0.15s" }}>
            <div className="prizes-grid">
              {[
                { icon: "🥇", name: "Winner", amount: "₹1500", sub: "+ Medal" },
                { icon: "🥈", name: "Runner-Up", amount: "", sub: "+ Medal" },
              ].map(p => (
                <div className="prize-card" key={p.name}>
                  <div className="prize-icon">{p.icon}</div>
                  <div className="prize-name">{p.name}</div>
                  {p.amount && <div className="prize-amount">{p.amount}</div>}
                  <div style={{ fontSize: "0.8rem", color: C.slate, marginTop: 6 }}>{p.sub}</div>
                </div>
              ))}
            </div>
          </AnimSection>
        </div>
      </div>

      {/* ── REGISTRATION ── */}
      <div className="section-full section-bg" id="register">
        <div className="section">
          <AnimSection>
            <p className="section-label">Join the Tournament</p>
            <h2 className="section-title">Register <span>Your Team</span></h2>
            <div className="divider" />
            
          </AnimSection>

          <AnimSection style={{ transitionDelay: "0.1s" }}>
            <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: "4rem" }}>🏏</div>
              <h3 style={{ color: C.gold, marginTop: "1rem" }}>Team Registration</h3>
              <p style={{ color: C.whiteDim, margin: "1rem 0 2rem" }}>
                Click the button below to register your team through our official Google Form.
              </p>
              <a
                href="https://forms.gle/9wLcLnSE8krxYcrW6"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button
                  className="btn-primary"
                  style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderRadius: "50px" }}
                >
                  📝 Register via Google Form
                </button>
              </a>
            </div>
          </AnimSection>
        </div>
      </div>

      {/* ── GALLERY ── */}
      <div className="section-full section-bg2" id="gallery">
        <div className="section">
          <AnimSection>
            <p className="section-label">Memories</p>
            <h2 className="section-title">Tournament <span>Gallery</span></h2>
            <div className="divider" />
            <p className="section-sub" style={{ marginBottom: "2rem" }}>Highlights from Rakshak Group Box Cricket Tournament 2024</p>
          </AnimSection>
          <AnimSection style={{ transitionDelay: "0.1s" }}>
            <div className="gallery-grid">
              {galleryItems.map((item, i) => (
                <div className="gallery-item" key={i} style={{ background: item.color }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
                    <span style={{ fontSize: "2.5rem" }}>{item.icon}</span>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", padding: "0 1rem" }}>{item.label}</span>
                  </div>
                  <div className="gallery-overlay">🔍</div>
                </div>
              ))}
            </div>
          </AnimSection>
        </div>
      </div>

      {/* ── SPONSORS ── */}
      <div className="section-full section-bg" id="sponsors">
        <div className="section" style={{ textAlign: "center" }}>
          <AnimSection>
            <p className="section-label">Our Partners</p>
            <h2 className="section-title">Sponsors & <span>Partners</span></h2>
            <div className="divider" style={{ margin: "1rem auto 2rem" }} />
          </AnimSection>
          <AnimSection style={{ transitionDelay: "0.1s" }}>
            <div className="sponsor-row">
              {["Title Sponsor: Rakshak Group", "Kit Partner: SportZone", "Ground: Surat Arena", "Media: CricketHub", "Food: TastyCorner", "Digital: TechPlay"].map(s => (
                <div className="sponsor-logo" key={s}>{s}</div>
              ))}
            </div>
            <p style={{ marginTop: "2rem", color: C.slate, fontSize: "0.9rem" }}>
              Interested in sponsoring?{" "}
              <button onClick={() => scrollTo("contact")} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
                Contact us →
              </button>
            </p>
          </AnimSection>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="section-full section-bg2" id="faq">
        <div className="section" style={{ maxWidth: 800 }}>
          <AnimSection>
            <p className="section-label">Got Questions?</p>
            <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
            <div className="divider" />
          </AnimSection>
          <AnimSection style={{ transitionDelay: "0.1s" }}>
            {faqs.map((f, i) => (
              <div className="faq-item" key={i}>
                <button className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span>{f.q}</span>
                  <span style={{ color: C.gold, fontSize: "1.2rem", flexShrink: 0 }}>{faqOpen === i ? "−" : "+"}</span>
                </button>
                {faqOpen === i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </AnimSection>
        </div>
      </div>

      {/* ── CONTACT ── */}
      <div className="section-full section-bg" id="contact">
        <div className="section">
          <AnimSection>
            <p className="section-label">Get in Touch</p>
            <h2 className="section-title">Contact <span>Organizers</span></h2>
            <div className="divider" />
          </AnimSection>

          <AnimSection style={{ transitionDelay: "0.1s" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>

              {/* Contact info card */}
              <div className="glass-card contact-card">
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: C.gold, marginBottom: "1rem", textTransform: "uppercase" }}>
                  Rakshak Group
                </div>
                {[
                  ["📞", <><strong>Phone:</strong> +91 6355 058 026 &nbsp;|&nbsp; +91 98700 05499</>],
                  ["💬", <><strong>WhatsApp:</strong> +91 98700 05499</>],
                  ["📧", <><strong>Email:</strong> mishranaitik213@gmail.com</>],
                  ["📍", <><strong>Address:</strong> Dindoli, Surat, Gujarat 394210</>],
                ].map(([icon, text], i) => (
                  <div className="contact-row" key={i}>
                    <span className="contact-icon">{icon}</span>
                    <span className="contact-text">{text}</span>
                  </div>
                ))}

                <a
                  href="https://wa.me/919870005499?text=Hi%2C%20I%20want%20to%20register%20for%20Rakshak%20Group%20Box%20Cricket%20Tournament%202026"
                  target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: "1.5rem", background: "#25d366", color: "#fff", border: "none", borderRadius: 6, padding: "0.75rem 1.5rem", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.06em", cursor: "pointer", textDecoration: "none" }}
                >
                  💬 Chat on WhatsApp
                </a>

                <div className="social-links">
                  {[["📘", "Facebook"], ["📸", "Instagram"], ["🐦", "Twitter"], ["▶️", "YouTube"]].map(([icon, name]) => (
                    <div className="social-btn" key={name} title={name}>{icon}</div>
                  ))}
                </div>
              </div>

              {/* Why Participate card */}
              <div className="glass-card" style={{ padding: "2rem", minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: C.gold, marginBottom: "1.5rem", textAlign: "center" }}>
                  🏆 Why Participate?
                </div>
                <div style={{ color: C.white, fontSize: "1rem", lineHeight: "2.2" }}>
                  <div>⭐ Exciting Cash Prizes</div>
                  <div>⭐ Professional Match Management</div>
                  <div>⭐ Fair Play & Certified Umpires</div>
                  <div>⭐ Live Photography & Social Media Coverage</div>
                  <div>⭐ Fun, Competition & Team Spirit</div>
                </div>
                <div style={{ marginTop: "1.8rem", textAlign: "center", color: C.slate, fontSize: "0.9rem", fontStyle: "italic" }}>
                  "Play with passion, compete with pride, and create unforgettable memories!"
                </div>
              </div>

            </div>
          </AnimSection>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-grid">
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: C.gold, marginBottom: "0.5rem", textTransform: "uppercase" }}>⚡ Rakshak Group</div>
            <p style={{ color: C.slate, fontSize: "0.88rem", lineHeight: 1.7 }}>Organizing world-class box cricket tournaments in Gujarat since 2019.</p>
          </div>
          <div>
            <div className="footer-title">Quick Links</div>
            <ul className="footer-links">
              {[["Tournament Details", "details"], ["Prize Pool", "prizes"], ["Register", "register"], ["Gallery", "gallery"], ["FAQ", "faq"]].map(([label, id]) => (
                <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-title">Policies</div>
            <ul className="footer-links">
              {["Terms & Conditions", "Privacy Policy", "Refund Policy", "Code of Conduct"].map(item => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-title">Contact</div>
            <ul className="footer-links">
              <li><a href="tel:+919870005499">+91 98700 05499</a></li>
              <li><a href="mailto:mishranaitik213@gmail.com">mishranaitik213@gmail.com</a></li>
              <li><a href="#">Dindoli, Surat, Gujarat</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 Rakshak Group. All rights reserved.</span>
          <span className="footer-copy">Designed for Rakshak Group Box Cricket Tournament 2026</span>
        </div>
      </footer>
    </>
  );
}
