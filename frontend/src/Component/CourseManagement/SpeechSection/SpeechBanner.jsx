import React from 'react';
import nw9 from '../../../assets/il5.jpg'
import ielts from '../../../assets/il2.webp'
import nw11 from '../../../assets/il3.jpg'

const SpeechBanner = () => {
  return (
    <section className="bg-white py-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Heading with 4-stop gradient */}
        <h1 className="text-6xl md:text-[80px] font-bold tracking-tight text-[#1d1d1f] mb-6 leading-[1.1]">
          Learn English for <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(97deg, #0096ff, #bb64ff 42%, #f2416b 74%, #eb7500)"
            }}
          >
            IELTS Standards.
          </span>
        </h1>

        {/* Subtext */}
        <p className="max-w-3xl mx-auto text-[24px] md:text-[28px] leading-tight font-semibold text-[#1d1d1f] mb-6">
          Apple Intelligence is the personal intelligence system that helps you write, express 
          yourself, and get things done.<sup>3</sup> And it comes fully integrated into MacBook Neo.
        </p>

        {/* The Link Section */}
        <div className="mb-16">
          <a 
            href="/speech" 
            className="text-[21px] text-[#0066cc] hover:underline flex items-center justify-center gap-1 font-normal"
          >
            Try Studly self-learning platform
            <span className="text-[14px] pt-1">▶</span>
          </a>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Writing Tools */}
          <div className="relative h-[750px] rounded-[32px] overflow-hidden bg-gradient-to-br from-[#b19fff] via-[#d7ccff] to-[#f8f8ff] flex items-center justify-center">
  
  <img
    src={nw9}
    alt="card"
    className="absolute inset-0 w-full h-full object-cover"
  />

</div>

          {/* Column 2: Intelligence Orb */}
          <div className="h-[750px] rounded-[32px] bg-[#f5f5f7] flex items-center justify-center relative overflow-hidden">
                  {/* Column 1: Writing Tools */}
           
  
  <img
    src={ielts}
    alt="card"
    className="absolute inset-0 w-full h-full object-cover"
  />

 
          </div>

          {/* Column 3: Clean Up */}
          <div className="h-[750px] rounded-[32px] overflow-hidden relative group">
                   {/* Column 1: Writing Tools */}
          <div className="relative h-[750px] rounded-[32px] overflow-hidden bg-gradient-to-br from-[#b19fff] via-[#d7ccff] to-[#f8f8ff] flex items-center justify-center">
  
  <img
    src={nw11}
    alt="card"
    className="absolute inset-0 w-full h-full object-cover"
  />

</div>
            {/* The circular 'Cleaning' highlighter */}
            <div className="absolute top-1/4 left-1/4 w-24 h-24 border-[6px] border-white/30 rounded-full bg-white/10 backdrop-blur-sm shadow-[0_0_40px_rgba(255,255,255,0.3)]"></div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full text-white font-medium">
                    Clean Up
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SpeechBanner;