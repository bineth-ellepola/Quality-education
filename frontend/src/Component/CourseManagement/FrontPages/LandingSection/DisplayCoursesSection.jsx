import React, { useEffect, useState, useRef, useMemo } from 'react';

const LEVEL_COLORS = { Beginner: '#10b981', Intermediate: '#f59e0b', Advanced: '#ef4444' };
const SUBJECT_BG = { Design:'#f0f9ff', Engineering:'#eff6ff', Data:'#fef3c7', Product:'#fdf2f8', Marketing:'#fff7ed', Business:'#f5f3ff' };

const getInitials = (name='') => name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
const getBg = (subjectName) => SUBJECT_BG[subjectName] || '#f8fafc';

const CourseCard = ({ course }) => {
  const subjectName = course.subject?.name || 'General';
  const instructorName = course.instructor?.name || 'Instructor';
  const profilePicture = course.instructor?.profilePicture
  
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-5 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 cursor-pointer flex-shrink-0 w-[340px]">
      {/* Image Container */}
      <div className="relative h-52 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
        {course.coverImage ? (
          <img 
            src={course.coverImage} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl" style={{background: getBg(subjectName)}}>
            {course.emoji || '🎓'}
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest bg-white/95 backdrop-blur shadow-md text-slate-800">
            {subjectName}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow px-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-md border" 
                style={{borderColor: LEVEL_COLORS[course.level] + '30', color: LEVEL_COLORS[course.level], backgroundColor: LEVEL_COLORS[course.level] + '05'}}>
            <span className="w-2 h-2 rounded-full" style={{background: LEVEL_COLORS[course.level]}}/>
            {course.level}
          </span>
          <span className="text-slate-400 text-[12px] font-semibold tracking-tight uppercase">
            {course.duration} Hours
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="mt-2 text-[15px] text-slate-500 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Instructor & Rating */}
        <div className="mt-6 flex items-center gap-3 border-t border-slate-50 pt-5">
          <div className="flex items-center gap-3">
  <img
    src={profilePicture}
    alt={instructorName}
    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 shadow-sm"
  />

  <div className="flex flex-col">
    <span className="text-[14px] font-semibold text-slate-900 leading-tight">
      {instructorName}
    </span>

    <div className="flex items-center gap-1 mt-1">
      <span className="text-yellow-400 text-[14px]">★</span>
      <span className="text-[13px] font-medium text-slate-500">
        {course.averageRating || "4.5"}
      </span>
    </div>
  </div>
</div>
          <div className="ml-auto text-right">
             <span className={`text-xl font-black ${course.price === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {course.price === 0 ? 'Free' : `${course.currency || '$'}${course.price}`}
             </span>
          </div>
        </div>
      </div>

     <button className="w-full py-3 bg-gradient-to-r from-[#000000] via-[#000000] to-[#000000] hover:opacity-90 text-white text-[13px] font-semibold tracking-wide rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
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

  // Example Category Titles for the right side
  const categories = ["Design", "Dev", "Business", "Marketing"];

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

    const SPEED = 0.5;
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
    const offset = direction === 'left' ? -380 : 380;
    sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    posRef.current += offset;
  };

  if (loading) return <div className="h-[500px] w-full bg-slate-50 animate-pulse rounded-3xl" />;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-12">
      {/* Header with Integrated Titles */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="space-y-2">
          <h2 className="text-[54px] md:text-[59px] font-semibold text-[#615d90] leading-[1.1] tracking-tight">
            Popular <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(97deg, #0096ff, #bb64ff 42%, #f2416b 74%, #eb7500)"
            }}
          >
            Courses
          </span>  
          </h2>
          <p className="text-slate-500 text-lg font-medium">
            Learn from the world's best instructors.
          </p>
        </div>

        {/* Right Side Category Titles & See All Link */}
        <div className="flex flex-wrap items-center gap-4 md:justify-end">
          <div className="hidden lg:flex items-center gap-4 mr-4">
            {categories.map((cat) => (
              <span key={cat} className="text-sm font-bold text-slate-400 hover:text-slate-900 cursor-pointer transition-colors uppercase tracking-widest">
                {cat}
              </span>
            ))}
          </div>
          
          <a 
            href="/allCourses" 
            className="group flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-600 rounded-full font-bold text-sm hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            SEE ALL COURSES
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Slider Section */}
      <div className="relative group/slider">
        {/* Navigation Arrows */}
        <button 
          onClick={() => scrollManual('left')}
          className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center border border-slate-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 hidden lg:flex"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button 
          onClick={() => scrollManual('right')}
          className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white shadow-2xl rounded-full flex items-center justify-center border border-slate-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 hidden lg:flex"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </button>

        <div 
          ref={sliderRef}
          onMouseEnter={() => isHoveredRef.current = true}
          onMouseLeave={() => isHoveredRef.current = false}
          className="flex gap-8 overflow-x-auto pb-10 pt-2 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {infiniteCourses.map((course, i) => (
            <CourseCard key={`${course.id}-${i}`} course={course} />
          ))}
        </div>
      </div>
      
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default CourseFetch;