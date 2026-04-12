import { useState, useEffect, useRef } from "react";
import wl1 from '../../../../assets/wl8.webp'
import CategorySection from "./CategorySection";
import EachCategory from "./EachCategory";
import DisplayCoursesSection from "./DisplayCoursesSection";
import CardsSection from './CardsSection'
 import FeaturesSection from './FeaturesSection'
 import AppleSection from "./AppleSection";
 import Banner from "./Banner";
 import SpeechBanner from "../../SpeechSection/SpeechBanner";
import Paralel from "./Paralel";
import Pencil from "./Pencil";
import Pencil2 from "./Pencil2";
import Slider from "./Slider";
import CTASection from "./CtaSection";
// ─── Animation Hook ───────────────────────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.15, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Animated wrapper components ─────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transition: `opacity 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SlideIn({ children, delay = 0, from = "left", className = "" }) {
  const [ref, inView] = useInView();
  const offset = from === "left" ? "-40px" : "40px";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : `translateX(${offset})`,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🎓", title: "AI-Powered Learning", desc: "Personalized learning paths crafted by AI that adapt to your pace and style." },
  { icon: "📊", title: "Real-time Analytics", desc: "Track every learner's progress with detailed dashboards and actionable insights." },
  { icon: "🤝", title: "Live Collaboration", desc: "Interactive classrooms, group projects, and peer reviews — all in one place." },
  { icon: "🏆", title: "Gamified Engagement", desc: "Badges, leaderboards, and streaks to keep learners motivated every day." },
  { icon: "📱", title: "Learn Anywhere", desc: "Fully responsive — desktop, tablet, mobile. Learning never stops." },
  { icon: "🔗", title: "Seamless Integrations", desc: "Zoom, Slack, Google Workspace, and 50+ tools you already use." },
];

const LOGOS = ["Stanford", "MIT OpenCourseWare", "Coursera", "Udemy", "edX", "Khan Academy"];

const PLANS = [
  {
    name: "Starter", price: "$0", period: "forever",
    desc: "Perfect for individuals and small teams getting started.",
    features: ["Up to 50 learners", "5 courses", "Basic analytics", "Community support"],
    cta: "Get started free", highlight: false,
  },
  {
    name: "Growth", price: "$49", period: "per month",
    desc: "For growing teams that need more power and flexibility.",
    features: ["Up to 500 learners", "Unlimited courses", "Advanced analytics", "Priority support", "Custom branding", "AI recommendations"],
    cta: "Start free trial", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "tailored",
    desc: "For large organizations with complex requirements.",
    features: ["Unlimited learners", "Dedicated CSM", "SSO & advanced security", "SLA guarantee", "Custom integrations", "White-labeling"],
    cta: "Talk to sales", highlight: false,
  },
];

const STATS = [
  { value: "2M+", label: "Active learners" },
  { value: "98%", label: "Satisfaction rate" },
  { value: "150+", label: "Countries reached" },
  { value: "10x", label: "Faster course creation" },
];

const TESTIMONIALS = [
  { quote: "Studly transformed how we onboard new engineers. Completion rates jumped from 40% to 94% in one quarter.", name: "Sarah Chen", role: "Head of L&D, TechCorp", avatar: "SC", color: "from-violet-500 to-purple-600" },
  { quote: "The AI-driven learning paths are a game changer. Our team actually looks forward to training now.", name: "Marcus Rivera", role: "CTO, Momentum Labs", avatar: "MR", color: "from-blue-500 to-cyan-500" },
  { quote: "We replaced three separate tools with Studly. It's faster, smarter, and our learners love it.", name: "Priya Nair", role: "VP People, Scalepath", avatar: "PN", color: "from-pink-500 to-rose-500" },
];

const TAB_ITEMS = ["Course Builder", "Analytics", "Live Classes", "Certifications"];

// ─── AnimatedNumber ────────────────────────────────────────────────────────────
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
          const suffix = value.replace(/[0-9.]/g, "");
          let start = 0;
          const duration = 1500;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * numeric;
            setDisplay((current % 1 === 0 ? Math.floor(current) : current.toFixed(0)) + suffix);
            if (progress < 1) requestAnimationFrame(step);
            else setDisplay(value);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function StudlyLanding() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger hero entrance after mount
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Global smooth scroll style
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = ""; };
  }, []);

  return (
    <div className="font-sans bg-white text-gray-900 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-32 overflow-hidden bg-[#f8f7f4]">
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-24 -left-32 w-[500px] h-[500px] rounded-full bg-violet-200 opacity-30 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-200 opacity-25 blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-16px)",
              transition: "opacity 0.6s ease 0ms, transform 0.6s ease 0ms",
            }}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-8 shadow-sm"
          >
            
            Now with AI-Powered Course Generation
          </div>

          {/* Headline */}
          <h1
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 100ms, transform 0.7s ease 100ms",
            }}
            className="text-[clamp(2.6rem,7vw,5.5rem)] font-black leading-[1.05] tracking-tight text-gray-950 mb-6"
          >
           <span className="text-[#615d90]">Make</span> learning your{" "}
            <span className="relative inline-block">
             <span
  className="relative z-10 bg-clip-text text-transparent"
  style={{
    backgroundImage:
      "linear-gradient(97deg, #0096ff, #bb64ff 42%, #f2416b 74%, #eb7500)"
  }}
>
  growth engine
</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 9 Q75 2 150 8 Q225 14 298 5" stroke="url(#ul)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="ul" x1="0" y1="0" x2="1" y2="0">
                    <stop stopColor="#7c3aed" /><stop offset="1" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 200ms, transform 0.7s ease 200ms",
            }}
            className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Build courses. Track learners. Drive real outcomes. Studly is the all-in-one LMS that turns knowledge into results — fast.
          </p>

          {/* CTAs */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 350ms, transform 0.7s ease 350ms",
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <a href="/login" className="w-full sm:w-auto px-8 py-4 bg-gray-950 text-white text-base font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/20">
              Get started free
            </a>
            <a href="/allcourses" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 text-base font-semibold rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200">
              Browse Courses
            </a>
          </div>
          <p
            style={{
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.7s ease 450ms",
            }}
            className="text-sm text-gray-400"
          >
            No credit card required · Free forever plan
          </p>
        </div>

        {/* Hero mockup */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
            transition: "opacity 0.9s ease 500ms, transform 0.9s ease 500ms",
          }}
          className="relative z-10 mt-16 w-full max-w-7xl mx-auto"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-900/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 font-mono">
                app.studly.io/dashboard
              </div>
            </div>
            {/* Replace with your actual image: <img src={wl1} alt="Dashboard" /> */}
            <img src={wl1} ></img>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section className="py-14 border-y border-gray-100 bg-white">
        <FadeIn>
          <p className="text-center text-sm text-gray-400 font-medium uppercase tracking-widest mb-8">
            Trusted by teams at
          </p>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 opacity-50">
            {LOGOS.map((l) => (
              <span key={l} className="text-lg font-bold text-gray-700 tracking-tight">{l}</span>
            ))}
          </div>
        </FadeIn>
      </section>
      <CategorySection/>
      <EachCategory />
 <DisplayCoursesSection/>
      {/* ── STATS ── */}
      <section className="py-24 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <FadeUp key={s.label} delay={i * 100}>
                <p className="text-5xl font-black mb-2 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                  <AnimatedNumber value={s.value} />
                </p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
      <CardsSection/>
      <SpeechBanner/>
         <Banner />
          
      <FeaturesSection/>
      <AppleSection />
      <Pencil/>
      <Pencil2/>
      <Slider/>
      <CTASection/>
    
       
      

    
  

      

      

      {/* Global keyframe for tab transitions */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}