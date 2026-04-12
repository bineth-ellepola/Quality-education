import React from 'react';
import vd1 from '../../../../assets/vd1.mp4'
function Banner() {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-white">
      {/* Background Video Container */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80" // Slight opacity to blend with white bg
        >
          <source src={vd1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Optional Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/10 mix-blend-screen"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-2xl font-semibold tracking-tight text-black flex items-center gap-1">
                <svg className="w-6 h-6 mb-1" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                Studly Plus
            </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-black leading-[1.1]">
          The  <span className="text-[#ff073a]">simplicity</span>  of Studly.<br />
          <span className="text-black/90">In a credit card.</span>
        </h1>

        <div className="mt-10 flex flex-col items-center gap-6">
          <button className="bg-black text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
            Apply now
          </button>
          
          <a href="#" className="text-blue-600 hover:underline text-lg font-medium flex items-center gap-1">
            Learn more 
            <span className="text-sm"> {'>'} </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Banner;