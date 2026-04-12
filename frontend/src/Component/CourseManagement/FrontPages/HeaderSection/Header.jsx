import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, BookOpen, Code, BarChart, User, X, Sparkles } from 'lucide-react';

// ─── Keyframe injection (once, outside component) ────────────────────────────
const GLOBAL_STYLES = `
  @keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes notifPop {
    0%   { opacity: 0; transform: translateY(-8px) scale(0.95); }
    60%  { transform: translateY(2px) scale(1.01); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes logoEntrance {
    0%   { opacity: 0; transform: scale(0.8) rotate(-4deg); }
    60%  { transform: scale(1.06) rotate(1deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes navItemIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes searchPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255, 7, 58, 0); }
    50%       { box-shadow: 0 0 0 4px rgba(255, 7, 58, 0.08); }
  }
  @keyframes dropdownIn {
    from { opacity: 0; transform: translateY(8px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes avatarRing {
    0%   { box-shadow: 0 0 0 0 rgba(255, 70, 40, 0.4); }
    70%  { box-shadow: 0 0 0 8px rgba(255, 70, 40, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 70, 40, 0); }
  }

  .studly-nav-link {
    position: relative;
    font-size: 14px;
    font-weight: 500;
    color: #0066cc;
    text-decoration: none;
    padding-bottom: 2px;
    transition: color 0.2s ease;
  }
  .studly-nav-link::after {
    content: '';
    position: absolute;
    left: 0; bottom: -2px;
    width: 0; height: 2px;
    background: #ff073a;
    border-radius: 2px;
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .studly-nav-link:hover { color: #ff073a; }
  .studly-nav-link:hover::after { width: 100%; }

  .studly-search:focus-within {
    animation: searchPulse 1.5s ease 0.1s 2;
  }

  .studly-avatar:hover {
    animation: avatarRing 0.6s ease-out;
  }

  .explore-dropdown {
    animation: dropdownIn 0.22s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .notif-bubble {
    animation: notifPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
`;

// ─── Notification tips ────────────────────────────────────────────────────────
const SIGN_IN_TIPS = [
  { emoji: "", text: "Continue where you left off" },
  { emoji: "", text: "12 new courses added this week!" },
  { emoji: "", text: "Your learning streak is waiting" },
  { emoji: "", text: "Pick up your saved courses" },
];
const SIGN_UP_TIPS = [
  { emoji: "", text: "Free for 7 days — no card needed" },
  { emoji: "", text: "Join 50,000+ learners today" },
  { emoji: "", text: "Get personalized course picks" },
  { emoji: "", text: "Earn certificates. Boost your CV." },
];

// ─── AuthNotification ─────────────────────────────────────────────────────────
function AuthNotification({ message, onClose, side = "right" }) {
  return (
    <div
      className="notif-bubble"
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        [side === 'left' ? 'left' : 'right']: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'white',
        border: '1px solid #f0f0f0',
        borderRadius: 12,
        padding: '8px 12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        whiteSpace: 'nowrap',
        minWidth: 180,
      }}
    >
      {/* Arrow */}
      <span style={{
        position: 'absolute',
        top: -6,
        [side === 'left' ? 'left' : 'right']: 14,
        width: 12, height: 12,
        background: 'white',
        border: '1px solid #f0f0f0',
        borderRight: 'none',
        borderBottom: 'none',
        transform: 'rotate(45deg)',
        borderRadius: 2,
      }} />
      <span style={{ fontSize: 15 }}>{message.emoji}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{message.text}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer',
          color: '#d1d5db', padding: 0, display: 'flex', alignItems: 'center',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#6b7280'}
        onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
      >
        <X size={12} />
      </button>
    </div>
  );
}

// ─── ExploreDropdown ──────────────────────────────────────────────────────────
function ExploreDropdown() {
  return (
    <div
      className="explore-dropdown"
      style={{
        position: 'absolute',
        left: 0, top: '100%',
        zIndex: 50,
        width: 720,
        background: 'white',
        border: '1px solid #f0f0f0',
        borderRadius: 20,
        padding: 28,
        boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
        {/* Categories */}
        <div>
          <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 14 }}>
            Popular Categories
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { name: 'Data Science', icon: <BarChart size={15} />, path: '/datScience', color: '#eff6ff', iconColor: '#3b82f6' },
              { name: 'Business', icon: <BookOpen size={15} />, path: '/businessSection', color: '#f0fdf4', iconColor: '#22c55e' },
              { name: 'Computer Science', icon: <Code size={15} />, path: '/category/cs', color: '#faf5ff', iconColor: '#a855f7' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 12,
                  textDecoration: 'none',
                  fontSize: 14, fontWeight: 500, color: '#374151',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ff073a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#374151'; }}
              >
                <span style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: item.color, color: item.iconColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 14 }}>
            Trending Subjects
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Python for Beginners', 'AI & Machine Learning', 'UX/UI Design Principles'].map((subject, idx) => (
              <Link
                key={idx}
                to={`/search?q=${subject.toLowerCase().replace(/ /g, '+')}`}
                style={{ textDecoration: 'none', padding: '6px 8px', borderRadius: 8, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1f2937', lineHeight: 1.3 }}>{subject}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, letterSpacing: '0.03em' }}>Professional Certificate</div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ff4628 0%, #ff073a 100%)',
          borderRadius: 16, padding: 20, color: 'white',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <Sparkles size={20} style={{ marginBottom: 8, opacity: 0.9 }} />
            <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px' }}>Start Learning Today</h4>
            <p style={{ fontSize: 12, opacity: 0.85, margin: 0, lineHeight: 1.5 }}>
              Explore 1000+ courses from top instructors and boost your career.
            </p>
          </div>
          <Link
            to="/courses"
            style={{
              marginTop: 16, display: 'inline-block',
              background: 'white', color: '#ff073a',
              padding: '8px 14px', borderRadius: 8,
              fontSize: 12, fontWeight: 700,
              textDecoration: 'none',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
          >
            Browse Courses →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────
function Header() {
  const [userData, setUserData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [signInTip, setSignInTip] = useState(null);
  const [signUpTip, setSignUpTip] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Mount animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // User data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUserData(JSON.parse(storedUser)); } catch (e) { console.error(e); }
    }
  }, []);

  // Auth notifications
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      const rI = SIGN_IN_TIPS[Math.floor(Math.random() * SIGN_IN_TIPS.length)];
      const rU = SIGN_UP_TIPS[Math.floor(Math.random() * SIGN_UP_TIPS.length)];
      const t1 = setTimeout(() => setSignInTip(rI), 900);
      const t2 = setTimeout(() => setSignUpTip(rU), 1600);
      const t3 = setTimeout(() => setSignInTip(null), 7000);
      const t4 = setTimeout(() => setSignUpTip(null), 7600);
      return () => [t1, t2, t3, t4].forEach(clearTimeout);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const navDelay = (i) => ({ animationDelay: `${80 + i * 60}ms`, animationFillMode: 'both' });

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        width: '100%',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid #f0f0f0' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06)' : 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(-100%)',
        // CSS transition for mount
      }}
        // Inline transition on mount (one-time, so using style directly)
      >
        {/* Mount animation via a wrapper approach */}
        <div style={{
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.28,0.64,1)',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-12px)',
        }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 68, padding: '0 24px',
          }}>

            {/* ── LEFT: Logo + Nav ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>

              {/* Logo */}
              <Link
                to="/"
             style={{
  fontSize: 28,
  fontWeight: 700,
  background: 'linear-gradient(90deg, #ff2d55, #ff2d55, #ff2d55)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.3px',
  textDecoration: 'none',
  animation: 'logoEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both',
  display: 'inline-block',
  transition: 'transform 0.25s ease, opacity 0.25s ease',
  textRendering: 'optimizeLegibility',
}}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Studly
              </Link>

              {/* Nav links */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <Link
                  to="/allCourses"
                  className="studly-nav-link"
                  style={{ animation: 'navItemIn 0.5s ease both', ...navDelay(0) }}
                >
                  Courses
                </Link>

                {/* Explore dropdown */}
                <div
                  style={{ position: 'relative', padding: '20px 0' }}
                  onMouseEnter={() => setExploreOpen(true)}
                  onMouseLeave={() => setExploreOpen(false)}
                >
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: 14, fontWeight: 500,
                      color: exploreOpen ? '#0066cc' : '#0066cc',
                      transition: 'color 0.2s ease',
                      animation: 'navItemIn 0.5s ease both',
                      padding: 0,
                      ...navDelay(1),
                    }}
                  >
                    Explore
                    <ChevronDown
                      size={14}
                      style={{
                        transition: 'transform 0.25s ease',
                        transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>
                  {exploreOpen && <ExploreDropdown />}
                </div>
              </div>
            </div>

            {/* ── MIDDLE: Search ── */}
            <div style={{
              flex: 1, maxWidth: 420, padding: '0 32px',
              animation: 'navItemIn 0.5s ease both',
              animationDelay: '200ms', animationFillMode: 'both',
            }}>
              <div
                className="studly-search"
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); }}
                  placeholder="Search for any course..."
                  style={{
                    width: '100%', height: 40,
                    borderRadius: 999, border: '1.5px solid #e5e7eb',
                    background: '#f9fafb', paddingLeft: 18, paddingRight: 48,
                    fontSize: 13, outline: 'none', color: '#111827',
                    transition: 'border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#ff073a'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(255,7,58,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.background = '#f9fafb'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  onClick={() => { if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); }}
                  style={{
                    position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)',
                    width: 30, height: 30, borderRadius: '50%',
                    background: '#ff073a', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    transition: 'background 0.2s ease, transform 0.15s ease',
                    boxShadow: '0 2px 8px rgba(255,7,58,0.35)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#cc0030'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#ff073a'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
                >
                  <Search size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* ── RIGHT: Auth ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              animation: 'navItemIn 0.5s ease both',
              animationDelay: '280ms', animationFillMode: 'both',
            }}>
              {userData ? (
                /* ── Logged-in avatar menu ── */
                <div
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{userData.name || 'User'}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>Student Account</p>
                  </div>
                  <div
                    className="studly-avatar"
                    style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: '#f3f4f6',
                      border: menuOpen ? '2.5px solid #ff4628' : '2.5px solid #e5e7eb',
                      overflow: 'hidden', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'border-color 0.2s ease, transform 0.2s ease',
                      transform: menuOpen ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {userData.profilePicture
                      ? <img src={userData.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <User size={18} style={{ color: '#9ca3af' }} />}
                  </div>

                  {menuOpen && (
                    <div style={{
                      position: 'absolute', right: 0, top: '100%',
                      marginTop: 8, width: 160,
                      background: 'white', borderRadius: 14,
                      border: '1px solid #f0f0f0',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                      animation: 'dropdownIn 0.2s ease forwards',
                      zIndex: 60,
                    }}>
                      <div style={{ padding: '14px 0 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {userData.profilePicture
                            ? <img src={userData.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <User size={20} style={{ color: '#9ca3af' }} />}
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid #f5f5f5' }}>
                        <Link
                          to={`/userprofile/${userData._id}`}
                          style={{
                            display: 'block', padding: '10px 16px',
                            fontSize: 13, fontWeight: 500, color: '#374151',
                            textDecoration: 'none',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'block', width: '100%', textAlign: 'left',
                            padding: '10px 16px', fontSize: 13, fontWeight: 500,
                            color: '#ff073a', background: 'none', border: 'none', cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Sign In */}
                  <div style={{ position: 'relative' }}>
                    <Link
                      to="/login"
                      style={{
                        fontSize: 14, fontWeight: 600, color: '#0066cc',
                        textDecoration: 'none',
                        padding: '8px 4px',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ff073a'}
                      onMouseLeave={e => e.currentTarget.style.color = '#374151'}
                    >
                      Sign in
                    </Link>
                    {signInTip && <AuthNotification message={signInTip} onClose={() => setSignInTip(null)} side="left" />}
                  </div>

                  {/* Join for Free */}
                  <div style={{ position: 'relative' }}>
                    <Link
                      to="/signup"
                      style={{
                        display: 'inline-block',
                        background: '#ff073a',
                        color: 'white',
                        fontSize: 13, fontWeight: 700,
                        padding: '9px 22px', borderRadius: 999,
                        textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(255,7,58,0.30)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                        letterSpacing: '0.01em',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,7,58,0.40)';
                        e.currentTarget.style.background = '#e0002f';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,7,58,0.30)';
                        e.currentTarget.style.background = '#ff073a';
                      }}
                      onMouseDown={e => e.currentTarget.style.transform = 'translateY(0) scale(0.97)'}
                      onMouseUp={e => e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)'}
                    >
                      Join for Free
                    </Link>
                    {signUpTip && <AuthNotification message={signUpTip} onClose={() => setSignUpTip(null)} side="right" />}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;