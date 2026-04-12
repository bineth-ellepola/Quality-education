import React, { useEffect, useState, useMemo } from 'react';
import Header from '../HeaderSection/Header';
import Footer from './Footer';
import { useNavigate } from "react-router-dom";
 
/* ─── Design tokens ─────────────────────────────────────────── */
const T = {
  brand:   '#1A1A2E',
  accent:  '#C8A96E',
  accent2: '#4A6FA5',
  bg:      '#F7F5F0',
  surface: '#FFFFFF',
  border:  '#E8E4DC',
  text:    '#1A1A2E',
  muted:   '#7A7570',
  light:   '#F0EDE6',
};

const SUBJECT_COLORS = {
  Design:      { bg: '#FFF8F0', text: '#92400E', accent: '#C8A96E' },
  Engineering: { bg: '#EFF6FF', text: '#1E40AF', accent: '#4A6FA5' },
  Data:        { bg: '#ECFDF5', text: '#065F46', accent: '#059669' },
  Product:     { bg: '#F5F3FF', text: '#4C1D95', accent: '#7C3AED' },
  Marketing:   { bg: '#FFF1F2', text: '#9F1239', accent: '#E11D48' },
  Business:    { bg: '#FFFBEB', text: '#78350F', accent: '#D97706' },
};

const LEVEL_META = {
  Beginner:     { bg: '#F0FDF4', text: '#166534' },
  Intermediate: { bg: '#FFFBEB', text: '#92400E' },
  Advanced:     { bg: '#FEF2F2', text: '#991B1B' },
};

const AVATAR_COLORS = ['#4A6FA5','#059669','#7C3AED','#E11D48','#D97706','#C8A96E','#1E40AF','#065F46'];

const SUBJECTS     = ['All','Design','Engineering','Data','Product','Marketing','Business'];
const LEVELS       = ['All','Beginner','Intermediate','Advanced'];
const SORT_OPTIONS = [
  { value: 'popular',    label: 'Most Popular' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];
const PER_PAGE = 9;

/* ─── Helpers ───────────────────────────────────────────────── */
function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function getSubjectStyle(name) {
  return SUBJECT_COLORS[name] || { bg: '#F5F5F5', text: '#333', accent: '#888' };
}
function getLevelStyle(name) {
  return LEVEL_META[name] || { bg: '#F5F5F5', text: '#333' };
}

/* ─── Sub-components ────────────────────────────────────────── */
const StarRating = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 11 11" fill={i <= filled ? T.accent : '#E5E1D8'}>
          <path d="M5.5 1l1.07 2.16 2.39.35-1.73 1.68.41 2.38L5.5 6.4 3.36 7.57l.41-2.38L2.04 3.51l2.39-.35z" />
        </svg>
      ))}
    </span>
  );
};

const SkeletonCard = () => (
  <div style={{
    background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2,
    overflow: 'hidden', animation: 'pulse 1.5s infinite',
  }}>
    <div style={{ height: 176, background: '#F0EDE6' }} />
    <div style={{ padding: 20 }}>
      {[['40%',10],['90%',14],['70%',12],['60%',11]].map(([w, h], i) => (
        <div key={i} style={{ height: h, width: w, background: '#F0EDE6', borderRadius: 3, marginBottom: 12 }} />
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
        <div style={{ height: 24, width: '30%', background: '#F0EDE6', borderRadius: 3 }} />
        <div style={{ height: 34, width: '40%', background: '#F0EDE6', borderRadius: 2 }} />
      </div>
    </div>
  </div>
);
const CourseCard = ({ course,onClick }) => {
    
  const [hovered, setHovered] = useState(false);
  const col = getSubjectStyle(course.subject?.name || course.subject || '');
  const lev = getLevelStyle(course.level);
  const avColor = AVATAR_COLORS[(course._id || course.id || 0) % AVATAR_COLORS.length];
  const instructorName = course.instructor?.name || course.instructor || '';
  const subjectName = course.subject?.name || course.subject || '';
  const price = course.price;

  return (
    <div
    onClick={() => onClick && onClick(course)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#F97316' + '55' : '#E5E7EB'}`,
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: hovered
          ? '0 16px 40px rgba(0,0,0,0.08)'
          : '0 2px 6px rgba(0,0,0,0.03)',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}
    >
      {/* IMAGE */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        {course.coverImage ? (
          <img
            src={course.coverImage}
            alt={course.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />
        ) : (
          <div
            style={{
              height: '100%',
              background: `linear-gradient(135deg, ${col.bg}, ${col.bg}cc)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}

        {/* gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1), transparent)',
          }}
        />

        {/* badges */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            gap: 6,
          }}
        >
          {course.tag && (
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 20,
                background: '#fff',
                color: '#111827',
              }}
            >
              {course.tag}
            </div>
          )}
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '5px 10px',
              borderRadius: 20,
              background: lev.bg,
              color: lev.text,
            }}
          >
            {course.level}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* subject */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: col.accent,
            marginBottom: 8,
          }}
        >
          {subjectName}
        </span>

        {/* title */}
        <h3
          style={{
            margin: '0 0 6px',
            fontSize: 16,
            fontWeight: 700,
            color: '#111827',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.title}
        </h3>

        {/* description */}
        <p
          style={{
            margin: '0 0 16px',
            fontSize: 13,
            color: '#6B7280',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.description || course.desc}
        </p>

        {/* rating + duration */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 12,
            color: '#6B7280',
            marginBottom: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <StarRating rating={course.averageRating ?? course.rating ?? 0} />
            <span style={{ fontWeight: 700, color: '#111827' }}>
              {(course.averageRating ?? course.rating ?? 0).toFixed(1)}
            </span>
          </div>

          <div style={{ width: 1, height: 12, background: '#E5E7EB' }} />

          <span>{course.duration}h total</span>
        </div>

        {/* instructor */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingTop: 14,
            borderTop: '1px solid #F3F4F6',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: `${avColor}15`,
              color: avColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              border: `1px solid ${avColor}30`,
            }}
          >
            {getInitials(instructorName)}
          </div>
          <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
            {instructorName}
          </span>
        </div>

        {/* footer */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              style={{
                fontSize: 10,
                color: '#9CA3AF',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Price
            </span>
            {price === 0 ? (
              <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>
                Free
              </div>
            ) : (
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>
                {course.currency || '$'}
                {price}
              </div>
            )}
          </div>

          <EnrollButton />
        </div>
      </div>
    </div>
  );
};

const EnrollButton = () => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // ✅ IMPORTANT FIX
        console.log("Enroll clicked");
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#ff4628' : '#172033',
        color: '#fff',
        border: 'none',
        padding: '10px 18px',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        borderRadius: 8,
        transition: 'all 0.2s ease',
        boxShadow: hov ? '0 6px 16px rgba(249,115,22,0.3)' : 'none',
      }}
    >
      Enroll Now
    </button>
  );
};
/* ─── Main page ─────────────────────────────────────────────── */
export default function AllCoursesPage() {
  const navigate = useNavigate();

const handleCourseClick = (course) => {
  const id = course._id || course.id;
  navigate(`/courses/${id}`);
};
    const [notifications, setNotifications] = useState([]);
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');
  const [subject,  setSubject]  = useState('All');
  const [level,    setLevel]    = useState('All');
  const [sort,     setSort]     = useState('popular');
  const [page,     setPage]     = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const res    = await fetch('http://localhost:5001/api/courses');
        const result = await res.json();
        setCourses(result.data || []);
      } catch {
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
  const sampleUsers = ['Chathura', 'Thilu', 'Malkini', 'Minula', 'Bineth', 'Sewni'];
  const sampleActions = [
    'enrolled in',
    'just completed',
    'left a 5⭐ review on',
    'started learning now'
  ];

  let index = 0;

  const interval = setInterval(() => {
    if (courses.length === 0) return;

    const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
    const randomCourse = courses[Math.floor(Math.random() * courses.length)];
    const randomAction = sampleActions[Math.floor(Math.random() * sampleActions.length)];

    const newNotification = {
      id: Date.now(),
      text: `${randomUser} ${randomAction} "${randomCourse.title}"`
    };

    setNotifications(prev => [...prev, newNotification]);

    // auto remove after 4s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 4000);

    index++;
  }, 3000);

  return () => clearInterval(interval);
}, [courses]);

  const filtered = useMemo(() => {
    let list = [...courses];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        (c.instructor?.name || c.instructor || '').toLowerCase().includes(q)
      );
    }
    const subjectName = c => c.subject?.name || c.subject || '';
    if (subject !== 'All') list = list.filter(c => subjectName(c) === subject);
    if (level   !== 'All') list = list.filter(c => c.level === level);
    if (sort === 'rating')     list.sort((a, b) => (b.averageRating ?? b.rating ?? 0) - (a.averageRating ?? a.rating ?? 0));
    else if (sort === 'price_asc')  list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sort === 'price_desc') list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sort === 'newest')     list.sort((a, b) => (b._id || b.id || 0) > (a._id || a.id || 0) ? 1 : -1);
    else list.sort((a, b) => (b.enrolledCount ?? b.enrolled ?? 0) - (a.enrolledCount ?? a.enrolled ?? 0));
    return list;
  }, [courses, search, subject, level, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const subjectCounts = useMemo(() => {
    const counts = {};
    courses.forEach(c => {
      const s = c.subject?.name || c.subject || 'Other';
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [courses]);

  const stats = useMemo(() => ({
    total:       courses.length,
    free:        courses.filter(c => c.price === 0).length,
    avgRating:   courses.length
      ? (courses.reduce((s, c) => s + (c.averageRating ?? c.rating ?? 0), 0) / courses.length).toFixed(1)
      : '0.0',
    instructors: new Set(courses.map(c => c.instructor?.name || c.instructor)).size,
  }), [courses]);

  const goPage = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif", background: T.bg, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        ::-webkit-scrollbar { height: 6px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        @keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px) translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
}
      `}</style>

      {/* ── NAVBAR ── */}
       <Header />

      {/* ── HERO ── */}
      <div style={{
        background: T.brand, padding: '72px 32px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[{size:400,right:-80,top:-80,op:0.12},{size:220,right:60,top:40,op:0.08}].map((c,i) => (
          <div key={i} style={{
            position: 'absolute', right: c.right, top: c.top,
            width: c.size, height: c.size, borderRadius: '50%',
            border: `1px solid rgba(200,169,110,${c.op})`, pointerEvents: 'none',
          }} />
        ))}
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.accent, fontWeight: 600, marginBottom: 20 }}>
              Professional Learning Platform
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 52, color: '#fff', lineHeight: 1.08, letterSpacing: '-0.5px', margin: '0 0 20px' }}>
              Advance your career<br />with <em style={{ color: T.accent }}>world-class</em><br />instruction.
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 480, fontWeight: 300, margin: 0 }}>
              Curated courses taught by practitioners. Build in-demand skills, earn recognized credentials, and move forward faster.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 40, paddingBottom: 4, flexShrink: 0 }}>
            {[
              { num: stats.total.toLocaleString(), label: 'Courses' },
              { num: stats.instructors,            label: 'Instructors' },
              { num: `${stats.avgRating}`,          label: 'Avg. Rating' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: '#fff', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div style={{ background: T.brand, padding: '0 32px 32px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', background: '#fff',
          borderRadius: 4, overflow: 'hidden',
          border: `1px solid ${T.border}`,
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.35, flexShrink: 0 }}>
              <circle cx="6.5" cy="6.5" r="5" stroke={T.brand} strokeWidth="1.5" />
              <path d="M14 14l-3-3" stroke={T.brand} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search courses, instructors, topics..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                flex: 1, border: 'none', background: 'transparent',
                fontSize: 14, color: T.text, fontFamily: 'inherit',
                padding: '14px 0',
              }}
            />
          </div>
          <div style={{ width: 1, background: T.border, margin: '8px 0' }} />
          <select
            value={subject}
            onChange={e => { setSubject(e.target.value); setPage(1); }}
            style={{
              border: 'none', padding: '14px 18px', fontSize: 13,
              fontFamily: 'inherit', color: T.muted, background: 'transparent',
              cursor: 'pointer', appearance: 'none',
            }}
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s === 'All' ? 'All subjects' : s}</option>)}
          </select>
          <button style={{
            background: T.accent, border: 'none', color: T.brand,
            padding: '0 32px', fontSize: 12, fontFamily: 'inherit',
            letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer',
          }}>Search</button>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: '24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          {/* Subject chips */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {SUBJECTS.map(s => (
              <FilterTab
                key={s}
                active={s === subject}
                onClick={() => { setSubject(s); setPage(1); }}
              >
                {s === 'All' ? `All (${courses.length})` : `${s} (${subjectCounts[s] || 0})`}
              </FilterTab>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: T.muted }}>
              {filtered.length} course{filtered.length !== 1 ? 's' : ''}
            </span>
            <select
              value={level}
              onChange={e => { setLevel(e.target.value); setPage(1); }}
              style={selectStyle}
            >
              {LEVELS.map(l => <option key={l} value={l}>{l === 'All' ? 'All levels' : l}</option>)}
            </select>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={selectStyle}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 4, padding: 20, textAlign: 'center',
            color: '#DC2626', marginBottom: 24,
          }}>
            <div style={{ fontWeight: 600 }}>{error}</div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={gridStyle}>
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: T.brand, margin: '0 0 12px' }}>No courses found</h2>
            <p style={{ color: T.muted, marginBottom: 24 }}>Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setSubject('All'); setLevel('All'); setPage(1); }}
              style={{
                background: T.brand, color: '#fff', border: 'none',
                padding: '10px 28px', fontSize: 12, fontFamily: 'inherit',
                letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600,
                cursor: 'pointer', borderRadius: 2,
              }}
            >Clear all filters</button>
          </div>
        ) : (
          <div style={gridStyle}>
            {paginated.map((course, i) => (
  <CourseCard
    key={course._id || course.id || i}
    course={course}
    onClick={handleCourseClick}
  />
))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 48 }}>
            <PageNavBtn disabled={page === 1} onClick={() => goPage(page - 1)}>Prev</PageNavBtn>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let p;
              if (totalPages <= 7) p = i + 1;
              else if (page <= 4)           p = i + 1;
              else if (page >= totalPages - 3) p = totalPages - 6 + i;
              else                           p = page - 3 + i;
              if (p < 1 || p > totalPages) return null;
              return (
                <PageNumBtn key={p} active={p === page} onClick={() => goPage(p)}>{p}</PageNumBtn>
              );
            })}
            <PageNavBtn disabled={page === totalPages} onClick={() => goPage(page + 1)}>Next</PageNavBtn>
          </div>
        )}
      </div>
      {/* ── LIVE NOTIFICATIONS ── */}
<div style={{
  position: 'fixed',
  bottom: 20,
  left: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  zIndex: 9999,
  
}}>
  {notifications.map(n => (
    <div
      key={n.id}
      style={{
        background: '#111827',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: 10,
        fontSize: 13,
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        animation: 'slideIn 0.4s ease',
        maxWidth: 320,
      }}
    >
      {n.text}
    </div>
  ))}
</div>

       <Footer />
    </div>
  );
}

/* ─── Tiny button helpers ────────────────────────────────────── */
const NavBtn = ({ children, variant }) => {
  const [hov, setHov] = useState(false);
  const base = {
    padding: '7px 18px', borderRadius: 4, fontSize: 12,
    fontFamily: 'inherit', letterSpacing: '0.06em',
    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
  };
  const styles = variant === 'solid'
    ? { ...base, background: hov ? '#D4B87A' : T.accent, border: 'none', color: T.brand, fontWeight: 600 }
    : { ...base, background: 'none', border: `1px solid ${hov ? T.accent : 'rgba(255,255,255,0.2)'}`, color: hov ? T.accent : 'rgba(255,255,255,0.7)' };
  return <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={styles}>{children}</button>;
};

const FilterTab = ({ children, active, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: active ? T.brand : 'none',
        border: `1px solid ${active ? T.brand : hov ? T.accent : T.border}`,
        color: active ? '#fff' : hov ? T.accent : T.muted,
        padding: '6px 16px', borderRadius: 2,
        fontSize: 12, fontFamily: 'inherit',
        letterSpacing: '0.05em', textTransform: 'uppercase',
        cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500,
      }}
    >{children}</button>
  );
};

const PageNavBtn = ({ children, onClick, disabled }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hov && !disabled ? T.brand : T.border}`,
        color: disabled ? T.border : hov ? T.brand : T.text,
        padding: '0 16px', height: 36,
        display: 'flex', alignItems: 'center',
        fontSize: 12, fontFamily: 'inherit',
        letterSpacing: '0.05em', textTransform: 'uppercase',
        cursor: disabled ? 'default' : 'pointer',
        borderRadius: 2, transition: 'all 0.15s',
      }}
    >{children}</button>
  );
};

const PageNumBtn = ({ children, active, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 36, height: 36, borderRadius: 2,
        background: active ? T.brand : T.surface,
        border: `1px solid ${active ? T.brand : hov ? T.brand : T.border}`,
        color: active ? '#fff' : hov ? T.brand : T.text,
        fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >{children}</button>
  );
};

/* ─── Shared style objects ───────────────────────────────────── */
const selectStyle = {
  border: `1px solid ${T.border}`, background: T.surface,
  padding: '7px 12px', fontSize: 12, fontFamily: 'inherit',
  color: T.text, cursor: 'pointer', borderRadius: 2,
  letterSpacing: '0.03em',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 24,
};