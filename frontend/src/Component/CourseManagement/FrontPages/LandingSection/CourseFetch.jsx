import React, { useEffect, useState, useRef, useMemo } from 'react';

const LEVEL_COLORS = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' };
const SUBJECT_BG = { Design:'#f0f9ff', Engineering:'#eff6ff', Data:'#fef3c7', Product:'#fdf2f8', Marketing:'#fff7ed', Business:'#f5f3ff' };

const getInitials = (name='') => name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
const getBg = (subjectName) => SUBJECT_BG[subjectName] || '#f8fafc';

const CourseCard = ({ course }) => {
  const subjectName = course.subject?.name || 'General';
  const instructorName = course.instructor?.name || 'Instructor';
  
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer flex-shrink-0 w-[300px]">
      {/* Image Container */}
      <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
        {course.coverImage ? (
          <img 
            src={course.coverImage} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl" style={{background: getBg(subjectName)}}>
            {course.emoji || '🎓'}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur shadow-sm text-slate-700">
            {subjectName}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border" 
                style={{borderColor: LEVEL_COLORS[course.level] + '40', color: LEVEL_COLORS[course.level]}}>
            <span className="w-1.5 h-1.5 rounded-full" style={{background: LEVEL_COLORS[course.level]}}/>
            {course.level}
          </span>
          <span className="text-slate-400 text-[11px] font-medium">• {course.duration}h total</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Instructor & Rating */}
        <div className="mt-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
            {getInitials(instructorName)}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-slate-800 leading-none">{instructorName}</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-[12px]">★</span>
              <span className="text-[12px] font-medium text-slate-500">{course.averageRating}</span>
            </div>
          </div>
          <div className="ml-auto text-right">
             <span className={`text-lg font-bold ${course.price === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {course.price === 0 ? 'Free' : `${course.currency || '$'}${course.price}`}
             </span>
          </div>
        </div>
      </div>

      <button className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98]">
        View Course
      </button>
    </div>
  );
};

const CourseFetch = ({ limit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const posRef = useRef(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/courses');
        const result = await res.json();
        setData(result.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCourses();
  }, []);

  const displayedCourses = useMemo(() => limit ? data.slice(0, limit) : data, [data, limit]);
  const infiniteCourses = useMemo(() => [...displayedCourses, ...displayedCourses], [displayedCourses]);

  useEffect(() => {
    if (loading || !sliderRef.current || data.length === 0) return;

    const SPEED = 0.6;
    const tick = () => {
      if (!isHoveredRef.current && sliderRef.current) {
        posRef.current += SPEED;
        if (posRef.current >= sliderRef.current.scrollWidth / 2) {
          posRef.current = 0;
        }
        sliderRef.current.scrollLeft = posRef.current;
      }
      requestAnimationFrame(tick);
    };

    const animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
  }, [loading, data]);

  const scrollManual = (direction) => {
    const offset = direction === 'left' ? -340 : 340;
    sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    posRef.current += offset; // Sync the auto-scroller position
  };

  if (loading) return <div className="flex gap-6 overflow-hidden"> {/* Add skeletons here */} </div>;

  return (
    <div className="relative group/slider">
      {/* Navigation Arrows */}
      <button 
        onClick={() => scrollManual('left')}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-all opacity-0 group-hover/slider:opacity-100"
      >
        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      <button 
        onClick={() => scrollManual('right')}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-all opacity-0 group-hover/slider:opacity-100"
      >
        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Slider */}
      <div 
        ref={sliderRef}
        onMouseEnter={() => isHoveredRef.current = true}
        onMouseLeave={() => isHoveredRef.current = false}
        className="flex gap-6 overflow-x-auto pb-8 pt-4 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {infiniteCourses.map((course, i) => (
          <CourseCard key={`${course.id}-${i}`} course={course} />
        ))}
      </div>
      
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default CourseFetch;