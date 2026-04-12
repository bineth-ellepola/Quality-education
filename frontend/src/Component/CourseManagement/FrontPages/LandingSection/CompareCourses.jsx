import React, { useEffect, useState } from 'react';
import Header from '../HeaderSection/Header';
import Footer from './Footer';

const CompareCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([null, null, null]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/courses');
        const result = await res.json();
        setCourses(result.data || []);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    };
    fetchCourses();
  }, []);

  const handleSelect = (index, id) => {
    const newSelection = [...selectedIds];
    newSelection[index] = id;
    setSelectedIds(newSelection);
  };

  const getSelectedCourse = (id) => courses.find((c) => c.id === id);

  const renderSpecValue = (course, featureKey) => {
    if (!course) return <span className="text-[#d2d2d7]">—</span>;
    const value = course[featureKey];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value.name || '—';
    }

    if (featureKey === 'price') {
      return value === 0 ? 'Free' : `${course.currency || '$'}${value}`;
    }

    return value || '—';
  };

  const SpecRow = ({ label, featureKey, isBold = false }) => (
    <div className="border-b border-[#d2d2d7] py-12 md:py-16">
      <div className="grid grid-cols-3 w-full gap-8 md:gap-12">
        {selectedIds.map((id, idx) => {
          const course = getSelectedCourse(id);
          return (
            <div key={idx} className="flex flex-col items-center text-center">
              {/* Only show label on the first row or as a repeating header if you prefer, 
                  but Apple usually puts it once or subtly above each value */}
              <span className="text-[#6e6e73] text-[11px] md:text-[12px] uppercase font-semibold tracking-widest mb-6 opacity-80">
                {idx === 1 ? label : ""} 
              </span>
              <div className={`transition-all duration-500 max-w-[280px] ${
                isBold ? 'font-semibold text-[20px] md:text-[24px] text-[#1d1d1f] tracking-tight' : 'text-[17px] text-[#1d1d1f] leading-snug'
              }`}>
                {renderSpecValue(course, featureKey)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans antialiased text-[#1d1d1f]">
      <Header />

      <main className="max-w-[1100px] mx-auto px-6">
        {/* Hero Header */}
        <header className="pt-32 pb-20 border-b border-[#d2d2d7]">
          <h1 className="text-[56px] md:text-[80px] font-semibold tracking-tighter leading-[1.1]">
            Compare Courses.
          </h1>
          <p className="text-[24px] md:text-[28px] text-[#6e6e73] font-medium mt-4 tracking-tight">
            Find the path that's right for you.
          </p>
        </header>

        {/* Sticky Comparison Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-50 pt-12 pb-8 border-b border-[#d2d2d7]">
          <div className="grid grid-cols-3 gap-8 md:gap-12">
            {[0, 1, 2].map((index) => {
              const course = getSelectedCourse(selectedIds[index]);
              return (
                <div key={index} className="flex flex-col items-center group">
                  {/* Product Visual */}
                  <div className="w-24 h-24 md:w-40 md:h-40 bg-[#f5f5f7] rounded-3xl mb-8 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105 shadow-sm">
                    {course?.coverImage ? (
                      <img src={course.coverImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="text-5xl">{course?.emoji || ' '}</span>
                    )}
                  </div>

                  {/* Dropdown Selector */}
                  <div className="relative w-full px-2">
                    <select
                      className="w-full bg-transparent text-[17px] md:text-[19px] font-semibold text-center focus:outline-none appearance-none cursor-pointer text-[#0066cc] hover:text-[#0071e3] transition-colors"
                      onChange={(e) => handleSelect(index, e.target.value)}
                      value={selectedIds[index] || ""}
                    >
                      <option value="" disabled>Choose a course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id} className="text-black">{c.title}</option>
                      ))}
                    </select>
                    <div className="text-[#0066cc] text-[12px] mt-1 flex justify-center pointer-events-none">
                      <span className="border-b border-[#0066cc] border-opacity-30">Change course</span>
                    </div>
                  </div>

                  {course && (
                    <button className="mt-6 bg-[#0071e3] text-white px-5 py-2 rounded-full text-[14px] font-medium hover:bg-[#0077ed] transition-all transform active:scale-95">
                      Buy/Enroll
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Specs */}
        <div className="pb-32">
          <SpecRow label="Level" featureKey="level" isBold={true} />
          <SpecRow label="Category" featureKey="subject" />
          <SpecRow label="Time Commitment" featureKey="duration" />
          <SpecRow label="Lead Expert" featureKey="instructor" />
          <SpecRow label="Investment" featureKey="price" />

          {/* Detailed Overview Row */}
          <div className="py-20">
             <div className="grid grid-cols-3 w-full gap-8 md:gap-12">
              {selectedIds.map((id, idx) => (
                <div key={idx} className="flex flex-col items-center">
                   <span className="text-[#6e6e73] text-[12px] uppercase font-semibold tracking-widest mb-6 opacity-80">
                    {idx === 1 ? "Overview" : ""}
                  </span>
                  <p className="text-center text-[17px] leading-relaxed text-[#1d1d1f] font-normal">
                    {getSelectedCourse(id)?.description || ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer Section */}
      <footer className="bg-[#f5f5f7] py-40 border-t border-[#d2d2d7]">
        <div className="max-w-[800px] mx-auto text-center px-6">
          <h2 className="text-[40px] md:text-[48px] font-semibold tracking-tight mb-4">Still deciding?</h2>
          <p className="text-[#6e6e73] text-[19px] md:text-[21px] mb-10 leading-relaxed">
            Our advisors are here to help you choose the right path for your career goals.
          </p>
          <a href="#" className="text-[#0066cc] text-[21px] font-medium hover:underline flex items-center justify-center group">
            Chat with a specialist 
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">›</span>
          </a>
        </div>
      </footer>

      <style jsx>{`
        select {
          text-align-last: center;
          -moz-appearance: none;
          -webkit-appearance: none;
        }
        body {
          letter-spacing: -0.015em;
        }
      `}</style>
      <Footer/>
    </div>
  );
};

export default CompareCourses;