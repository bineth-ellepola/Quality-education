import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, BookOpen, Code, BarChart, User, X, Sparkles } from 'lucide-react';

// ─── Apple-Inspired Keyframes & Global Styles ───────────────────────────────
const GLOBAL_STYLES = `
  .apple-header {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes appleNavFade {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes appleLogoScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .nav-item {
    font-size: 12px;
    font-weight: 400;
    color: #1d1d1f;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    letter-spacing: -0.01em;
  }

  .nav-item:hover {
    opacity: 1;
  }

  .apple-search-input {
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .apple-search-input:focus {
    background: #fff;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.1);
  }

  .dropdown-card {
    animation: appleNavFade 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Custom Scrollbar for Dropdowns */
  .mega-menu::-webkit-scrollbar { width: 4px; }
  .mega-menu::-webkit-scrollbar-thumb { background: #d2d2d7; border-radius: 10px; }
`;

// ─── Notification Tips Logic ──────────────────────────────────────────
const SIGN_IN_TIPS = [
   
];
const SIGN_UP_TIPS = [
   
];

// ─── Apple Style Auth Notification ───────────────────────────────────────────
function AuthNotification({ message, onClose, side = "right" }) {
  if (!message) return null;
  return (
    <div
      className="dropdown-card"
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        [side === 'left' ? 'left' : 'right']: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '12px',
        padding: '8px 14px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 14 }}>{message.emoji}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: '#1d1d1f' }}>{message.text}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#86868b', marginLeft: 8 }}>
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Minimal Mega Menu (Explore) ─────────────────────────────────────────────
function ExploreDropdown() {
  return (
    <div
      className="dropdown-card mega-menu"
      style={{
        position: 'fixed',
        top: 48, left: 0, right: 0,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '40px 0 60px',
        zIndex: 9998,
      }}
    >
      <div style={{ maxWidth: 1024, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, padding: '0 20px' }}>
        <div>
          <h4 style={{ fontSize: 11, color: '#86868b', marginBottom: 15, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explore</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Latest Courses', 'Popular Tracks', 'Certifications'].map(link => (
              <li key={link}><Link to="#" className="nav-item" style={{ fontSize: 17, fontWeight: 600, opacity: 1 }}>{link}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: 11, color: '#86868b', marginBottom: 15, fontWeight: 500, textTransform: 'uppercase' }}>Subjects</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
             <Link to="/category/se" className="nav-item" style={{ fontSize: 14 }}>Software Engineering</Link>
             <Link to="/category/cloud" className="nav-item" style={{ fontSize: 14 }}>Cloud Computing</Link>
             <Link to="/category/devops" className="nav-item" style={{ fontSize: 14 }}>DevOps</Link>
          </div>
        </div>
        <div style={{ gridColumn: 'span 2', background: '#f5f5f7', borderRadius: 18, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3 style={{ fontSize: 19, fontWeight: 600, margin: '0 0 8px' }}>Flobit Academy</h3>
                <p style={{ fontSize: 14, color: '#86868b', margin: 0 }}>Join the future of Sri Lankan tech education.</p>
            </div>
            <Sparkles color="#ff073a" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Apple-Style Header ──────────────────────────────────────────────────
function Header() {
  const [userData, setUserData] = useState(null);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [signInTip, setSignInTip] = useState(null);
  const [signUpTip, setSignUpTip] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Scroll Listener
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // 2. Auth Logic (from local storage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUserData(JSON.parse(storedUser)); } catch (e) { console.error(e); }
    } else {
        // Show tips only if logged out
        const t1 = setTimeout(() => setSignInTip(SIGN_IN_TIPS[0]), 2500);
        const t2 = setTimeout(() => setSignUpTip(SIGN_UP_TIPS[0]), 3500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <nav 
        className="apple-header"
        style={{
          position: 'sticky', top: 0, zIndex: 9999,
          width: '100%', height: 48,
          background: scrolled || exploreOpen ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          transition: 'background 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: 1024, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 48, padding: '0 20px',
        }}>
          
          {/* Logo */}
          <Link to="/" style={{ 
            textDecoration: 'none', 
            color: '#ff073a', 
            fontSize: 18, 
            fontWeight: 700, 
            letterSpacing: '-0.03em',
            animation: 'appleLogoScale 0.5s ease'
          }}>
            Studly
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link to="/allCourses" className="nav-item">Courses</Link>
            
            <div 
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
              style={{ height: 48, display: 'flex', alignItems: 'center' }}
            >
              <button style={{ 
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4
              }} className="nav-item">
                Explore <ChevronDown size={12} style={{ transform: exploreOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
              </button>
              {exploreOpen && <ExploreDropdown />}
            </div>
          </div>

          {/* Search Bar Logic */}
          <div style={{ position: 'relative', width: 220 }}>
              <input 
                className="apple-search-input"
                type="text" 
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/search?q=${searchQuery}`)}
                style={{
                    width: '100%', padding: '6px 12px 6px 32px',
                    borderRadius: 8, fontSize: 13, outline: 'none'
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#86868b' }} />
          </div>

          {/* Auth Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {userData ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <Link to={`/userprofile/${userData._id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ 
                        width: 28, height: 28, borderRadius: '50%', background: '#f5f5f7',
                        border: '1px solid #d2d2d7', overflow: 'hidden'
                    }}>
                        {userData.profilePicture ? <img src={userData.profilePicture} alt="User" style={{ width: '100%' }} /> : <User size={16} color="#86868b" style={{ margin: 5 }} />}
                    </div>
                 </Link>
                 <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff3b30' }}>Logout</button>
              </div>
            ) : (
              <>
                <div style={{ position: 'relative' }}>
                    <Link to="/login" className="nav-item">Sign In</Link>
                    <AuthNotification message={signInTip} onClose={() => setSignInTip(null)} side="left" />
                </div>
                <div style={{ position: 'relative' }}>
                    <Link to="/signup" className="nav-item" style={{ 
                        background: '#1d1d1f', color: '#fff', padding: '4px 12px', borderRadius: 99, opacity: 1 
                    }}>Join Free</Link>
                    <AuthNotification message={signUpTip} onClose={() => setSignUpTip(null)} side="right" />
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;