import React from 'react';
import sm6 from '../../../../assets/sm10.jpg'
import sm8 from '../../../../assets/sm8.jpg'
const FeaturesSection = () => {
  return (
    <section className="py-24 bg-[#F5F5F7]">
      <div className="max-w-[1260px] mx-auto px-6">
        
        {/* Main Title */}
        <h2 className="text-[56px] md:text-[72px] font-semibold text-[#1d1d1f] mb-12 tracking-tight">
          Switch to  <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(97deg, #0096ff, #bb64ff 42%, #f2416b 74%, #eb7500)"
            }}
          >
            Studly
          </span> 
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          
          {/* Left Card: Trade-in Style */}
          <div className="bg-white rounded-[48px] overflow-hidden flex flex-col items-center pt-20 px-8 transition-transform duration-500 hover:scale-[1.01] shadow-sm">
            <div className="text-center max-w-[440px] mb-12">
              <h3 className="text-[40px] font-semibold text-[#1d1d1f] leading-[1.1] mb-6">
                Give us the old. Save on the new.
              </h3>
              <p className="text-[#86868b] text-[19px] leading-relaxed mb-6 font-medium">
                With Studly Migration, you can import your old course data and apply it toward a new premium plan. If your data isn't compatible, we'll help you sync for free.
              </p>
              <a href="#" className="text-[#0066cc] text-[19px] hover:underline flex items-center justify-center gap-1 group">
                See what your data is worth
                <svg className="w-4 h-4 mt-0.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            {/* HD Migration Visual */}
            <div className="mt-auto w-full max-w-[580px]">
              <img 
                src={sm6}
                alt="Migration" 
                className="w-full h-auto object-cover rounded-t-2xl shadow-2xl translate-y-4"
              />
            </div>
          </div>

          {/* Right Card: Full Dashboard Style */}
          <div className="bg-white rounded-[48px] overflow-hidden flex flex-col pt-20 transition-transform duration-500 hover:scale-[1.01] shadow-sm">
            <div className="text-center px-8 mb-12">
              <h3 className="text-[40px] font-semibold text-[#1d1d1f] leading-[1.1] mb-4">
                Studly does that.
              </h3>
              <p className="text-[#86868b] text-[19px] font-medium mb-6">
                See how easy it is to manage your academy.
              </p>
              <a href="#" className="text-[#0066cc] text-[19px] hover:underline flex items-center justify-center gap-1 group">
                Learn more
                <svg className="w-4 h-4 mt-0.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* HD Dashboard Visual - Full Bleed */}
            <div className="relative mt-auto">
              <img 
                src={sm8}
                alt="LMS Dashboard" 
                className="w-full h-auto object-cover"
              />
              {/* Overlay for that specific "OS" look */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;