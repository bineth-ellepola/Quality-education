import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import mc from '../../../../assets/mc.png'
import sliit from '../../../../assets/sliit.png'
import nsbm from '../../../../assets/nsb.png'
import horizon from '../../../../assets/horizon.png'
import iit from '../../../../assets/iit.png'
import ui from '../../../../assets/ui.jpg'
import dl from '../../../../assets/dl.jpg'
import st from '../../../../assets/st.png'
import pm from '../../../../assets/pm.avif'
import cn from '../../../../assets/cn.jpg'
// Import the CourseFetch component
import CourseFetch from '../LandingSection/CourseFetch'

import {
  ArrowRight, Star, ChevronLeft, ChevronRight,
  Users, TrendingUp, Briefcase, Clock,
  GraduationCap
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
        partnerLogos: [{ img: nsbm }, { img: sliit }, { img: horizon }, { img: iit }],
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
];

const partnerLogos = [
  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_logo.svg', isIcon: true },
  { name: 'SLIIT', logo: sliit, isIcon: true },
  { name: 'Microsoft', logo: mc, isIcon: true },
  { name: 'University of Illinois', logo: ui, isIcon: false },
  { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg', isIcon: true },
  { name: 'Stanford University', logo: st, isIcon: false },
];

const degrees = [
  { title: 'Master of Science in Data Science', school: 'University of Colorado Boulder', duration: '2 years', tuition: '$21,000', accentColor: '#CFB87C', img: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?q=80&w=600&fit=crop' },
  { title: "Bachelor's in Computer Science", school: 'University of London', duration: '3–6 years', tuition: '$18,000', accentColor: '#862633', img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&fit=crop' },
];

function FloralBlobs({ colors }) {
  const [c0, c1, c2, c3, c4] = colors;
  return (
    <svg viewBox="0 0 300 240" className="absolute right-0 top-0 h-full w-auto pointer-events-none select-none" preserveAspectRatio="xMaxYMid meet">
      <ellipse cx="210" cy="55" rx="62" ry="78" fill={c0} opacity="0.82" transform="rotate(-22 210 55)" />
      <ellipse cx="255" cy="135" rx="44" ry="60" fill={c1} opacity="0.78" transform="rotate(14 255 135)" />
      <circle cx="158" cy="82" r="24" fill={c3} opacity="0.68" />
    </svg>
  );
}

function PanelCard({ panel }) {
  const { bg, isDark, logo, headline, body, cta, badge, partnerLogos: pLogos, artColors, img } = panel;
  const text = isDark ? '#ffffff' : '#1e293b';
  const subText = isDark ? 'rgba(255,255,255,0.82)' : '#475569';

  return (
    <div className="relative overflow-hidden rounded-[2rem] flex flex-col justify-between p-8 sm:p-10 transition-transform duration-300 hover:shadow-lg" style={{ background: bg, minHeight: '340px' }}>
      <FloralBlobs colors={artColors} />
      {img && (
        <div className="absolute inset-0 pointer-events-none">
          <img src={img} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${bg}ee, ${bg}66)` }} />
        </div>
      )}
      <div className="relative z-10 h-full flex flex-col justify-center">
        {logo === 'plus' && (
          <div className="flex items-center gap-2 mb-6">
            <span className="font-black text-[#0056d2] text-lg italic tracking-tighter">studly</span>
            <span className="bg-[#0056d2] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">PLUS</span>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl font-black leading-[1.15] mb-4" style={{ color: text }}>
          {headline.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
        </h2>
        <p className="text-[15px] font-medium leading-relaxed mb-8 max-w-[280px]" style={{ color: subText }}>{body}</p>
        <div>
          <button className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-xl shadow-md transition-all hover:brightness-110"
            style={isDark ? { border: '2px solid rgba(255,255,255,0.8)', color: '#fff' } : { background: '#ff4628', color: '#fff' }}>
            {cta} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroBanner() {
  const [cur, setCur] = useState(0);
  const total = heroSlides.length;
  useEffect(() => {
    const timer = setInterval(() => setCur((prev) => (prev + 1) % total), 6200);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <div className="w-full py-5 px-4 bg-white mx-auto max-w-[1280px]">
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-3">
        {heroSlides[cur].panels.map((p, i) => <PanelCard key={i} panel={p} />)}
      </div>
    </div>
  );
}

function PartnerStrip() {
  return (
    <section className="border-t border-b border-gray-100 py-6 bg-white">
      <div className="mx-auto px-4 max-w-[1280px] flex items-center gap-7 overflow-x-auto no-scrollbar">
        {partnerLogos.map(p => (
          <div key={p.name} className="flex items-center gap-2 shrink-0">
            <img src={p.logo} alt={p.name} className="h-6 w-6 object-contain" />
            <span className="text-[13px] font-semibold text-gray-700">{p.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// Fixed ScrollSection to wrap our DB courses nicely
function ScrollSection({ title, subtitle, children }) {
  return (
    <section className="py-10 border-b border-gray-100 bg-white">
      <div className="mx-auto px-4 max-w-[1280px]">
        <div className="mb-8">
          <h2 className="text-[22px] font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function DegreeCard({ d }) {
  return (
    <div className="min-w-[270px] group cursor-pointer shrink-0">
      <div className="relative h-[140px] rounded-xl overflow-hidden mb-3 border border-gray-100">
        <img src={d.img} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: d.accentColor }} />
      </div>
      <p className="text-[11px] text-gray-500 mb-1">{d.school}</p>
      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">{d.title}</h3>
      <span className="text-xs font-semibold text-[#0056d2]">From {d.tuition}</span>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="bg-white min-h-screen">
      <HeroBanner />
      <PartnerStrip />
      
      {/* DB COURSES SECTION - Inserted Professionally */}
      <ScrollSection 
        title="Popular Courses" 
        subtitle="Master in-demand skills with our most popular online courses from the database."
      >
        {/* We pass a limit of 3 to display a clean row of courses */}
        <CourseFetch limit={3} />
      </ScrollSection>

      <ScrollSection title="Degrees from Top Universities">
        <div className="flex gap-5 overflow-x-auto no-scrollbar">
          {degrees.map((d, i) => <DegreeCard key={i} d={d} />)}
        </div>
      </ScrollSection>

      <footer className="py-20 text-center bg-gray-50 text-gray-400 text-sm">
        © 2026 Studly Learning Management System. All rights reserved.
      </footer>
    </div>
  );
}