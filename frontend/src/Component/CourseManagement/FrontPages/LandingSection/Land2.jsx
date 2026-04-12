import { useState, useEffect, useRef } from "react";

// --- Animated counter hook ---
function useCounter(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

// --- Floating card data ---
const FLOATING_CARDS = [
  {
    id: 1,
    style: "top-[12%] left-[3%]",
    delay: "0s",
    duration: "6s",
    content: {
      avatar: "AK",
      avatarColor: "#ff4628",
      name: "Alex Kim",
      action: "Just enrolled in",
      course: "Python Mastery",
      time: "2m ago",
    },
  },
  {
    id: 2,
    style: "bottom-[20%] left-[2%]",
    delay: "1.5s",
    duration: "7s",
    content: {
      type: "achievement",
      icon: "★",
      title: "Certificate Earned",
      sub: "Data Science Pro",
      by: "Sarah M.",
    },
  },
  {
    id: 3,
    style: "top-[8%] right-[2%]",
    delay: "0.8s",
    duration: "5.5s",
    content: {
      type: "rating",
      stars: 5,
      text: "Incredible platform!",
      by: "James T.",
    },
  },
  {
    id: 4,
    style: "bottom-[25%] right-[2%]",
    delay: "2s",
    duration: "6.5s",
    content: {
      type: "progress",
      course: "React Advanced",
      percent: 74,
      label: "In Progress",
    },
  },
];

// --- Stat items ---
const STATS = [
  { label: "Active Learners", value: 52000, suffix: "+", prefix: "" },
  { label: "Expert Courses", value: 1200, suffix: "+", prefix: "" },
  { label: "Completion Rate", value: 94, suffix: "%", prefix: "" },
  { label: "Avg. Rating", value: 4.9, suffix: "", prefix: "", isDecimal: true },
];

// --- Trust logos (text-based, clean) ---
const TRUSTED_BY = ["Google", "Microsoft", "Stripe", "Notion", "Figma", "Vercel"];

// --- Category pills ---
const CATEGORIES = [
  "Data Science", "Web Development", "UI/UX Design",
  "Machine Learning", "Business", "Cloud Computing",
];

export default function StudlyBanner() {
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchText, setSearchText] = useState("");
  const heroRef = useRef(null);

  const s1 = useCounter(52000, 2200, visible);
  const s2 = useCounter(1200, 1800, visible);
  const s3 = useCounter(94, 1600, visible);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Rotate category pill
  useEffect(() => {
    const t = setInterval(() => {
      setActiveCategory((p) => (p + 1) % CATEGORIES.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full font-sans overflow-hidden bg-[#0a0a0a]" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Playfair+Display:wght@700;800&display=swap');

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pillSlide {
          0%, 100% { opacity: 1; transform: translateY(0); }
          45% { opacity: 0; transform: translateY(-8px); }
          55% { opacity: 0; transform: translateY(8px); }
        }
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(255,70,40,0.15); }
          50% { box-shadow: 0 0 80px rgba(255,70,40,0.35); }
        }
        @keyframes barFill {
          from { width: 0%; }
          to { width: var(--target-width); }
        }
        .animate-float { animation: floatY var(--dur, 6s) ease-in-out infinite; animation-delay: var(--del, 0s); }
        .animate-fade-up { animation: fadeSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fade-left { animation: fadeSlideLeft 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fade-right { animation: fadeSlideRight 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #ff4628 0%, #ff8c6b 40%, #fff 60%, #ff4628 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.5s linear infinite;
        }
        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
        }
        .orange-glow { animation: glowPulse 3s ease-in-out infinite; }
        .search-input:focus { outline: none; }
        .progress-bar {
          animation: barFill 1.8s cubic-bezier(0.16,1,0.3,1) forwards;
          animation-delay: 1s;
        }
      `}</style>

      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-6 lg:px-16 pt-10 pb-16 overflow-hidden">

        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }}
        />

        {/* Background glow blobs */}
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,70,40,0.12) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-[0%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,70,40,0.07) 0%, transparent 70%)" }}
        />

        {/* Floating ambient ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.04] pointer-events-none" />

        {/* Floating UX Cards */}
        {FLOATING_CARDS.map((card) => (
          <div
            key={card.id}
            className={`absolute ${card.style} animate-float hidden xl:block z-10`}
            style={{ "--dur": card.duration, "--del": card.delay }}
          >
            {!card.content.type && (
              // Enrollment notification
              <div className="glass-card rounded-2xl p-3 w-56 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: card.content.avatarColor }}>
                    {card.content.avatar}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold leading-tight">{card.content.name}</p>
                    <p className="text-white/40 text-[10px]">{card.content.action}</p>
                    <p className="text-[#ff4628] text-[11px] font-medium">{card.content.course}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: "pulseDot 2s ease-in-out infinite" }} />
                  <span className="text-white/30 text-[10px]">{card.content.time}</span>
                </div>
              </div>
            )}

            {card.content.type === "achievement" && (
              <div className="glass-card rounded-2xl p-3 w-52 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">
                    {card.content.icon}
                  </div>
                  <div>
                    <p className="text-white text-[11px] font-semibold">{card.content.title}</p>
                    <p className="text-[#ff4628] text-[10px]">{card.content.sub}</p>
                  </div>
                </div>
                <p className="text-white/30 text-[10px]">Earned by {card.content.by}</p>
              </div>
            )}

            {card.content.type === "rating" && (
              <div className="glass-card rounded-2xl p-3 w-48 shadow-xl">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-xs">★</span>
                  ))}
                </div>
                <p className="text-white text-[11px] font-medium mb-1">"{card.content.text}"</p>
                <p className="text-white/30 text-[10px]">— {card.content.by}</p>
              </div>
            )}

            {card.content.type === "progress" && (
              <div className="glass-card rounded-2xl p-3 w-52 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-white text-[11px] font-semibold">{card.content.course}</p>
                  <span className="text-[10px] text-[#ff4628] bg-[#ff4628]/10 px-1.5 py-0.5 rounded-full">{card.content.label}</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#ff4628] to-[#ff8c6b] rounded-full progress-bar"
                    style={{ "--target-width": `${card.content.percent}%`, width: 0 }} />
                </div>
                <p className="text-white/30 text-[10px] mt-1">{card.content.percent}% complete</p>
              </div>
            )}
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">

          {/* Eyebrow badge */}
          <div className={`inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
            style={{ animationDelay: "0s" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"
              style={{ animation: "pulseDot 2s ease-in-out infinite" }} />
            <span className="text-white/60 text-xs font-medium tracking-widest uppercase">The Future of Learning is Here</span>
          </div>

          {/* Main heading */}
          <h1
            className={`text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ fontFamily: "'Playfair Display', serif", animationDelay: "0.1s" }}
          >
            <span className="text-white">Master Skills</span><br />
            <span className="shimmer-text">That Matter.</span>
          </h1>

          {/* Sub heading */}
          <p className={`text-white/50 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10 font-light transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            Join thousands of professionals advancing their careers with expert-led courses, real-world projects, and verified certificates.
          </p>

          {/* Search bar */}
          <div className={`relative max-w-lg mx-auto mb-6 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="glass-card rounded-2xl p-1.5 flex items-center gap-2 orange-glow">
              <div className="flex-1 flex items-center gap-3 px-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  className="search-input bg-transparent text-white placeholder-white/20 text-sm flex-1 py-2"
                  placeholder="Search courses, skills, instructors..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <button className="bg-[#ff4628] hover:bg-[#e03b20] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap">
                Explore Now
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(i)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-300 ${
                  activeCategory === i
                    ? "bg-[#ff4628] border-[#ff4628] text-white"
                    : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <button className="group bg-[#ff4628] hover:bg-[#e03b20] text-white font-semibold px-8 py-4 rounded-2xl text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[#ff4628]/30 hover:shadow-2xl flex items-center gap-2">
              Start Learning Free
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button className="group glass-card hover:bg-white/[0.07] text-white/80 hover:text-white font-medium px-8 py-4 rounded-2xl text-sm transition-all duration-300 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ff4628]/20 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff4628">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className={`relative z-10 max-w-2xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-px transition-all duration-700 delay-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[
            { label: "Active Learners", value: `${(s1 / 1000).toFixed(0)}K+` },
            { label: "Expert Courses", value: `${s2.toLocaleString()}+` },
            { label: "Completion Rate", value: `${s3}%` },
            { label: "Avg. Rating", value: "4.9 / 5" },
          ].map((stat, i) => (
            <div key={i} className="glass-card text-center py-5 px-4 first:rounded-l-2xl last:rounded-r-2xl">
              <p className="text-white text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-white/30 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TRUSTED BY MARQUEE ===== */}
      <section className="py-10 border-t border-b border-white/[0.05] overflow-hidden">
        <p className="text-white/20 text-xs uppercase tracking-widest text-center mb-6 font-medium">Trusted by teams at</p>
        <div className="relative flex gap-0 overflow-hidden">
          <div className="flex gap-16 shrink-0" style={{ animation: "scrollMarquee 18s linear infinite" }}>
            {[...TRUSTED_BY, ...TRUSTED_BY].map((brand, i) => (
              <span key={i} className="text-white/20 hover:text-white/50 text-sm font-semibold tracking-widest uppercase transition-colors duration-300 whitespace-nowrap cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="px-6 lg:px-16 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#ff4628] text-xs uppercase tracking-widest font-semibold">Why Studly</span>
          <h2 className="text-white text-4xl md:text-5xl font-bold mt-3 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Built for Real Progress
          </h2>
          <p className="text-white/40 text-base max-w-xl mx-auto font-light">
            Every feature is designed to reduce friction and maximize how fast you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff4628" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              ),
              title: "Expert Instructors",
              desc: "Learn from industry veterans with 10+ years of real-world experience. Not theory — craft.",
              tag: "1,200+ courses",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff4628" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              ),
              title: "Learn at Your Pace",
              desc: "Mobile, tablet, desktop — your progress syncs everywhere. Start a lesson on your commute, finish at home.",
              tag: "Offline access",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff4628" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              ),
              title: "Verified Certificates",
              desc: "Earn LinkedIn-shareable certificates recognized by top tech companies and Fortune 500 firms.",
              tag: "Industry-recognized",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff4628" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              ),
              title: "Peer Community",
              desc: "Collaborate, discuss, and grow in cohort-based learning circles with peers worldwide.",
              tag: "50K+ members",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff4628" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              ),
              title: "Hands-on Projects",
              desc: "Every course includes real-world projects you can add to your portfolio. No fluff.",
              tag: "Portfolio-ready",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff4628" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 3h18v18H3z"/><path d="M3 9h18M9 21V9"/>
                </svg>
              ),
              title: "Smart Dashboard",
              desc: "Track every goal, streak, and milestone. Your personalized learning analytics keep you accountable.",
              tag: "AI-powered",
            },
          ].map((feat, i) => (
            <div key={i}
              className="glass-card rounded-2xl p-6 group hover:border-[#ff4628]/30 transition-all duration-300 hover:-translate-y-1 cursor-default">
              <div className="w-11 h-11 rounded-xl bg-[#ff4628]/10 flex items-center justify-center mb-4 group-hover:bg-[#ff4628]/20 transition-colors duration-300">
                {feat.icon}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#ff4628]/70 font-semibold">{feat.tag}</span>
              <h3 className="text-white font-semibold text-base mt-1 mb-2">{feat.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed font-light">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SOCIAL PROOF / TESTIMONIAL BAND ===== */}
      <section className="px-6 lg:px-16 py-20 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Big quote */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-6 right-8 text-[120px] leading-none text-white/[0.03] font-serif select-none">"</div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff4628] to-[#ff8c6b] flex items-center justify-center text-white font-bold text-sm">RP</div>
              <div>
                <p className="text-white font-semibold text-sm">Riya Patel</p>
                <p className="text-white/30 text-xs">Senior Data Analyst at Stripe</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
              </div>
            </div>
            <p className="text-white/60 text-base leading-relaxed font-light">
              "Studly genuinely transformed my career trajectory. Within 3 months of completing the Data Science track, I landed a role at Stripe. The project-based curriculum meant I had a real portfolio — not just a certificate."
            </p>
          </div>

          {/* Mini stats card */}
          <div className="flex flex-col gap-4">
            <div className="glass-card rounded-2xl p-6 flex-1">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Learning Outcomes</p>
              {[
                { label: "Got promoted / hired", pct: 87 },
                { label: "Increased salary", pct: 73 },
                { label: "Changed careers", pct: 61 },
              ].map((item, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-white/50 text-xs">{item.label}</span>
                    <span className="text-white text-xs font-semibold">{item.pct}%</span>
                  </div>
                  <div className="h-1 bg-white/[0.07] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff4628] to-[#ff8c6b] rounded-full progress-bar"
                      style={{ "--target-width": `${item.pct}%`, width: 0 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-white">4.9<span className="text-white/20 text-lg">/5</span></p>
              <div className="flex justify-center gap-0.5 my-1">
                {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-base">★</span>)}
              </div>
              <p className="text-white/30 text-xs">from 18,400+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BOTTOM ===== */}
      <section className="px-6 lg:px-16 py-24">
        <div className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-12 lg:p-16 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(255,70,40,0.08) 0%, transparent 70%)" }} />

          <span className="text-[#ff4628] text-xs uppercase tracking-widest font-semibold">Get Started Today</span>
          <h2 className="text-white text-4xl md:text-5xl font-bold mt-4 mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Next Skill is<br />One Click Away
          </h2>
          <p className="text-white/40 text-base mb-10 font-light max-w-md mx-auto">
            No credit card required. Instant access to 200+ free lessons to get you started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#ff4628] hover:bg-[#e03b20] text-white font-semibold px-10 py-4 rounded-2xl text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-[#ff4628]/20">
              Create Free Account
            </button>
            <button className="glass-card hover:bg-white/[0.07] text-white/70 hover:text-white font-medium px-10 py-4 rounded-2xl text-sm transition-all duration-300">
              Browse Courses
            </button>
          </div>
          <p className="text-white/20 text-xs mt-6">
            No commitment. Cancel anytime. Join 52,000+ learners.
          </p>
        </div>
      </section>

    </div>
  );
}