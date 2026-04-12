import React from 'react';
import { Link } from "react-router-dom";
import walp from '../../../../assets/wl.jpg'

import walp2 from '../../../../assets/wl2.webp'

function DesignShowcase() {
  return (
    <div className="bg-white min-h-screen">
      <div className="p-[80px_60px] max-w-[1440px] mx-auto">
        <div className="flex gap-[60px]">
          {/* Left Column: Text Content */}
          <div className="flex-1 max-w-[560px]">
            <h1 className="text-[72px] font-bold text-[#0D0F12] leading-[78px] tracking-[-1.5px] mb-[32px]">
              <span className="text-[#ff073a]">Deliver</span>  rich experiences
            </h1>
            <p className="text-[20px] leading-[30px] text-[#333A44] mb-[80px] max-w-[480px]">
              Create immersive, engaging sites that capture attention and keep users exploring.
            </p>

            {/* Set your site in motion - Grayed Title */}
            <h2 className="text-[24px] font-semibold text-[#828282] leading-[30px] mb-[40px]">
              Set your site in motion
            </h2>
            
            {/* Divider */}
            <hr className="border-t border-[#E0E0E0] mb-[32px]" />

            {/* Make content work harder - Red Section */}
            <div className="space-y-[16px]">
              <h2 className="text-[24px] font-semibold text-[#0D0F12] leading-[30px]">
                Make content work harder
              </h2>
              <p className="text-[16px] leading-[24px] text-[#333A44] max-w-[480px]">
                Give non-technical teammates the tools to publish and update content fast — without engineering overhead.
              </p>
              <a href="#" className="inline-flex items-center text-[#4353FF] font-medium text-[16px] leading-[24px] group">
                Discover the CMS 
                <span className="ml-[8px] transform transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* Get discovered in AI search - Grayed Title */}
            <h2 className="text-[24px] font-semibold text-[#828282] leading-[30px] mt-[60px]">
              Get discovered in AI search
            </h2>
          </div>

          {/* Right Column: Webflow Designer Interface */}
          <div className="flex-1 relative">
            <div className="bg-white rounded-[8px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] overflow-hidden border border-[#E0E0E0]">
              
              {/* Fake Webflow Toolbar */}
              <div className="bg-[#1F1F1F] text-[#CCCCCC] text-[12px] p-[8px_16px] flex items-center justify-between border-b border-[#333]">
                <div className="flex items-center gap-[12px]">
                  {/* Webflow Logo Icon */}
                  <div className="w-[18px] h-[18px] text-[#4353FF]">
                      <svg viewBox="0 0 100 100" className="fill-current"><path d="M96.7,21C91,13.2,81.4,8.5,71.2,8.5C61,8.5,51.4,13.2,45.7,21l-3.2,4.4V0H0v100h42.5V74.6l3.2,4.4c5.7,7.8,15.3,12.5,25.5,12.5c10.2,0,19.8-4.7,25.5-12.5l3.3-4.5V25.5L96.7,21z M42.5,49.2V27.5l2.4-3.3c3.9-5.3,10-8.5,16.5-8.5c6.5,0,12.6,3.2,16.5,8.5l2.4,3.3V49.2H42.5z M42.5,72.5V51.7h37.8v20.8l-2.4,3.3c-3.9,5.3-10,8.5-16.5,8.5c-6.5,0-12.6-3.2-16.5-8.5L42.5,72.5z"/></svg>
                  </div>
                  <span>Design</span>
                  <span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                  <span className="opacity-50">App gem</span>
                  <span className="opacity-50">CMS</span>
                  <span className="opacity-50">Insights</span>
                </div>
                <div className="flex items-center gap-[12px] opacity-50">
                  <span>Base site</span>
                  <span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                  <span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg></span>
                </div>
              </div>

              {/* Designer Content Area */}
              <div className="p-[40px]">
                <div className="flex justify-between items-start">
                  {/* Left part of inner content: Logo, Text, etc. */}
                  <div>
                    <img src={walp} />
                    <h1 className="text-[80px] font-bold text-[#0D0F12] leading-[1]">23%</h1>
                    <p className="text-[20px] font-medium text-[#0D0F12] mb-[32px]">more organic search traffic</p>

                    {/* Customer Stories Section with Blue Border */}
                    <div className="relative border-l-[3px] border-[#4353FF] pl-[24px] py-[8px]">
                      {/* Quote card pill tag */}
                      <div className="absolute top-0 left-0 -translate-y-[24px] bg-[#4353FF] text-white text-[12px] px-[8px] py-[2px] rounded-[4px] font-mono flex items-center gap-[4px]">
                        T quote_card-quote
                        <span className="opacity-70"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
                      </div>
                      <blockquote className="text-[20px] font-medium leading-[30px] text-[#0D0F12]">
                        "Webflow empowers us to do our best as marketers, designers and creators: It strips away technical complexity and unleashes our creative, try new things, and move quickly."
                      </blockquote>
                      
                      <div className="flex items-center gap-[12px] mt-[24px]">
                        <img src={walp2}/>
                        <div>
                          <p className="font-semibold text-[#0D0F12]">Kokko Tso</p>
                          <p className="text-[14px] text-[#828282]">Vice President of Digital Marketing, Walker & Dunlop</p>
                        </div>
                      </div>
                    </div>

                    <a href="#" className="inline-flex items-center text-[#4353FF] font-medium text-[16px] leading-[24px] mt-[40px] group">
                      Read customer story 
                      <span className="ml-[8px] transform transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>

                  {/* Right part: Empty space, maybe a placeholder */}
                  <div className="w-[100px] h-[100px] bg-white rounded-[8px] border border-[#E0E0E0]"></div>
                </div>
              </div>

              {/* Disconnect Property Modal (Floating Over Right Side) */}
              <div className="absolute top-[80px] right-[-100px] w-[320px] bg-[#2E2E2E] rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-[#444] text-[#E0E0E0] text-[12px] p-[16px]">
                <div className="flex justify-between items-center mb-[16px]">
                  <h3 className="font-semibold text-[14px]">Disconnect property</h3>
                  <button className="text-[#888] hover:text-white">✕</button>
                </div>
                
                <div className="mb-[16px]">
                  <p className="text-[#AAAAAA] mb-[8px]">Connect to data</p>
                  <div className="flex items-center gap-[8px] text-white">
                    <span className="text-[#AAAAAA]">{'<>'}</span>
                    Customer stories
                    <span className="text-[#AAAAAA]"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
                  </div>
                </div>

                {/* List of Properties */}
                <div className="space-y-[10px] pl-[16px] border-l border-[#444]">
                  {[
                    { type: 'T', name: 'Name', checked: false },
                    { type: '🔗', name: 'Button URL', checked: false },
                    { type: 'T', name: 'Customer first and last name', checked: false },
                    { type: 'T', name: 'Customer job title', checked: false },
                    { type: 'T', name: 'Customer quote', checked: true }, // This is the checked one
                    { type: 'T', name: 'Key metric', checked: false },
                    { type: 'T', name: 'Key metric description', checked: false },
                    { type: 'T', name: 'Slug', checked: false },
                    { type: '#', name: 'Sort order', checked: false },
                    { type: 'T', name: 'Thumbnail image alt text', checked: false },
                    { type: '▷', name: 'Video URL', checked: false },
                    { type: '📅', name: 'Created On', checked: false },
                    { type: '📅', name: 'Published On', checked: false },
                    { type: '📅', name: 'Updated On', checked: false },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-[2px] cursor-pointer hover:bg-[#3A3A3A] px-[4px] rounded-[2px]">
                      <div className="flex items-center gap-[10px]">
                        <span className={`font-mono text-[10px] ${item.checked ? 'text-[#4353FF]' : 'text-[#AAAAAA]'}`}>{item.type}</span>
                        <span className={item.checked ? 'text-white font-medium' : 'text-[#CCCCCC]'}>{item.name}</span>
                      </div>
                      {item.checked && (
                        <span className="text-[#4353FF]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Left-side Vertical Tool Palette Placeholder */}
            <div className="absolute top-[80px] left-[-60px] flex flex-col items-center gap-[12px] bg-[#1F1F1F] p-[12px_8px] rounded-[4px] text-[#AAAAAA] text-[18px]">
                <span>A</span>
                <span className="w-4 h-px bg-[#444] my-[4px]"></span>
                <span className="text-[#4353FF]">□</span>
                <span>≡</span>
                <span>▷</span>
                <span>⊞</span>
                <span>○</span>
                <span>+</span>
            </div>

          </div>
        </div>
      </div>

      <Link to="/help">
       {/* Footer / Made in Webflow Badge */}
      <div className="fixed bottom-[20px] right-[20px] bg-white rounded-full p-[6px_14px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-[#E0E0E0] flex items-center gap-[8px] text-[12px] font-medium text-[#0D0F12]">
        <div className="w-[16px] h-[16px] text-[#4353FF]">
            <svg viewBox="0 0 100 100" className="fill-current"><path d="M96.7,21C91,13.2,81.4,8.5,71.2,8.5C61,8.5,51.4,13.2,45.7,21l-3.2,4.4V0H0v100h42.5V74.6l3.2,4.4c5.7,7.8,15.3,12.5,25.5,12.5c10.2,0,19.8-4.7,25.5-12.5l3.3-4.5V25.5L96.7,21z M42.5,49.2V27.5l2.4-3.3c3.9-5.3,10-8.5,16.5-8.5c6.5,0,12.6,3.2,16.5,8.5l2.4,3.3V49.2H42.5z M42.5,72.5V51.7h37.8v20.8l-2.4,3.3c-3.9,5.3-10,8.5-16.5,8.5c-6.5,0-12.6-3.2-16.5-8.5L42.5,72.5z"/></svg>
        </div>
        Studly 24/7
      </div>
      </Link>
      
      
    </div>
  );
}

export default DesignShowcase;