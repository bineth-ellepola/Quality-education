import React from 'react';
import { motion } from 'framer-motion';

// Assuming nw13 is the background image of the TV interface
import nw13 from '../../../../assets/nw7.jpg'; 

function HomeControl() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] py-24 px-6 md:px-12 font-sans overflow-hidden">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto text-center mb-20">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-lg md:text-xl font-semibold text-gray-900 mb-4 block"
        >
          Your control
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1]"
        >
          Free. Contents. <br />
          Smart Lerning interactions.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed"
        >
         Studly LMS acts as your all-in-one learning hub that helps automate — and give you remote access to — all of your courses, assignments, and study materials. 
  It keeps your learning environment connected so you can track progress, manage tasks, and continue your education from anywhere, anytime.
        </motion.p>
      </div>

      {/* Feature Card Section */}
      <div className="max-w-7xl mx-auto bg-white rounded-[3rem] overflow-hidden shadow-sm flex flex-col md:flex-row items-center">
        
        {/* Left Side: The Image/UI */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={nw13} 
              alt="Smart Home Interface" 
              className="w-full h-auto object-cover scale-105 transition-transform duration-700 hover:scale-100"
            />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-2/5 p-8 md:p-16">
          <div className="max-w-sm">
            <h3 className="text-blue-600 text-xl font-semibold mb-2">
              Smart Learning hub
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Everything at your  under control.
            </h2>
           <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium">
  Manage all your learning tools in one place with Studly’s intuitive Learning Dashboard. 
  Studly seamlessly organizes your courses, assignments, and progress tracking, while integrating 
  with multiple learning resources and platforms so you can access everything you need in one unified experience.
</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeControl;