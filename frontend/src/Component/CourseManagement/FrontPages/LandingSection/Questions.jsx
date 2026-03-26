import React, { useState } from 'react';

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

  return (
    <section className="w-full bg-white py-24 px-6 border-t border-gray-50">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Left Side: Static Header Content */}
          <div className="lg:w-1/3">
            <div className="sticky top-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-orange-500" />
                <span className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.4em]">Support Center</span>
              </div>
              <h2 className="text-5xl font-black text-black tracking-tight mb-8">
                FREQUENTLY <br /> ASKED <br /> <span className="text-gray-300">QUESTIONS.</span>
              </h2>
              <p className="text-gray-500 mb-10 max-w-sm leading-relaxed">
                Can't find the answer you're looking for? Our support team is available 24/7 to help you with your learning journey.
              </p>
              <button className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-black hover:text-orange-500 transition-colors">
                Contact Support
                <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-orange-500 transition-all">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* Right Side: Minimalist Accordion */}
          <div className="lg:w-2/3 border-t border-gray-100">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border-b border-gray-100 py-8 cursor-pointer group"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <div className="flex justify-between items-center gap-8">
                  <h3 className={`text-xl font-bold tracking-tight transition-colors ${openIndex === index ? 'text-orange-500' : 'text-black group-hover:text-orange-500'}`}>
                    {faq.question}
                  </h3>
                  <span className={`text-2xl transition-transform duration-300 ${openIndex === index ? 'rotate-45 text-orange-500' : 'text-gray-300'}`}>
                    +
                  </span>
                </div>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-500 leading-relaxed text-lg max-w-2xl">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default FAQSection