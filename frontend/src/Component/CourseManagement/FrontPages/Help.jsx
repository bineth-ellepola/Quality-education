import React from 'react';
import { Search, BookOpen, User, CreditCard, PlayCircle, MessageCircle, ArrowRight, LifeBuoy } from 'lucide-react';
import Header from '../FrontPages/HeaderSection/Header'
import Footer from '../FrontPages/LandingSection/Footer'

const Help = () => {
  const categories = [
    { icon: <User size={24} />, title: 'Account & Profile', desc: 'Manage your subscription and personal settings.' },
    { icon: <BookOpen size={24} />, title: 'Course Management', desc: 'How to enroll, track progress, and earn certificates.' },
    { icon: <PlayCircle size={24} />, title: 'Learning Tools', desc: 'Mastering the interactive player and offline mode.' },
    { icon: <CreditCard size={24} />, title: 'Billing & Payments', desc: 'Invoices, refunds, and secure payment methods.' },
  ];

  const featuredArticles = [
    "Getting started with Studly Pro",
    "How to sync progress across devices",
    "Setting up your instructor dashboard",
    "Understanding peer-review assignments"
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-white font-sans text-black selection:bg-[#FF5722] selection:text-white">
        
        {/* Minimal Hero Section */}
        <section className="pt-24 pb-20 px-6 border-b border-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
               <span className="w-8 h-[2px] bg-[#FF5722]"></span>
               <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#FF5722]">Support Portal</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-10 leading-[1.1]">
              How can we <br />
              <span className="text-gray-400">help you excel?</span>
            </h1>
            
            <div className="relative max-w-3xl group">
              <Search className="absolute left-6 top-1/2 -transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5722] transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Search documentation..." 
                className="w-full pl-16 pr-6 py-6 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF5722] focus:bg-white transition-all shadow-sm text-lg outline-none"
              />
            </div>
          </div>
        </section>

        {/* Category Tiles */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <div key={index} className="group p-10 bg-white border border-gray-100 rounded-[2rem] hover:border-[#FF5722] transition-all duration-500 cursor-pointer flex flex-col justify-between aspect-square">
                <div className="text-black group-hover:text-[#FF5722] group-hover:scale-110 transition-all duration-500 origin-left">
                  {cat.icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF5722] transition-colors">{cat.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Split Section */}
        <section className="max-w-6xl mx-auto px-6 pb-32">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Featured List */}
            <div className="lg:col-span-7">
              <h2 className="text-xs uppercase tracking-[0.4em] text-gray-400 font-bold mb-10">Popular Resources</h2>
              <div className="space-y-2">
                {featuredArticles.map((article, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer">
                    <span className="text-lg font-medium group-hover:translate-x-2 transition-transform duration-300">{article}</span>
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:bg-[#FF5722] group-hover:text-white transition-all">
                        <ArrowRight size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Support Card */}
            <div className="lg:col-span-5 sticky top-10">
              <div className="bg-black text-white p-12 rounded-[2.5rem] relative overflow-hidden group">
                {/* Abstract Decorative Element */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF5722] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                
                <LifeBuoy className="text-[#FF5722] mb-8" size={40} />
                <h2 className="text-3xl font-bold mb-6">Human Support.</h2>
                <p className="text-gray-400 font-light mb-10 leading-relaxed text-lg">
                  Can't find what you need? Our concierge team is ready to provide a personalized solution.
                </p>
                
                <a 
                  href="mailto:chathurachamod88@gmail.com?subject=Studly%20Support" 
                  className="inline-flex items-center justify-center gap-3 bg-[#FF5722] text-white py-5 px-10 rounded-2xl font-bold hover:bg-[#e64a19] transition-all active:scale-95 w-full shadow-lg shadow-[#FF5722]/20"
                >
                  <MessageCircle size={20} />
                  Contact Concierge
                </a>
                
                <p className="mt-8 text-center text-xs text-gray-500 font-medium uppercase tracking-widest">
                    Response time: &lt; 2 Hours
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Help;