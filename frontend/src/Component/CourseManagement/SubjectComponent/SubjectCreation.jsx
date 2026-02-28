import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../AppProvider';
import axios from 'axios';
import { 
  Loader2, CheckCircle2, AlertCircle, X, Edit2, Trash2, 
  MoreVertical, Search, Plus, Zap, BookOpen, ChevronRight,
  ArrowUpRight, Filter, Grid, List
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import s1 from '../../../assets/s1.mp3'

/* ─── Design tokens ─────────────────────────────── */
const C = {
  black:   '#0A0A0A',
  white:   '#FFFFFF',
  slate:   '#F4F4F5',
  line:    '#E8E8EC',
  muted:   '#9B9BA4',
  accent:  '#2563EB',   // professional blue
  accentL: '#EFF4FF',
  danger:  '#DC2626',
  dangerL: '#FEF2F2',
  success: '#16A34A',
};

/* ─── Minimal skeleton loader ────────────────────── */
const Skeleton = ({ w = '100%', h = 20, r = 8 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: `linear-gradient(90deg, ${C.slate} 25%, #ECECEF 50%, ${C.slate} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
);

/* ─── Toast ──────────────────────────────────────── */
const Toast = ({ t, onClose }) => (
  <motion.div
    key={t.id}
    layout
    initial={{ y: -16, opacity: 0, scale: 0.97 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: -10, opacity: 0, scale: 0.96 }}
    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: C.black, color: C.white,
      padding: '12px 18px', borderRadius: 12,
      minWidth: 280, maxWidth: 360,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      borderLeft: `3px solid ${t.type === 'success' ? C.success : C.danger}`,
      fontFamily: 'inherit',
    }}
  >
    {t.type === 'success'
      ? <CheckCircle2 size={16} color={C.success} />
      : <AlertCircle size={16} color={C.danger} />}
    <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', flex: 1 }}>{t.message}</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 0, display: 'flex' }}>
      <X size={14} />
    </button>
  </motion.div>
);

/* ─── Label ──────────────────────────────────────── */
const Label = ({ children }) => (
  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: C.muted, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
    {children}
  </span>
);

/* ─── Input ──────────────────────────────────────── */
const Input = ({ style = {}, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      style={{
        width: '100%', boxSizing: 'border-box',
        border: `1.5px solid ${focused ? C.accent : C.line}`,
        borderRadius: 10, padding: '11px 14px',
        fontSize: 14, fontWeight: 400,
        color: C.black, background: C.white,
        outline: 'none', transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: focused ? `0 0 0 3px ${C.accentL}` : 'none',
        fontFamily: 'inherit',
        ...style,
      }}
    />
  );
};

/* ─── Textarea ───────────────────────────────────── */
const Textarea = ({ style = {}, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      onFocus={e => { setFocused(true); props.onFocus?.(e); }}
      onBlur={e => { setFocused(false); props.onBlur?.(e); }}
      style={{
        width: '100%', boxSizing: 'border-box', resize: 'none',
        border: `1.5px solid ${focused ? C.accent : C.line}`,
        borderRadius: 10, padding: '11px 14px',
        fontSize: 14, fontWeight: 400, color: C.black,
        background: C.white, outline: 'none',
        transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: focused ? `0 0 0 3px ${C.accentL}` : 'none',
        fontFamily: 'inherit', lineHeight: 1.6,
        ...style,
      }}
    />
  );
};

/* ─── Segment buttons ────────────────────────────── */
const SegmentGroup = ({ options, value, onChange }) => (
  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
    {options.map(opt => (
      <button
        key={opt} type="button" onClick={() => onChange(opt)}
        style={{
          padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
          fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', border: `1.5px solid ${value === opt ? C.accent : C.line}`,
          background: value === opt ? C.accentL : C.white,
          color: value === opt ? C.accent : C.muted,
          transition: 'all 0.15s', fontFamily: 'inherit',
        }}
      >{opt}</button>
    ))}
  </div>
);

/* ─── Level badge ────────────────────────────────── */
const LevelBadge = ({ level }) => {
  const map = {
    beginner:     { bg: '#F0FDF4', color: '#16A34A' },
    intermediate: { bg: '#FFFBEB', color: '#D97706' },
    advanced:     { bg: '#FFF1F2', color: '#E11D48' },
    all:          { bg: C.slate,   color: C.muted   },
  };
  const s = map[level] || map.all;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6 }}>
      {level}
    </span>
  );
};

/* ─── Category badge ─────────────────────────────── */
const CatBadge = ({ cat }) => (
  <span style={{ background: C.slate, color: C.muted, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6 }}>
    {cat}
  </span>
);

/* ─── Empty state ────────────────────────────────── */
const EmptyState = ({ onAdd }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', gap: 16 }}
  >
    <div style={{ width: 56, height: 56, borderRadius: 16, background: C.slate, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <BookOpen size={24} color={C.muted} />
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontWeight: 600, fontSize: 16, color: C.black, margin: '0 0 4px' }}>No subjects yet</p>
      <p style={{ fontWeight: 400, fontSize: 13, color: C.muted, margin: 0 }}>Create your first subject to populate the catalog.</p>
    </div>
    <button onClick={onAdd} style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, background: C.black, color: C.white, border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
      <Plus size={16} /> Add Subject
    </button>
  </motion.div>
);

/* ─── Card skeleton ──────────────────────────────── */
const CardSkeleton = () => (
  <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
      <Skeleton w={60} h={22} r={6} />
      <Skeleton w={28} h={28} r={8} />
    </div>
    <Skeleton w="70%" h={20} r={6} />
    <div style={{ margin: '8px 0 4px' }}><Skeleton w="45%" h={12} r={4} /></div>
    <div style={{ marginTop: 10 }}>
      <Skeleton w="100%" h={12} r={4} />
      <div style={{ marginTop: 6 }}><Skeleton w="80%" h={12} r={4} /></div>
    </div>
    <div style={{ display: 'flex', gap: 6, marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
      <Skeleton w={60} h={20} r={6} />
      <Skeleton w={60} h={20} r={6} />
    </div>
  </div>
);

/* ─── Confirm dialog ─────────────────────────────── */
const ConfirmDialog = ({ open, onConfirm, onCancel, name }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', zIndex: 300 }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: C.white, borderRadius: 16, padding: 32, width: 360,
            zIndex: 310, boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.dangerL, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Trash2 size={20} color={C.danger} />
          </div>
          <p style={{ fontWeight: 600, fontSize: 16, color: C.black, margin: '0 0 6px' }}>Delete subject?</p>
          <p style={{ fontWeight: 400, fontSize: 13, color: C.muted, margin: '0 0 24px', lineHeight: 1.6 }}>
            <strong style={{ color: C.black }}>{name}</strong> will be permanently removed from the catalog.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1.5px solid ${C.line}`, background: C.white, color: C.black, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
            <button onClick={onConfirm} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', background: C.danger, color: C.white, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Delete</button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ══════════════════════════════════════════════════ */
/* ─── Main Component ─────────────────────────────── */
/* ══════════════════════════════════════════════════ */
const SubjectCreation = () => {
  const { user } = useAppContext();
  const [form, setForm] = useState({ name: '', code: '', description: '', level: 'all', categoryType: 'skill-based', isFeatured: false, sortOrder: 0 });
  const [subjects, setSubjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const searchRef = useRef(null);

  const token = localStorage.getItem('token');
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const fetchSubjects = async () => {
    setFetching(true);
    try {
      const res = await axios.get('http://localhost:5001/api/subjects', { headers: { Authorization: `Bearer ${token}` } });
      setSubjects(res.data.subjects || []);
    } catch {
      addToast('error', 'Failed to load subjects');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5001/api/subjects/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
        addToast('success', 'Subject updated');
      } else {
        await axios.post('http://localhost:5001/api/subjects', form, { headers: { Authorization: `Bearer ${token}` } });
        const audio = new Audio(s1); // path to your sound file
        audio.play().catch(err => console.error('Audio play failed:', err));
        addToast('success', 'Subject published');
      }
      resetForm(); fetchSubjects(); setIsDrawerOpen(false);
    } catch (err) {
      addToast('error', err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ name: '', code: '', description: '', level: 'all', categoryType: 'skill-based', isFeatured: false, sortOrder: 0 });
    setEditingId(null);
  };

  const handleEdit = (sub) => { setForm(sub); setEditingId(sub._id); setIsDrawerOpen(true); setActiveMenuId(null); };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`http://localhost:5001/api/subjects/${deleteTarget._id}`, { headers: { Authorization: `Bearer ${token}` } });
      addToast('success', 'Subject removed');
      fetchSubjects();
    } catch { addToast('error', 'Delete failed'); }
    finally { setDeleteTarget(null); }
  };

  const filtered = subjects.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  /* ── styles ─────────────────────────────────────── */
  const cardBase = {
    background: C.white, border: `1px solid ${C.line}`,
    borderRadius: 16, padding: 24, display: 'flex',
    flexDirection: 'column', position: 'relative', cursor: 'default',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sub-card:hover { border-color: ${C.black} !important; box-shadow: 0 8px 32px rgba(0,0,0,0.07) !important; }
        .sub-card:hover .card-title { color: ${C.accent} !important; }
        .icon-btn:hover { background: ${C.slate} !important; }
        .pill-btn:hover { background: ${C.slate} !important; }
        .menu-item:hover { background: ${C.accentL} !important; color: ${C.accent} !important; }
        .menu-item-danger:hover { background: ${C.dangerL} !important; color: ${C.danger} !important; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 4px; }
      `}</style>

      {/* Toast layer */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <AnimatePresence>{toasts.map(t => <Toast key={t.id} t={t} onClose={() => setToasts(p => p.filter(x => x.id !== t.id))} />)}</AnimatePresence>
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog open={!!deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} name={deleteTarget?.name} />

      <div style={{ minHeight: '100vh', background: C.white, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 32px' }}>

          {/* ── Header ───────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
              Subject Catalog
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 600, color: C.black, margin: 0, lineHeight: 1.2 }}>
                  {user?.name ? `Hello, ${user.name}` : 'Catalog'}
                </h1>
                <p style={{ fontSize: 14, fontWeight: 400, color: C.muted, margin: '6px 0 0' }}>
                  {fetching ? 'Loading...' : `${subjects.length} subject${subjects.length !== 1 ? 's' : ''} in catalog`}
                </p>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { label: 'Total', value: subjects.length },
                  { label: 'Featured', value: subjects.filter(s => s.isFeatured).length },
                  { label: 'Advanced', value: subjects.filter(s => s.level === 'advanced').length },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 20, fontWeight: 600, color: C.black, margin: 0 }}>{fetching ? '—' : stat.value}</p>
                    <p style={{ fontSize: 11, fontWeight: 400, color: C.muted, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Toolbar ──────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320 }}>
              <Search size={15} color={C.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                ref={searchRef}
                type="text" placeholder="Search subjects..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10,
                  border: `1.5px solid ${C.line}`, borderRadius: 10, fontSize: 13, fontWeight: 400,
                  color: C.black, background: C.white, outline: 'none', fontFamily: 'inherit',
                  transition: 'border-color 0.18s',
                }}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => e.target.style.borderColor = C.line}
              />
            </div>

            {/* View toggles */}
            <div style={{ display: 'flex', border: `1.5px solid ${C.line}`, borderRadius: 10, overflow: 'hidden' }}>
              {[{ icon: Grid, id: 'grid' }, { icon: List, id: 'list' }].map(({ icon: Icon, id }) => (
                <button key={id} className="icon-btn"
                  onClick={() => setViewMode(id)}
                  style={{ padding: '8px 12px', border: 'none', cursor: 'pointer', background: viewMode === id ? C.slate : C.white, color: viewMode === id ? C.black : C.muted, transition: 'all 0.15s', display: 'flex' }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Add button */}
            <button
              onClick={() => { resetForm(); setIsDrawerOpen(true); }}
              style={{ display: 'flex', alignItems: 'center', gap: 7, background: C.black, color: C.white, border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'background 0.15s, transform 0.1s', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.black; }}
            >
              <Plus size={16} /> Add Subject
            </button>
          </motion.div>

          {/* ── Divider ──────────────────────────────── */}
          <div style={{ height: 1, background: C.line, marginBottom: 32 }} />

          {/* ── Cards grid / list ─────────────────────── */}
          {fetching ? (
            <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr', gap: 16 }}>
              {[1,2,3,4,5,6].map(n => <CardSkeleton key={n} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: 'grid' }}>
              <EmptyState onAdd={() => { resetForm(); setIsDrawerOpen(true); }} />
            </div>
          ) : (
            <motion.div
              style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr', gap: 16 }}
            >
              <AnimatePresence>
                {filtered.map((sub, i) => {
                  const isOwner = sub.createdBy?._id === currentUserId;
                  return (
                    <motion.div
                      key={sub._id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ delay: i * 0.04, duration: 0.28 }}
                      className="sub-card"
                      style={viewMode === 'list' ? { ...cardBase, flexDirection: 'row', alignItems: 'center', padding: '18px 24px', gap: 16 } : cardBase}
                    >
                      {viewMode === 'list' ? (
                        <>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                              <span className="card-title" style={{ fontSize: 15, fontWeight: 600, color: C.black, transition: 'color 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.name}</span>
                              {sub.isFeatured && <Zap size={13} color="#F59E0B" fill="#F59E0B" />}
                            </div>
                            <p style={{ fontSize: 12, fontWeight: 400, color: C.muted, margin: 0 }}>{sub.createdBy?.name || 'Unknown'}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: C.muted, background: C.slate, padding: '3px 8px', borderRadius: 6 }}>{sub.code || '—'}</span>
                            <LevelBadge level={sub.level} />
                            <CatBadge cat={sub.categoryType} />
                          </div>
                          {isOwner && (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="icon-btn" onClick={() => handleEdit(sub)} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, display: 'flex', transition: 'background 0.15s' }}><Edit2 size={15} /></button>
                              <button className="icon-btn" onClick={() => setDeleteTarget(sub)} style={{ padding: 8, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, display: 'flex', transition: 'background 0.15s' }}><Trash2 size={15} /></button>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500, color: C.muted, background: C.slate, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.04em' }}>
                              {sub.code || 'NO-CODE'}
                            </span>
                            {isOwner && (
                              <div style={{ position: 'relative' }}>
                                <button
                                  className="icon-btn"
                                  onClick={() => setActiveMenuId(activeMenuId === sub._id ? null : sub._id)}
                                  style={{ padding: 6, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, display: 'flex', transition: 'background 0.15s' }}
                                >
                                  <MoreVertical size={17} />
                                </button>
                                <AnimatePresence>
                                  {activeMenuId === sub._id && (
                                    <>
                                      <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setActiveMenuId(null)} />
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                        transition={{ duration: 0.12 }}
                                        style={{ position: 'absolute', right: 0, top: 36, width: 160, background: C.white, border: `1px solid ${C.line}`, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 20, overflow: 'hidden' }}
                                      >
                                        <button className="menu-item" onClick={() => handleEdit(sub)} style={{ width: '100%', padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: C.black, display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', transition: 'background 0.12s, color 0.12s', fontFamily: 'inherit' }}>
                                          <Edit2 size={13} /> Edit
                                        </button>
                                        <div style={{ height: 1, background: C.line }} />
                                        <button className="menu-item-danger" onClick={() => { setDeleteTarget(sub); setActiveMenuId(null); }} style={{ width: '100%', padding: '10px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: C.danger, display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', transition: 'background 0.12s', fontFamily: 'inherit' }}>
                                          <Trash2 size={13} /> Delete
                                        </button>
                                      </motion.div>
                                    </>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>

                          <h3 className="card-title" style={{ fontSize: 16, fontWeight: 600, color: C.black, margin: '0 0 4px', transition: 'color 0.2s', lineHeight: 1.3 }}>
                            {sub.name}
                          </h3>
                          <p style={{ fontSize: 11, fontWeight: 400, color: C.muted, margin: '0 0 10px' }}>
                            {sub.createdBy?.name || 'Unknown'}
                          </p>
                          <p style={{ fontSize: 13, fontWeight: 400, color: '#52525B', lineHeight: 1.65, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {sub.description || 'No description available for this subject.'}
                          </p>

                          <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockStart: 20 }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <LevelBadge level={sub.level} />
                              <CatBadge cat={sub.categoryType} />
                            </div>
                            {sub.isFeatured && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Zap size={12} color="#F59E0B" fill="#F59E0B" />
                                <span style={{ fontSize: 10, fontWeight: 600, color: '#D97706', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Featured</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* ══ Drawer ════════════════════════════════════ */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', zIndex: 110 }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              style={{ position: 'fixed', top: 0, right: 0, height: '100%', width: '100%', maxWidth: 480, background: C.white, zIndex: 120, display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Drawer header */}
              <div style={{ padding: '24px 28px', borderBottom: `1px solid ${C.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px' }}>
                    {editingId ? 'Edit' : 'New'}
                  </p>
                  <h2 style={{ fontSize: 20, fontWeight: 600, color: C.black, margin: 0 }}>
                    {editingId ? 'Modify Subject' : 'Add Subject'}
                  </h2>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="icon-btn"
                  style={{ padding: 8, borderRadius: 10, border: `1px solid ${C.line}`, background: C.white, cursor: 'pointer', display: 'flex', color: C.muted, transition: 'background 0.15s' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Drawer form */}
              <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                  <div>
                    <Label>Subject Name</Label>
                    <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Advanced Thermodynamics" style={{ fontSize: 15, fontWeight: 600 }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <Label>Reference Code</Label>
                      <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="SUB-001" style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }} />
                    </div>
                    <div>
                      <Label>Sort Weight</Label>
                      <Input type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <Label>Difficulty Tier</Label>
                    <SegmentGroup options={['beginner', 'intermediate', 'advanced', 'all']} value={form.level} onChange={v => setForm({ ...form, level: v })} />
                  </div>

                  <div>
                    <Label>Category Type</Label>
                    <SegmentGroup options={['skill-based', 'academic', 'professional', 'other']} value={form.categoryType} onChange={v => setForm({ ...form, categoryType: v })} />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the curriculum objectives and outcomes..." />
                  </div>

                  {/* Featured toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: C.slate, borderRadius: 12 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.black, margin: 0 }}>Mark as Featured</p>
                      <p style={{ fontSize: 11, fontWeight: 400, color: C.muted, margin: '2px 0 0' }}>Highlight this subject in listings</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none',
                        background: form.isFeatured ? C.accent : C.line,
                        cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 2, left: form.isFeatured ? 22 : 2,
                        width: 20, height: 20, borderRadius: 10, background: C.white,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.18)', transition: 'left 0.2s',
                      }} />
                    </button>
                  </div>

                </div>

                {/* Actions */}
                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    type="submit" disabled={loading}
                    style={{ width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', background: loading ? '#93C5FD' : C.accent, color: C.white, fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s', fontFamily: 'inherit' }}
                  >
                    {loading ? <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> : (editingId ? 'Save Changes' : 'Publish to Catalog')}
                  </button>
                  <button
                    type="button" onClick={() => setIsDrawerOpen(false)}
                    style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: `1.5px solid ${C.line}`, background: C.white, color: C.muted, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SubjectCreation;