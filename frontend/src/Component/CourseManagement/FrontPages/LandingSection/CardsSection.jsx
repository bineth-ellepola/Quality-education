import React from 'react';
import sm1 from '../../../../assets/sm1.jpg'
import sm2 from '../../../../assets/sm2.jpg'
import sm4 from '../../../../assets/sm4.jpg'
import sm3 from '../../../../assets/sm3.jpg'
const features = [
  {
    category: "AI-Powered Learning",
    title: "Personalized paths for every student.",
    desc: "Personalized learning paths crafted by AI that adapt to your pace and style.",
    image: sm1, 
    width: "w-[440px]"
  },
  {
    category: "Real-time Analytics",
    title: "Track progress with precision.",
    desc: "Track every learner's progress with detailed dashboards and actionable insights.",
    image:  sm2,
    width: "w-[440px]"
  },
  {
    category: "Live Collaboration",
    title: "Classrooms without borders.",
    desc: "Interactive classrooms, group projects, and peer reviews — all in one place.",
    image: sm4,
    width: "w-[440px]"
  },
  {
    category: "Mobile Learning",
    title: "Study on any device, anywhere.",
    desc: "Fully responsive — desktop, tablet, mobile. Learning never stops.",
    image: sm3,
    width: "w-[440px]"
  }
];

function ProfessionalFeatures() {
  return (
    <section className="py-24 bg-[#F5F5F7] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Apple-Style Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-[48px] md:text-[56px] font-semibold text-[#1d1d1f] leading-[1.1] tracking-tight">
              Why  <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(97deg, #0096ff, #bb64ff 42%, #f2416b 74%, #eb7500)"
            }}
          >
            Studly
          </span>  is the best <br /> place to <span className="text-[#615d90]">Learn</span> ?
            </h2>
          </div>
          <div className="mt-4 md:mt-0">
            <a href="/browse" className="text-[#0066cc] hover:underline flex items-center gap-1 text-lg font-normal">
              Shop Courses 
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Apple-Style Card Row */}
        <div className="flex gap-7 overflow-x-auto pb-12 no-scrollbar snap-x">
          {features.map((f, idx) => (
            <div 
              key={idx}
              className={`${f.width} flex-shrink-0 bg-white rounded-[32px] p-10 flex flex-col justify-between h-[620px] shadow-sm hover:shadow-md transition-shadow duration-500 snap-start relative group cursor-pointer`}
            >
              {/* Text Content */}
              <div className="relative z-10">
                <span className="text-[#86868b] text-sm font-semibold tracking-tight block mb-2">
                  {f.category}
                </span>
                <h3 className="text-[28px] font-semibold text-[#1d1d1f] leading-tight mb-4">
                  {f.title}
                </h3>
                <p className="text-[#86868b] text-[17px] font-normal leading-relaxed pr-4">
                  {f.desc}
                </p>
              </div>

              {/* Dashboard Image - Positioned like the iPad visuals */}
              <div className="relative mt-8 h-full flex items-center justify-center overflow-hidden">
                <img 
                  src={f.image} 
                  alt={f.title} 
                  className="w-[90%] h-auto rounded-xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              </div>

              {/* Iconic Plus Button */}
              <div className="absolute bottom-8 right-8">
                <button className="w-10 h-10 bg-[#1d1d1f] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

export default ProfessionalFeatures;