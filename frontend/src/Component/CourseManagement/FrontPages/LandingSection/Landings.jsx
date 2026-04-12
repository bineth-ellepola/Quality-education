import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import mc from '../../../../assets/mc.png'
import sliit from '../../../../assets/sliit.png'
import nsbm from '../../../../assets/nsb.png'
import horizon from '../../../../assets/horizon.png'
import iit from '../../../../assets/iit.png'
import background from '../../../../assets/bg5.jpg'
import ui from '../../../../assets/ui.jpg'
import dl from '../../../../assets/dl.jpg'
import st from '../../../../assets/st.png'
import pm from '../../../../assets/pm.avif'
import cn from '../../../../assets/cn.jpg'
import CourseFetch from '../LandingSection/CourseFetch'
import HomeLanding from './HomeLanding';
import Land2 from './Land2';
import {
  ArrowRight, Star, ChevronLeft, ChevronRight,
  Award, Globe, Users, CheckCircle2,
  TrendingUp, Briefcase, BookOpen, Clock,
  Zap, GraduationCap, Search
} from 'lucide-react';

 
const heroSlides = [
  {
    id: 1,
    panels: [
      {
        bg: '#e8f4f0',
        isDark: false,
        logo: 'plus',
        headline: 'Grow your skills.\nShape your career.',
        body: 'Build in-demand skills with expert-led programs from Google, Microsoft, IBM, and more.',
        cta: 'Save on Studly Plus',
        badge: { lines: ['Save', '40%'], bg: '#ff4628' },
       partnerLogos: [
  { img: nsbm },
  { img: sliit },
  { img: horizon },
  { img: iit },
],
        artColors: ['#4ade80', '#facc15', '#f472b6', '#60a5fa', '#a78bfa'],
      },
      {
        bg: '#0056d2',
        isDark: true,
        logo: 'business',
        headline: 'Train your team in\nskills that scale',
        body: 'Join 3,700+ teams building skills with Studly for Teams worldwide.',
        cta: 'Save 40% on Teams',
        badge: { lines: ['40% off', 'team training', '*Up to 125 licences'], bg: '#c026d3' },
        img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=500&fit=crop',
        artColors: ['#34d399', '#a78bfa', '#38bdf8', '#f472b6', '#fbbf24'],
      },
    ],
  },
  {
    id: 2,
    panels: [
      {
        bg: '#f0f4ff',
        isDark: false,
        logo: null,
        headline: 'Start your journey\nwith top universities',
        body: 'Access 7,000+ courses from Stanford, Yale, MIT — free to start.',
        cta: 'Explore Courses',
        badge: null,
        artColors: ['#818cf8', '#facc15', '#f472b6', '#60a5fa', '#c084fc'],
      },
      {
        bg: '#1e3a5f',
        isDark: true,
        logo: null,
        headline: 'Earn a degree\n100% online',
        body: "Accredited bachelor's and master's degrees designed for working professionals.",
        cta: 'See all degrees',
        badge: null,
        img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=500&fit=crop',
        artColors: ['#34d399', '#a78bfa', '#38bdf8', '#f472b6', '#fbbf24'],
      },
    ],
  },
  {
    id: 3,
    panels: [
      {
        bg: '#fef3e2',
        isDark: false,
        logo: null,
        headline: 'Master AI & Machine\nLearning in 2026',
        body: 'Learn from Andrew Ng and Stanford faculty. Join 4M+ learners worldwide.',
        cta: 'Start for Free',
        badge: { lines: ['New', '2026'], bg: '#f59e0b' },
        artColors: ['#fb923c', '#fbbf24', '#f472b6', '#4ade80', '#60a5fa'],
      },
      {
        bg: '#14532d',
        isDark: true,
        logo: null,
        headline: 'Google Career\nCertificates',
        body: 'Job-ready skills in Data, UX Design, IT Support, and more in 6 months.',
        cta: 'View Certificates',
        badge: null,
        img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&fit=crop',
        artColors: ['#4ade80', '#34d399', '#a3e635', '#86efac', '#bbf7d0'],
      },
    ],
  },
];
const partnerLogos = [
  { 
    name: 'Google', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_logo.svg', 
    isIcon: true 
  },
  { 
    name: 'SLIIT', 
    logo: sliit, 
    isIcon: true 
  },
  { 
    name: 'Microsoft', 
    logo: mc, 
    isIcon: true 
  },
  { 
    name: 'University of Illinois', 
    logo: ui,
    isIcon: false 
  },
  { 
    name: 'OpenAI', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', 
    isIcon: true 
  },
  { 
    name: 'Anthropic', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg', 
    isIcon: true 
  },
  { 
    name: 'DeepLearning.AI', 
    logo: dl, 
    isIcon: true 
  },
  { 
    name: 'Stanford University', 
    logo: st, 
    isIcon: false 
  },
  { 
    name: 'University of Pennsylvania', 
    logo: pm , 
    isIcon: false 
  },
  { 
    name: 'University of Michigan', 
    logo: cn, 
    isIcon: false 
  },
];
const trendingCourses = [
  { id:1, title:'Google Data Analytics',           partner:'Google',                  pColor:'#4285F4', pLogo:'G',   rating:4.8, reviews:'120,234', img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&fit=crop', type:'Professional Certificate', skills:['Spreadsheets','SQL','Data Viz'] },
  { id:2, title:'Python for Everybody',             partner:'University of Michigan',  pColor:'#00274c', pLogo:'UM',  rating:4.9, reviews:'253,890', img:'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&fit=crop', type:'Specialization',           skills:['Python','JSON','Web Scraping'] },
  { id:3, title:'Machine Learning Specialization',  partner:'Stanford University',     pColor:'#8C1515', pLogo:'SU',  rating:4.9, reviews:'309,445', img:'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&fit=crop', type:'Specialization',           skills:['Supervised ML','Neural Nets'] },
  { id:4, title:'Financial Markets',                partner:'Yale University',          pColor:'#00356b', pLogo:'Y',   rating:4.8, reviews:'87,231',  img:'https://images.unsplash.com/photo-1611974714652-a979269d90ec?q=80&w=400&fit=crop', type:'Course',                   skills:['Finance','Risk Management'] },
  { id:5, title:'IBM Full Stack Developer',          partner:'IBM',                     pColor:'#1F70C1', pLogo:'IBM', rating:4.7, reviews:'47,120',  img:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&fit=crop', type:'Professional Certificate', skills:['React','Node.js','Docker'] },
  { id:6, title:'UX Design Certificate',             partner:'Google',                  pColor:'#4285F4', pLogo:'G',   rating:4.8, reviews:'99,872',  img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=400&fit=crop', type:'Professional Certificate', skills:['Figma','Prototyping'] },
];

const degrees = [
  { title:'Master of Science in Data Science',       school:'University of Colorado Boulder', duration:'2 years',   tuition:'$21,000', accentColor:'#CFB87C', img:'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?q=80&w=600&fit=crop' },
  { title:"Bachelor's in Computer Science",          school:'University of London',           duration:'3–6 years', tuition:'$18,000', accentColor:'#862633', img:'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&fit=crop' },
  { title:'MBA with Business Analytics',             school:'Illinois Institute of Technology',duration:'2 years',  tuition:'$24,000', accentColor:'#e84a27', img:'https://images.unsplash.com/photo-1462826303086-329426d1aef5?q=80&w=600&fit=crop' },
  { title:'MS in Cybersecurity',                     school:'University of Maryland',         duration:'1.5 years', tuition:'$22,000', accentColor:'#e21833', img:'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=600&fit=crop' },
];

const testimonials = [
  { name:'Sarah Chen',     role:'Data Analyst at Google',        img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', text:'Studly completely transformed my career. Within 6 months of completing the Google Data Analytics certificate, I landed my dream job.', course:'Google Data Analytics' },
  { name:'Marcus Williams',role:'Software Engineer at Meta',      img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', text:'The quality of instruction rivals any top university. I went from zero coding knowledge to a full-stack engineer in under a year.',  course:'IBM Full Stack Developer' },
  { name:'Priya Nair',     role:'ML Engineer at Amazon',         img:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', text:"Andrew Ng's Machine Learning course was the best investment I've made. Rigorous, practical, and immediately applicable.",               course:'ML Specialization' },
];

/* ═══════════════════════════════════════════════════════
   DECORATIVE FLORAL SVG
═══════════════════════════════════════════════════════ */
function FloralBlobs({ colors }) {
  const [c0,c1,c2,c3,c4] = colors;
  return (
    <svg viewBox="0 0 300 240" className="absolute right-0 top-0 h-full w-auto pointer-events-none select-none" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">
      <ellipse cx="210" cy="55"  rx="62" ry="78"  fill={c0} opacity="0.82" transform="rotate(-22 210 55)" />
      <ellipse cx="255" cy="135" rx="44" ry="60"  fill={c1} opacity="0.78" transform="rotate(14 255 135)" />
      <ellipse cx="185" cy="160" rx="38" ry="50"  fill={c2} opacity="0.72" transform="rotate(-38 185 160)" />
      <circle  cx="158" cy="82"  r="24"            fill={c3} opacity="0.68" />
      <ellipse cx="230" cy="200" rx="32" ry="22"  fill={c4} opacity="0.62" transform="rotate(28 230 200)" />
      <circle  cx="200" cy="36"  r="15"            fill={c1} opacity="0.55" />
      <circle  cx="265" cy="92"  r="9"             fill={c2} opacity="0.48" />
    </svg>
  );
}

function PanelCard({ panel }) {
  const { bg, isDark, logo, headline, body, cta, badge, partnerLogos: pLogos, artColors, img } = panel;
  const text    = isDark ? '#ffffff' : '#1e293b';
  const subText = isDark ? 'rgba(255,255,255,0.82)' : '#475569';

  return (
    <div 
      className="relative overflow-hidden rounded-[2rem] flex flex-col justify-between p-8 sm:p-10 transition-transform duration-300 hover:shadow-lg" 
      style={{ background: bg, minHeight: '340px' }}
    >
      <FloralBlobs colors={artColors} />

      {img && (
        <div className="absolute inset-0 pointer-events-none">
          <img src={img} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${bg}ee, ${bg}66)` }} />
        </div>
      )}

      <div className="relative z-10 h-full flex flex-col justify-center">
        {/* Logo label */}
        {logo === 'plus' && (
          <div className="flex items-center gap-2 mb-6">
            <span className="font-black text-[#0056d2] text-lg italic tracking-tighter">studly</span>
            <span className="bg-[#0056d2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">PLUS</span>
          </div>
        )}
        {logo === 'business' && (
          <div className="flex items-center gap-2 mb-6">
            <span className="font-black text-white text-lg italic tracking-tighter">studly</span>
            <span className="text-white/80 text-sm font-semibold">for business</span>
          </div>
        )}

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-black leading-[1.15] mb-4" style={{ color: text }}>
          {headline.split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </h2>

        {/* Body */}
        <p className="text-[15px] font-medium leading-relaxed mb-8 max-w-[280px]" style={{ color: subText }}>
          {body}
        </p>

        {/* ✅ UPDATED: Partner logos using PNG */}
        {pLogos && (
          <div className="flex items-center gap-2.5 mb-8">
            {pLogos.map((pl, i) => (
              <div 
                key={i} 
                className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden"
              >
                <img
                  src={pl.img}
                  alt="logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div>
          <button
            className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-xl transition-all hover:brightness-110 active:scale-95 shadow-md"
            style={isDark
              ? { border: '2px solid rgba(255,255,255,0.8)', color: '#fff', background: 'transparent' }
              : { background: '#ff4628', color: '#fff', border: 'none' }
            }
          >
            {cta} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Badge */}
      {badge && (
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 z-20 h-[90px] w-[90px] rounded-full flex flex-col items-center justify-center text-center shadow-2xl select-none rotate-6"
          style={{ background: badge.bg }}
        >
          {badge.lines.map((l, i) => (
            <span key={i} className="text-white font-black leading-tight px-1" style={{ fontSize: i === 1 ? '22px' : '11px' }}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}
 
function HeroBanner() {
  const [cur, setCur]       = useState(0);
  const [busy, setBusy]     = useState(false);
  const timer               = useRef(null);
  const total               = heroSlides.length;

  const goTo = useCallback((idx) => {
    if (busy || idx === cur) return;
    setBusy(true);
    setTimeout(() => { setCur(idx); setBusy(false); }, 360);
  }, [busy, cur]);

  const next = useCallback(() => goTo((cur + 1) % total), [cur, goTo, total]);
  const prev = useCallback(() => goTo((cur - 1 + total) % total), [cur, goTo, total]);

  const resetAndRun = (fn) => { clearInterval(timer.current); fn(); timer.current = setInterval(next, 6200); };

  useEffect(() => {
    timer.current = setInterval(next, 6200);
    return () => clearInterval(timer.current);
  }, [next]);

  return (
    <div className="w-full py-5 px-1 sm:px-2 lg:px-1 bg-white" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div className="relative">
        {/* Two-panel grid */}
        <div
          key={cur}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          style={{ animation: 'csFadeSlide 0.38s ease both' }}
        >
          {heroSlides[cur].panels.map((p, i) => <PanelCard key={i} panel={p} />)}
        </div>

        {/* Nav arrows — sit just outside the cards */}
        <button onClick={() => resetAndRun(prev)} aria-label="Previous" className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <button onClick={() => resetAndRun(next)} aria-label="Next" className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 h-9 w-9 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center gap-2 mt-4 pl-1">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => resetAndRun(() => goTo(i))}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{ height: 8, width: i === cur ? 26 : 8, background: i === cur ? '#0056d2' : '#cbd5e1' }}
          />
        ))}
      </div>

      <style>{`
        @keyframes csFadeSlide {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   QUICK LINKS (3 large icon cards below slider)
═══════════════════════════════════════════════════════ */
function QuickLinks() {
  const items = [
    { icon: Briefcase,     label: 'Launch a new career',     desc: 'Explore job-ready programs' },
    { icon: Users,         label: 'Try Studly for Business', desc: 'Upskill your entire team'    },
    { icon: GraduationCap, label: 'Earn a degree',           desc: 'Accredited online degrees'   },
  ];
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pb-5 bg-white" style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map(({ icon: Icon, label, desc }) => (
          <button
            key={label}
            className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200 text-left overflow-hidden"
          >
            {/* Hover accent line */}
            <div className="absolute left-0 top-0 h-full w-[3px] bg-[#0056d2] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-bottom rounded-r-full" />
 
            {/* Icon */}
            <div className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm group-hover:border-blue-100 transition-colors">
              <Icon size={19} strokeWidth={1.7} className="text-gray-500 group-hover:text-[#0056d2] transition-colors" />
            </div>
 
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-900 leading-tight">{label}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
            </div>
 
            {/* Arrow */}
            <svg className="w-4 h-4 text-gray-300 group-hover:text-[#0056d2] group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PARTNER LOGOS STRIP
═══════════════════════════════════════════════════════ */
function PartnerStrip() {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d === 'l' ? -200 : 200, behavior: 'smooth' });
  return (
    <section className="border-t border-b border-gray-100 py-6 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1280px' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[15px] font-semibold text-gray-900">Learn from 350+ leading universities and companies</p>
          <div className="flex gap-1 shrink-0 ml-4">
            <button onClick={() => scroll('l')} className="h-7 w-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft size={14} /></button>
            <button onClick={() => scroll('r')} className="h-7 w-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight size={14} /></button>
          </div>
        </div>
        <div ref={ref} className="flex items-center gap-7 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {partnerLogos.map(p => (
  <button key={p.name} className="flex items-center gap-2 shrink-0 group">

    {/* ✅ LOGO */}
    <div className="h-7 w-7 flex items-center justify-center rounded-md bg-white border border-gray-200 overflow-hidden">
      <img
        src={p.logo}
        alt={p.name}
        className={`h-5 w-5 object-contain ${
          p.isIcon ? '' : 'scale-110'
        }`}
      />
    </div>

    {/* ✅ NAME */}
    <span className="text-[13px] font-semibold text-gray-700 group-hover:text-[#0056d2] transition-colors whitespace-nowrap">
      {p.name}
    </span>

  </button>
))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   HORIZONTAL SCROLL SECTION (courses / degrees)
═══════════════════════════════════════════════════════ */
function ScrollSection({ title, subtitle, seeAllHref, children }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d === 'l' ? -310 : 310, behavior: 'smooth' });
  return (
    <section className="py-8 border-b border-gray-100 bg-white">
      <div className="mx-auto px-2 sm:px-2 lg:px-8" style={{ maxWidth: '1280px' }}>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-[19px] font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button onClick={() => scroll('l')} className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronLeft size={15} /></button>
            <button onClick={() => scroll('r')} className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><ChevronRight size={15} /></button>
            <Link to="/allCourses" className="text-sm font-semibold text-[#0056d2] hover:underline hidden sm:inline ml-1">See all</Link>
          </div>
        </div>
        <div ref={ref} className="flex gap-5 overflow-x-auto snap-x pb-2" style={{ scrollbarWidth: 'none' }}>
          {children}
        </div>
      </div>
    </section>
  );
}

/* ─── Course Card ─── */
function CourseCard({ c }) {
  return (
    <div className="min-w-[255px] sm:min-w-[270px] snap-start group cursor-pointer shrink-0">
      <div className="relative h-[138px] rounded-xl overflow-hidden mb-3 border border-gray-100">
        <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="h-5 w-5 rounded flex items-center justify-center text-white text-[8px] font-black shrink-0" style={{ background: c.pColor }}>{c.pLogo}</div>
        <span className="text-[11px] text-gray-500 font-medium">{c.partner}</span>
      </div>
      <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#0056d2] transition-colors mb-1">{c.title}</h3>
      <p className="text-[11px] text-gray-500 mb-1.5">{c.type}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {c.skills.slice(0, 2).map(s => (
          <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{s}</span>
        ))}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-amber-600">{c.rating}</span>
        <div className="flex">
          {[1,2,3,4,5].map(i => <Star key={i} size={10} className={i <= Math.round(c.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />)}
        </div>
        <span className="text-[11px] text-gray-400">({c.reviews})</span>
      </div>
    </div>
  );
}

/* ─── Degree Card ─── */
function DegreeCard({ d }) {
  return (
    <div className="min-w-[255px] sm:min-w-[270px] snap-start group cursor-pointer shrink-0">
      <div className="relative h-[138px] rounded-xl overflow-hidden mb-3 border border-gray-100">
        <img src={d.img} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: d.accentColor }} />
      </div>
      <p className="text-[11px] text-gray-500 mb-1">{d.school}</p>
      <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#0056d2] transition-colors mb-2">{d.title}</h3>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Clock size={10} />{d.duration}</span>
        <span className="font-semibold text-[#0056d2]">From {d.tuition}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CAREER GOAL CARDS
═══════════════════════════════════════════════════════ */
function CareerGoals() {
  const goals = [
    { label:'Advance my career',  Icon:TrendingUp,    bg:'#eff6ff', color:'#0056d2', desc:'Develop job-ready skills and earn certificates recognized by top employers.' },
    { label:'Get a degree',       Icon:GraduationCap, bg:'#f0fdf4', color:'#16a34a', desc:"Earn an accredited bachelor's or master's degree from a top university."     },
    { label:'Upskill my team',    Icon:Users,          bg:'#fff7ed', color:'#ea580c', desc:'Bring world-class learning to your organization with Studly for Business.'   },
  ];
  return (
    <section className="py-8 border-b border-gray-100 bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1280px' }}>
        <h2 className="text-[19px] font-bold text-gray-900 mb-5">What do you want to achieve?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map(({ label, Icon, bg, color, desc }) => (
            <button key={label} className="text-left rounded-2xl p-6 border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-[#0056d2] transition-colors">{label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
function HeroBanners() {
  return (
    <div className="w-full bg-[#fcfcfc] py-16 px-6">
      <div className="max-w-[1440px] mx-auto min-h-[750px] relative overflow-hidden rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] bg-[#111]">
        
        {/* Subtle Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-60">
          <img 
            src={background}
            alt="Luxury Mentorship" 
            className="w-full h-full object-cover grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/80 to-transparent" />
        </div>

        <div className="relative z-20 flex flex-col lg:flex-row h-full min-h-[750px]">
          
          {/* Left Section: Refined Typography */}
          <div className="w-full lg:w-3/5 p-8 md:p-24 flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-[#c5a358] text-xs font-semibold uppercase tracking-[0.4em] mb-6 block">
                The Platinum Standard
              </span>
              
              <h1 className="text-5xl md:text-[6rem] font-light text-white leading-[1.1] tracking-tight mb-8">
                Future <br />
                <span className="font-serif italic text-[#c5a358]">is</span> Expert
              </h1>

              <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed mb-12 font-light tracking-wide">
                Experience high-performance mentorship designed for the next generation of global industry leaders. Elegance in execution, excellence in results.
              </p>

              <div className="flex flex-wrap gap-6 pt-2">
                <button className="px-10 py-5 bg-[#c5a358] text-white font-medium text-xs uppercase tracking-widest hover:bg-[#d4b97a] transition-all duration-500 rounded-sm">
                  Apply for Admission
                </button>
                <button className="px-10 py-5 bg-transparent text-white border border-white/20 font-medium text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 rounded-sm">
                  The Curriculum
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: Minimalist Stats Vertical Ticker */}
          <div className="w-full lg:w-2/5 relative flex items-center justify-center lg:justify-end lg:pr-24 pb-20 lg:pb-0">
            <div className="h-[320px] w-72 overflow-hidden relative border-y border-white/10">
              
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#111] to-transparent z-30" />
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#111] to-transparent z-30" />
              
              <div className="flex flex-col gap-0 animate-[verticalScroll_20s_linear_infinite] hover:[animation-play-state:paused]">
                {[
                  { label: "Placement Rate", val: "94%" },
                  { label: "Elite Mentors", val: "200+" },
                  { label: "Global Alumni", val: "50K" },
                  { label: "Growth Index", val: "100%" }
                ].concat([
                  { label: "Placement Rate", val: "94%" },
                  { label: "Elite Mentors", val: "200+" },
                  { label: "Global Alumni", val: "50K" },
                  { label: "Growth Index", val: "100%" }
                ]).map((item, idx) => (
                  <div 
                    key={idx} 
                    className="py-10 flex flex-col items-center lg:items-end justify-center group"
                  >
                    <div className="text-4xl font-extralight text-white/40 group-hover:text-[#c5a358] transition-all duration-700">
                      {item.val}
                    </div>
                    <div className="text-[9px] font-medium text-gray-500 uppercase tracking-[0.5em] mt-3">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ticker: Subtle & Quiet */}
        <div className="absolute bottom-0 left-0 w-full bg-[#c5a358] py-3 overflow-hidden whitespace-nowrap z-30">
          <div className="inline-block animate-[horizontalScroll_40s_linear_infinite] text-white font-medium text-[9px] uppercase tracking-[0.7em]">
            PRECISION MENTORSHIP • GLOBAL EXCELLENCE • STRATEGIC GROWTH • ADMISSIONS OPEN 2026 • PRECISION MENTORSHIP • GLOBAL EXCELLENCE • STRATEGIC GROWTH • ADMISSIONS OPEN 2026 •
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes verticalScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes horizontalScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
/* ═══════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section className="py-8 border-b border-gray-100 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1280px' }}>
        <h2 className="text-[19px] font-bold text-gray-900 mb-5">Learners who became leaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <div key={t.name} className="rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-all bg-white">
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(i => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover shrink-0" />
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-[11px] text-[#0056d2] font-semibold">{t.course}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER CTA
═══════════════════════════════════════════════════════ */
function FooterCTA() {
  return (
    <section className="py-14 bg-[#0056d2] text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ maxWidth: '1280px' }}>
        <h2 className="text-3xl font-extrabold mb-3">Start learning today</h2>
        <p className="text-blue-200 mb-7 text-base">Join 148 million learners worldwide. Free to start, always.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-white text-[#0056d2] font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-all text-sm shadow-lg">
            Join for Free <ArrowRight size={15} />
          </Link>
          <Link to="/courses" className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-full hover:border-white hover:bg-white/10 transition-all text-sm">
            <BookOpen size={15} /> Browse all courses
          </Link>
        </div>
      </div>
    </section>
  );
}
function CourseCardWithEnroll({ c }) {
  const handleEnroll = () => {
    console.log("Enroll clicked:", c._id);

    // 👉 later you can connect payment / enrollment API here
    alert(`Enrolled in ${c.title}`);
  };

  return (
    <div className="min-w-[255px] sm:min-w-[270px] snap-start group shrink-0 border rounded-xl p-3 bg-white">
      
      <img
        src={c.image || "https://via.placeholder.com/300"}
        alt={c.title}
        className="w-full h-[140px] object-cover rounded-md mb-2"
      />

      <h3 className="text-sm font-bold text-gray-900 mb-1">
        {c.title}
      </h3>

      <p className="text-xs text-gray-500 mb-2">
        {c.instructor || "Unknown Instructor"}
      </p>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {c.description}
      </p>

      {/* ⭐ ENROLL BUTTON */}
      <button
        onClick={handleEnroll}
        className="w-full bg-[#0056d2] text-white text-xs font-semibold py-2 rounded-md hover:bg-blue-700 transition"
      >
        Enroll Now
      </button>
    </div>
  );
}
 
export default function Landings() {
  const [courses, setCourses] = useState([]);
useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/courses");

      const data = await res.json();

      console.log("API DATA:", data); // 🔥 CHECK THIS

      setCourses(data.data); // ✅ IMPORTANT FIX
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  fetchCourses();
}, []);
  return (
    <div className="flex flex-col w-full bg-white">
      <HomeLanding />
       
    

      <CareerGoals />
       
      <Testimonials />
     
    </div>
  );
}