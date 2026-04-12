import React from 'react'

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-20 pb-10 px-6">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Top Section: Brand & Primary Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Column 1: Brand Identity */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-black tracking-tighter text-black mb-6">
              STUDLY<span className="text-orange-500">.</span>
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-[240px]">
              Empowering the next generation of digital leaders through direct mentorship and industry-certified tracks.
            </p>
            <div className="flex gap-4">
              {['fb', 'tw', 'ln', 'ig'].map((social) => (
                <div key={social} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 hover:border-orange-500 hover:text-orange-500 cursor-pointer transition-all">
                  {social.toUpperCase()}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Learning */}
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-8">Learning</h3>
            <ul className="space-y-4">
              {['Data Science', 'UX Design', 'Business Strategy', 'Web Development', 'Marketing'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Professional */}
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-8">Professional</h3>
            <ul className="space-y-4">
              {['For Enterprise', 'For Government', 'Mentorship', 'Degree Programs', 'Certificates'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Community */}
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-8">Community</h3>
            <ul className="space-y-4">
              {['Learners', 'Partners', 'Developers', 'Transactions', 'Teaching Center'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Legal & More */}
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-8">Resources</h3>
            <ul className="space-y-4">
              {['Help Center', 'Careers', 'Contact', 'Blog', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Section: Global Reach / Newsletter Integration */}
        <div className="py-12 border-y border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] text-gray-400 font-bold">
                  {i}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                +50k
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">Join 50,000+ learners worldwide.</p>
          </div>
          
          <div className="flex w-full lg:w-auto max-w-md">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-gray-50 border border-gray-200 px-6 py-4 text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Section: Compliance & App Stores */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
            <span>© 2026 Studly Learning Inc. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-black">Privacy</a>
              <a href="#" className="hover:text-black">Terms</a>
              <a href="#" className="hover:text-black">Sitemap</a>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="px-4 py-2 border border-gray-200 rounded flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-4 h-4 bg-black rounded-sm" />
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] text-gray-500 uppercase">Download on</span>
                  <span className="text-[10px] font-bold text-black">App Store</span>
                </div>
             </div>
             <div className="px-4 py-2 border border-gray-200 rounded flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-4 h-4 bg-orange-500 rounded-sm" />
                <div className="flex flex-col leading-none">
                  <span className="text-[8px] text-gray-500 uppercase">Get it on</span>
                  <span className="text-[10px] font-bold text-black">Google Play</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer