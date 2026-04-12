import React, { useState } from 'react';
import nw16 from '../../../../assets/nw16.jpg'; // Assuming the iPad handheld image

function Pencil2() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative w-full min-h-screen bg-black text-white font-sans flex flex-col items-center pt-24 pb-20 px-6 overflow-hidden">
      
      {/* Top Headline Section */}
      <div className="text-center z-10 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h2 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight">
          Doesn't Matter.<br />
          Where you are! grab it and connect.
        </h2>
      </div>

      {/* Main Feature Image (iPad in hands) */}
      <div className="relative w-full max-w-5xl mx-auto mb-20 group">
        <img 
          src={nw16} 
          alt="Connectivity Features" 
          className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>

      {/* Technical Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl px-4 md:px-10">
        
        {/* Left Column: Paragraphs */}
        <div className="space-y-6 text-[#86868b] text-lg leading-relaxed">
          <p>
            Workflows go wherever you do with the better performance and 
            reliability of <span className="text-white font-medium">Studly pro,</span> Cloud 6, 
            and Thread — all enabled by N1, our new wireless networking Access.
          </p>
          <p>
  Studly’s next-generation <span className="text-white font-medium">AI Learning Engine</span> delivers 
  faster, more efficient course recommendations while adapting in real time to your progress. 
  It ensures seamless access to lessons, assignments, and resources from anywhere in the world. 
  So you can securely continue learning, collaborate with instructors, and sync your progress 
  across all your devices without interruption.
</p>
        </div>

        {/* Right Column: Big Stats */}
        <div className="flex flex-col space-y-8">
          <div>
            <p className="text-[#86868b] text-sm uppercase tracking-widest mb-1">Up to</p>
            <h3 className="text-6xl font-semibold">50% faster</h3>
            <p className="text-[#86868b] text-lg mt-1">Course data performance</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-5xl font-semibold tracking-tight">100% Free</h3>
            <h3 className="text-5xl font-semibold tracking-tight text-[#424245]">Easy Access</h3>
          </div>
        </div>
      </div>

       

    </section>
  );
}

export default Pencil2;