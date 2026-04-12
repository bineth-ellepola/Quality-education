import React from 'react';
import sm12 from '../../../../assets/sm11.jpg'; // Assuming the image is named sm12.png and in the same directory

function AppleSection() {
  return (
    <div className="flex flex-col md:flex-row bg-[#f5f5f7] rounded-3xl p-12 md:p-16 max-w-7xl mx-auto my-12">
      <div className="md:w-1/2 md:pr-16 flex flex-col justify-center">
        <h2 className="text-5xl md:text-6xl font-semibold text-[#1d1d1f] leading-tight mb-8">
          Unlock the world of <span className="bg-gradient-to-r from-[#ff2d55] via-[#ff3b30] to-[#ff9500] bg-clip-text text-transparent font-semibold">
  Online Learning.
</span> 
        </h2>
        
        <div className="space-y-6">
          <details className="group border-b border-gray-300 pb-6" open>
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-2xl font-medium text-[#1d1d1f]">
                Live in your computer
              </span>
              <span className="text-2xl text-gray-400 group-open:rotate-180 transition-transform">
                &#94;
              </span>
            </summary>
            <p className="text-[#1d1d1f] text-lg leading-relaxed pt-6">
              Learn with Studly LMS from anywhere, on any device. Start a lesson on your laptop, continue it on your phone, and pick up right where you left off without losing progress. Watch interactive video lectures, take quizzes in real time, and get instant feedback from instructors and AI-powered hints. Collaborate with classmates through discussion boards, share notes seamlessly across devices, and submit assignments with a single click. With cloud-synced progress, smart reminders, and personalized learning paths, Studly keeps your education connected, flexible, and always within reach. And so much more.
            </p>
          </details>

          <details className="group border-b border-gray-300 pb-6">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-2xl font-medium text-[#1d1d1f]">
                Your Account and Cloud
              </span>
              <span className="text-2xl text-gray-400 group-open:rotate-180 transition-transform">
                &#94;
              </span>
            </summary>
            {/* Add content for Mac and iPad here */}
          </details>

          <details className="group pb-6">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-2xl font-medium text-[#1d1d1f]">
                Studly free Storage
              </span>
              <span className="text-2xl text-gray-400 group-open:rotate-180 transition-transform">
                &#94;
              </span>
            </summary>
            {/* Add content for Mac and Apple Watch here */}
          </details>
        </div>
      </div>
      
      <div className="md:w-1/2 flex items-center justify-center mt-12 md:mt-0">
        <img src={sm12} alt="Mac and iPhone continuity features" className="max-w-full h-auto" />
      </div>
    </div>
  );
}

export default AppleSection;