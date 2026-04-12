import React from 'react';
import { motion } from 'framer-motion';
import img2 from '../../../../assets/as4.jpg'; 

const CTASection = () => {
  return (
    <section className="w-full bg-white min-h-[70vh] flex flex-col md:flex-row items-center overflow-hidden">
      
      {/* Left Content Column (50%) */}
      <div className="w-full md:w-1/2 px-8 py-20 md:pl-24 md:pr-12 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold text-black mb-6 tracking-tight leading-[1.1]">
            Ready to transform <br />
            how your team learns?
          </h2>

          <p className="text-xl md:text-2xl text-gray-500 font-medium mb-10 leading-relaxed max-w-lg">
            Join 2 million+ learners on Studly. Build your first course in 15 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <button className="px-10 py-4 bg-[#0071e3] text-white text-lg font-semibold rounded-full hover:bg-[#0077ed] transition-colors duration-300">
              Get started free
            </button>
            
            <button className="flex items-center text-[#0071e3] text-lg font-semibold group">
              Book a demo 
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>

          <p className="mt-12 text-sm text-gray-400 font-medium">
            No credit card required · Setup in minutes
          </p>
        </motion.div>
      </div>

      {/* Right Image Column (50%) */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden">
        <motion.img 
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          src={img2} 
          alt="Learning Platform" 
          className="w-full h-full object-cover"
        />
      </div>

    </section>
  );
};

export default CTASection;