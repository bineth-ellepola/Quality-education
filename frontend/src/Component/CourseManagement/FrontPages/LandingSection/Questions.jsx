import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How does the direct mentorship program work?",
      answer: "Our mentorship is built on 1-on-1 weekly syncs with industry experts. You are matched with a mentor based on your career goals and current skill level to ensure personalized growth."
    },
    {
      question: "Can I switch learning tracks mid-course?",
      answer: "Yes. Studly offers a flexible transition policy. If you find another track better suited to your career trajectory, you can switch within the first 30 days of your program."
    },
    {
      question: "Are the professional certificates recognized globally?",
      answer: "Absolutely. Our certifications are co-signed by our global industry partners and include a unique digital ID that can be verified by employers worldwide on the Studly platform."
    },
    {
      question: "What are the prerequisites for the Expert tracks?",
      answer: "Prerequisites vary by course. However, most 'Expert' level tracks require a foundational understanding of the subject or completion of our 'Core' module."
    },
    {
      question: "Is there a corporate discount for team enrollment?",
      answer: "We offer tailored packages for teams of 5 or more. This includes a dedicated dashboard for progress tracking and custom learning paths designed for your company's needs."
    }
  ];

  const appleRed = "#ff3b30";

  return (
    <section className="w-full bg-white py-32 px-6 overflow-hidden">
      <div className="max-w-[1024px] mx-auto">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          
          {/* Left Side: Header */}
          <div className="md:w-1/3">
            <div className="md:sticky md:top-24">
              <span className="text-[14px] font-semibold text-[#6e6e73] mb-4 block tracking-tight">
                Support Center
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] tracking-tight leading-tight mb-8">
                Questions? <br />
                We have answers.
              </h2>
              <p className="text-[#6e6e73] text-[17px] font-medium leading-relaxed mb-10 max-w-sm">
                Can't find what you're looking for? Our support team is available 24/7.
              </p>
              <button 
                style={{ color: appleRed }}
                className="group flex items-center gap-2 text-[17px] font-semibold hover:underline decoration-2"
              >
                Contact Support
                <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>

          {/* Right Side: Refined Accordion */}
          <div className="md:w-2/3 border-t border-[#d2d2d7]">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border-b border-[#d2d2d7] py-8 cursor-pointer overflow-hidden"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <div className="flex justify-between items-center gap-8 group">
                  <h3 className={`text-xl md:text-[21px] font-semibold tracking-tight transition-colors duration-300 ${openIndex === index ? 'text-[#1d1d1f]' : 'text-[#424245] group-hover:text-[#1d1d1f]'}`}>
                    {faq.question}
                  </h3>
                  <div 
                    className="text-3xl font-light transition-transform duration-500 ease-[0.16, 1, 0.3, 1]"
                    style={{ 
                      transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)',
                      color: openIndex === index ? appleRed : '#86868b'
                    }}
                  >
                    +
                  </div>
                </div>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="text-[#6e6e73] leading-relaxed text-[17px] font-medium max-w-xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default FAQSection;