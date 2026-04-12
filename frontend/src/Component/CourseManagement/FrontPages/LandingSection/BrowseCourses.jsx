import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import Header from '../HeaderSection/Header';
import FAQSection from './Questions';
import Footer from './Footer';

const CourseCard = ({ course }) => {
  return (
    <div className="flex flex-col items-center text-center min-w-[320px] max-w-[380px] px-4 group">
      {/* Image Container */}
      <div className="w-full aspect-[4/3] bg-[#f5f5f7] rounded-3xl overflow-hidden mb-8 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
        {course.coverImage ? (
          <img 
            src={course.coverImage} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-7xl">{course.emoji || '🎓'}</span>
        )}
      </div>

      {/* Color Dots */}
      <div className="flex gap-2 mb-4">
        <span className="w-3 h-3 rounded-full bg-slate-300 shadow-inner"></span>
        <span className="w-3 h-3 rounded-full bg-blue-200 shadow-inner"></span>
        <span className="w-3 h-3 rounded-full bg-slate-800 shadow-inner"></span>
      </div>

      <span className="text-[#bf4800] text-xs font-semibold mb-1">New</span>
      <h3 className="text-[28px] font-semibold text-[#1d1d1f] leading-tight mb-2">
        {course.title}
      </h3>
      <p className="text-[#1d1d1f] text-[17px] mb-4 h-12 line-clamp-2 px-4">
        {course.description}
      </p>

      <div className="text-[17px] text-[#1d1d1f] mb-8">
        From {course.price === 0 ? 'Free' : `${course.currency || '$'}${course.price}`}
      </div>

      <div className="flex items-center gap-6">
        <Link to="/allcourses">
  <button className="bg-[#000000] hover:bg-[#0077ed] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
    Learn more
  </button>
</Link>
        <button className="text-[#0066cc] hover:underline text-sm flex items-center gap-1 group/link font-medium">
          Enroll <span className="text-xs transition-transform group-hover/link:translate-x-0.5">›</span>
        </button>
      </div>
    </div>
  );
};

function BrowseCourses() {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('All courses');
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/courses');
        const result = await res.json();
        setData(result.data || []);
      } catch (e) { console.error(e); }
    };
    fetchCourses();
  }, []);

  const tabs = ['All courses', 'Design', 'Engineering', 'Marketing', 'Business'];

  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden">
      
      <Header />

    

      {/* 3. Main Hero Title Section */}
      <header className="pt-20 pb-10 text-center">
        <h1 className="text-[48px] md:text-[64px] font-semibold text-[#1d1d1f] tracking-tight">
          Browse <span className="bg-gradient-to-r from-[#ff2d55] via-[#ff3b30] to-[#ff9500] bg-clip-text text-transparent font-semibold">
  Courses
</span>
        </h1>
        <p className="text-[24px] text-[#6e6e73] mt-2 font-medium">
          The best way to learn what you love.
        </p>
      </header>

      {/* 4. Filter Navigation (The Pill Bar) */}
      <div className="flex justify-center mb-20 mt-4">
        <div className="bg-[#f5f5f7]/80 backdrop-blur-md p-1.5 rounded-full flex gap-1 border border-black/5 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-[13px] font-medium transition-all duration-300 ${
                activeTab === tab 
                ? 'bg-white text-black shadow-sm ring-1 ring-black/5' 
                : 'text-[#6e6e73] hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Product Grid/Slider */}
      <div className="relative max-w-[1440px] mx-auto px-10 pb-32">
        <div 
          ref={sliderRef}
          className="flex gap-16 overflow-x-auto pb-10 no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {data.length > 0 ? (
            data.map((course) => (
              <div key={course.id} className="snap-center">
                <CourseCard course={course} />
              </div>
            ))
          ) : (
            <div className="w-full text-center text-slate-400 py-20">Loading courses...</div>
          )}
        </div>
      </div>

      {/* Footer Section Style */}
      <section className="bg-[#f5f5f7] py-24 text-center">
        <h2 className="text-4xl font-semibold mb-4">Which course is right for you?</h2>
        <Link to="/compare">
  <button className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
    Compare Courses
  </button>
</Link>
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        body { -webkit-font-smoothing: antialiased; }
      `}</style>
      <FAQSection/>
      <Footer />
    </div>
  );
}

export default BrowseCourses;